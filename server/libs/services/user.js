import fp from 'fastify-plugin';
import dayjs from 'dayjs';
import bcryptjs from 'bcryptjs';
import crypto from 'node:crypto';
import appInfo from '../appInfo.js';

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

const userService = fp(async (fastify, options) => {
    const {models, services} = fastify[appInfo.name];

    const getUserInfo = async () => {
    };

    const registry = async () => {
    };

    const login = async () => {
    };

    services.user = {userNameIsEmail, generateRandom6DigitNumber, md5};
});

export default userService;
