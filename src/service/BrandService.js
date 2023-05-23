import HTTP from '@/plugins/axios-config-base.js';

const CATALOG_BASE_URL = 'brands';

export default class BrandService {
    async readCatalogs(params) {
        const URL = `${CATALOG_BASE_URL}?page=${params.page}&pageSize=${params.pageSize}&QueryParam=${params.search}`;
        const response = await HTTP.get(URL);
        return response;
    }

    async readCatalogsAll() {
        const URL = `${CATALOG_BASE_URL}/all`;
        const response = await HTTP.get(URL);
        return response;
    }

    async readCatalog(id) {
        const URL = `${CATALOG_BASE_URL}/${id}`;
        const response = await HTTP.get(URL);
        return response;
    }

    async createCatalog(catalog) {
        const URL = `${CATALOG_BASE_URL}`;
        const response = await HTTP.post(URL, catalog);
        return response;
    }

    async updateCatalog(catalog) {
        const URL = `${CATALOG_BASE_URL}/${catalog.id}`;
        const response = await HTTP.put(URL, catalog);
        return response;
    }

    async deleteCatalog(id) {
        const URL = `${CATALOG_BASE_URL}/${id}`;
        const response = await HTTP.delete(URL);
        return response;
    }
}
