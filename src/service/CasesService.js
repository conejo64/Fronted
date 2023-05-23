import HTTP from '@/plugins/axios-config-base.js';

const CASE_BASE_URL = 'cases';

export default class CasesService {
    async readCases(params) {
        const URL = `${CASE_BASE_URL}?page=${params.page}&pageSize=${params.pageSize}&originDocumentId=${params.originDocumentId}
            &departmentId=${params.departmentId}&caseStatusId=${params.caseStatusId}&initialDate=${params.initialDate}&finalDate=${params.finalDate}`;
        const response = await HTTP.get(URL);
        return response;
    }

    async readOtherCases(params) {
        const URL = `${CASE_BASE_URL}/others?page=${params.page}&pageSize=${params.pageSize}&originDocumentId=${params.originDocumentId}
            &departmentId=${params.departmentId}&caseStatusId=${params.caseStatusId}&initialDate=${params.initialDate}&finalDate=${params.finalDate}`;
        const response = await HTTP.get(URL);
        return response;
    }

    async readCasesAll() {
        const URL = `${CASE_BASE_URL}/all`;
        const response = await HTTP.get(URL);
        return response;
    }

    async readCase(id) {
        const URL = `${CASE_BASE_URL}/${id}`;
        const response = await HTTP.get(URL);
        return response;
    }

    async createCase(obj) {
        const URL = `${CASE_BASE_URL}`;
        const response = await HTTP.post(URL, obj);
        return response;
    }

    async updateCase(obj) {
        const URL = `${CASE_BASE_URL}/${obj.id}`;
        const response = await HTTP.put(URL, obj);
        return response;
    }

    async deleteCase(id) {
        const URL = `${CASE_BASE_URL}/${id}`;
        const response = await HTTP.delete(URL);
        return response;
    }

    async updateInformationCase(id, obj) {
        const URL = `${CASE_BASE_URL}/${id}/information`;
        const response = await HTTP.post(URL, obj);
        return response;
    }

    async closeCase(id, obj) {
        const URL = `${CASE_BASE_URL}/${id}/close`;
        const response = await HTTP.post(URL, obj);
        return response;
    }

    async extensionCase(id, obj) {
        const URL = `${CASE_BASE_URL}/${id}/extend`;
        const response = await HTTP.post(URL, obj);
        return response;
    }

    async replyCase(id, obj) {
        const URL = `${CASE_BASE_URL}/${id}/reply`;
        const response = await HTTP.post(URL, obj);
        return response;
    }

    async notificationCase(id, obj) {
        const URL = `${CASE_BASE_URL}/${id}/notification`;
        const response = await HTTP.post(URL, obj);
        return response;
    }

    async getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    }

    async attachementsCase(id) {
        const URL = `${CASE_BASE_URL}/${id}/attachments`;
        const response = await HTTP.get(URL);
        return response;
    }

    async openAttachementCase(caseId, attachmentId) {
        const URL = `${CASE_BASE_URL}/${caseId}/attachment/${attachmentId}`;
        // const response = await HTTP.get(URL);
        // return response;
        //window.open(`${HTTP.defaults.baseURL}/${URL}`, '_blank');
        window.location.href = `${HTTP.defaults.baseURL}/${URL}?target=_blank`;
    }
}
