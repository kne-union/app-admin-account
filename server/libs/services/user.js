import fp from 'fastify-plugin';
import dayjs from 'dayjs';
import bcryptjs from 'bcryptjs';
import {pick, get} from 'lodash-es';
import httpErrors from 'http-errors';
import crypto from 'node:crypto';
import appInfo from '../appInfo.js';

const {Unauthorized} = httpErrors;

const userService = fp(async (fastify, options) => {
    const {models, services} = fastify[appInfo.name];

    const getUserInfo = async (authenticatePayload) => {
        if (!(authenticatePayload && authenticatePayload.id)) {
            throw new Unauthorized();
        }
        const user = await models.user.findOne({
            where: {
                uuid: authenticatePayload.id
            }
        });
        if (!user) {
            throw new Unauthorized();
        }
        return Object.assign({}, pick(user, ['avatar', 'nickname', 'phone', 'email', 'gender', 'status', 'birthday', 'description', 'currentTenantId']), {
            id: user.uuid
        });
    };

    const accountIsExists = async ({email, phone}, currentUser) => {
        const query = [];
        if (email && email !== get(currentUser, 'email')) {
            query.push({email});
        }
        if (phone && phone !== get(currentUser, 'phone')) {
            query.push({phone});
        }

        return (await models.user.count({
            where: {
                [fastify.sequelize.Sequelize.Op.or]: query
            }
        })) > 0;
    };

    const addUser = async ({avatar, nickname, gender, birthday, description, phone, email, password, status}) => {
        if ((await accountIsExists({phone, email})) > 0) {
            throw new Error('手机号或者邮箱都不能重复');
        }
        if (!password) {
            throw new Error('密码不能为空');
        }
        const account = await models.userAccount.create(await services.account.passwordEncryption(password));
        const user = await models.user.create({
            avatar, nickname, gender, birthday, description, phone, email, status, userAccountId: account.uuid
        });
        await account.update({belongToUserId: user.uuid});

        return Object.assign({}, user.get({pain: true}), {id: user.uuid});
    };

    services.user = {getUserInfo, addUser, accountIsExists};
});

export default userService;
