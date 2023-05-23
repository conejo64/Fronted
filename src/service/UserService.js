import HTTP from '@/plugins/axios-config-base.js';

const USER_BASE_URL = 'users';

export default class UserService {
    async readUsers(params) {
        const URL = `${USER_BASE_URL}?page=${params.page}&pageSize=${params.pageSize}&ShowAll=${false}&QueryParam=${params.search}`;
        const response = await HTTP.get(URL);
        return response;
    }

    async readUsersAll() {
        const URL = `${USER_BASE_URL}/all`;
        const response = await HTTP.get(URL);
        return response;
    }

    async readUser(id) {
        const URL = `${USER_BASE_URL}/${id}`;
        const response = await HTTP.get(URL);
        return response;
    }

    async createUser(user) {
        const URL = `${USER_BASE_URL}`;
        const response = await HTTP.post(URL, user);
        return response;
    }

    async updateUser(id, user) {
        const URL = `${USER_BASE_URL}/${id}`;
        const response = await HTTP.put(URL, user);
        return response;
    }

    async deleteUser(id) {
        const URL = `${USER_BASE_URL}/${id}`;
        const response = await HTTP.delete(URL);
        return response;
    }

    async changePass(id, request) {
        const URL = `${USER_BASE_URL}/${id}/changepassword`;
        const response = await HTTP.post(URL, request);
        return response;
    }
}
