import HTTP from '@/plugins/axios-config-base.js';

const AUTH_BASE_URL = 'users';

export default class AuthService {
    async loginUser(userLogin) {
        const URL = `${AUTH_BASE_URL}/login`;
        const response = await HTTP.post(URL, userLogin)
        return response;
    }

    async recoverPasswordUser(obj) {
        const URL = `${AUTH_BASE_URL}/recoverpassword`;
        const response = await HTTP.post(URL, obj);
        return response;
    }

    async userMe() {
        const URL = `${AUTH_BASE_URL}/me`;
        const response = await HTTP.get(URL);
        return response;
    }

    async isAuthenticated() {
        const token = localStorage.getItem('token');
        return token ? true : false;
    }
}
