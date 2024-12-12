import fp from 'fastify-plugin';
import appInfo from "../appInfo.js";
import crypto from "node:crypto";
import dayjs from 'dayjs';

const generateRandom6DigitNumber = () => {
    const randomNumber = Math.random() * 1000000;
    return Math.floor(randomNumber).toString().padStart(6, '0');
}

const userNameIsEmail = (username) => {
    return /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(username);
}

const md5 = value => {
    const hash = crypto.createHash('md5');
    hash.update(value);
    return hash.digest('hex');
};

const accountService = fp(async (fastify, options) => {
    const {models, services} = fastify[appInfo.name];

    const verificationCodeValidate = async ({name, type, code}) => {
        const verificationCode = await models.verificationCode.findOne({
            where: {
                name, type, code, status: {
                    [fastify.sequelize.Sequelize.Op.or]: [0, 1]
                }
            }
        });
        const isPass = !!(verificationCode && dayjs().isBefore(dayjs(verificationCode.createdAt).add(10, 'minute')));

        if (verificationCode) {
            verificationCode.status = isPass ? 1 : 2;
            await verificationCode.save();
        }

        return isPass;
    };

    const generateVerificationCode = async ({name, type}) => {
        const code = generateRandom6DigitNumber();
        await models.verificationCode.update({
            status: 2
        }, {
            where: {
                name, type, status: 0
            }
        });
        await models.verificationCode.create({
            name, type, code
        });
        return code;
    };

    const sendVerificationCode = async ({name, type}) => {
        // messageType: 0:短信验证码，1:邮件验证码 type: 0:注册,2:登录,4:验证租户管理员,5:忘记密码
        const code = await generateVerificationCode({name, type});
        const isEmail = userNameIsEmail(name);
        // 这里写发送逻辑
        await options.sendMessage({name, type, messageType: isEmail ? 1 : 0, props: {code}});
        return code;
    };

    const sendJWTVerificationCode = async ({name, type}) => {
        const code = await generateVerificationCode({name, type});
        const token = fastify.jwt.sign({name, type, code});
        const isEmail = userNameIsEmail(name);
        // 这里写发送逻辑
        await options.sendMessage({name, type, messageType: isEmail ? 1 : 0, props: {token}});
        return token;
    };

    const verificationJWTCodeValidate = async ({token}) => {
        const {iat, name, type, code} = fastify.jwt.decode(token);
        if (!(await verificationCodeValidate({name, type, code}))) {
            throw new Error('验证码不正确或者已经过期');
        }
        return {name, type, code};
    };

    const passwordEncryption = async password => {
        const salt = await bcrypt.genSalt(10);
        const combinedString = password + salt;
        const hash = await bcrypt.hash(combinedString, salt);

        return {
            password: hash, salt
        };
    };

    const register = async ({
                                avatar,
                                nickname,
                                gender,
                                birthday,
                                description,
                                phone,
                                email,
                                code,
                                password,
                                status,
                                invitationCode
                            }) => {
        const type = phone ? 0 : 1;
        if (!(await verificationCodeValidate({name: type === 0 ? phone : email, type: 0, code}))) {
            throw new Error('验证码不正确或者已经过期');
        }

        return await services.user.addUser({
            avatar, nickname, gender, birthday, description, phone, email, password, status
        });
    };
    services.account = {
        generateRandom6DigitNumber,
        sendVerificationCode,
        sendJWTVerificationCode,
        verificationCodeValidate,
        verificationJWTCodeValidate,
        passwordEncryption,
        register,
        userNameIsEmail,
        md5
    };
});

export default accountService;
