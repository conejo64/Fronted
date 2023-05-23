import HTTP from '@/plugins/axios-config-base.js';

const EXPORT_BASE_URL = 'exports';

export default class ExportService {
    async exportCasesToExcel(obj) {
        const URL = `${EXPORT_BASE_URL}/excel?originDocumentId=${obj.originDocumentId}&departmentId=${obj.departmentId}&caseStatusId=${obj.caseStatusId}&initialDate=${obj.initialDate}&finalDate=${obj.finalDate}`;
        // const response = await HTTP.post(URL, obj);

        window.open(`${HTTP.defaults.baseURL}/${URL}`, '_blank');
        // return response;
    }
}
