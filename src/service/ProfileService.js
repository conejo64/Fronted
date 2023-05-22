import HTTP from '@/plugins/axios-config-base.js';

const PROFILE_BASE_URL = 'profile';

export default class ProfileService {
    async readProfiles(params) {
        const URL = `${PROFILE_BASE_URL}?page=${params.page}&pageSize=${params.pageSize}&ShowAll=${false}&QueryParam=${params.search}`;
        const response = await HTTP.get(URL);
        return response;
    }

    async readProfilesAll() {
        const URL = `${PROFILE_BASE_URL}/all`;
        const response = await HTTP.get(URL);
        return response;
    }

    async readProfile(id) {
        const URL = `${PROFILE_BASE_URL}/${id}`;
        const response = await HTTP.get(URL);
        return response;
    }

    async createProfile(profile) {
        const URL = `${PROFILE_BASE_URL}`;
        const response = await HTTP.post(URL, profile);
        return response;
    }

    async updateProfile(id, profile) {
        const URL = `${PROFILE_BASE_URL}/${id}`;
        const response = await HTTP.patch(URL, profile);
        return response;
    }

    async deleteProfile(id) {
        const URL = `${PROFILE_BASE_URL}/${id}`;
        const response = await HTTP.delete(URL);
        return response;
    }

    async readPermissions() {
        const URL = `${PROFILE_BASE_URL}/permission`;
        const response = await HTTP.get(URL);
        return response;
    }
}
