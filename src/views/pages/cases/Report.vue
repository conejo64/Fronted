<!-- eslint-disable prettier/prettier -->
<!-- eslint-disable prettier/prettier -->
<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import CasesService from '@/service/CasesService';
import ExportService from '@/service/ExportService';
import OriginDocumentService from '@/service/OriginDocumentService';
import BrandService from '@/service/BrandService';
import DepartmentService from '@/service/DepartmentService';
import StatusService from '@/service/StatusService';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const step1 = ref(true);
const step2 = ref(false);
const loadingPage = ref(false);
const submitted = ref(false);

const products = ref(null);
const pagination = ref({
    page: 0,
    pageSize: 10,
    total: 0
});
const selectedProducts = ref(null);
const dt = ref(null);
const filters = ref({});
const brands = ref(null);
const originDocuments = ref(null);
const departments = ref(null);
const statusCases = ref(null);

const filterModel = ref({
    originDocumentId: '',
    departmentId: '',
    caseStatusId: '',
    initialDate: '',
    finalDate: ''
});

const caseService = new CasesService();
const exportService = new ExportService();
const brandService = new BrandService();
const departmentService = new DepartmentService();
const statusService = new StatusService();
const originDocumentService = new OriginDocumentService();

onBeforeMount(() => {
    initFilters();
});
onMounted(() => {
    loadData();
    loadBrands();
    loadDepartments();
    loadStatuses();
    loadOriginDocuments();
});

const loadData = () => {
    loadingPage.value = true;
    const paginate = {
        page: 1,
        pageSize: 10,
        originDocumentId: filterModel.value.originDocumentId ?? '',
        departmentId: filterModel.value.departmentId ?? '',
        caseStatusId: filterModel.value.caseStatusId ?? '',
        initialDate: filterModel.value.initialDate ?? '',
        finalDate: filterModel.value.finalDate ?? ''
    };
    caseService
        .readCases(paginate)
        .then((data) => {
            products.value = data.data.entities;
            pagination.value = data.data.pagination;
        })
        .finally(() => {
            loadingPage.value = false;
            step1.value = true;
            step2.value = false;
        });
};

const onPage = (event) => {
    loadingPage.value = true;
    const { page, rows } = event;

    const paginate = {
        page: page + 1,
        pageSize: rows,
        originDocumentId: filterModel.value.originDocumentId ?? '',
        departmentId: filterModel.value.departmentId ?? '',
        caseStatusId: filterModel.value.caseStatusId ?? '',
        initialDate: filterModel.value.initialDate ?? '',
        finalDate: filterModel.value.finalDate ?? ''
    };
    caseService
        .readCases(paginate)
        .then((data) => {
            products.value = data.data.entities;
            pagination.value = data.data.pagination;
        })
        .finally(() => {
            loadingPage.value = false;
        });
};

const loadOriginDocuments = () => {
    originDocumentService.readCatalogsAll().then((data) => {
        originDocuments.value = data.data;
    });
};

const loadBrands = () => {
    brandService.readCatalogsAll().then((data) => {
        brands.value = data.data;
    });
};
const loadDepartments = () => {
    departmentService.readCatalogsAll().then((data) => {
        departments.value = data.data;
    });
};
const loadStatuses = () => {
    statusService.readCatalogsAll().then((data) => {
        statusCases.value = data.data;
    });
};

const exportToExcel = () => {
    submitted.value = true;
    exportService
        .exportCasesToExcel(filterModel.value)
        .then(() => {
            toast.add({ severity: 'success', summary: '', detail: 'Archivo exportado', life: 3000 });
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Error exportando archivo', life: 3000 });
        })
        .finally(() => {
            loadData();
            submitted.value = false;
        });
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card" v-if="step1">
                <Toast />
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <div class="formgroup-inline">
                                <div class="p-fluid formgrid grid">
                                    <div class="field col-12 md:col-4">
                                        <label for="firstname1" class="p-sr-only">Origen</label>
                                        <Dropdown id="state" v-model="filterModel.originDocumentId" :options="originDocuments" defaultValue="" optionValue="id" optionLabel="description" placeholder="Origen"></Dropdown>
                                    </div>
                                    <div class="field col-12 md:col-4">
                                        <label for="lastname1" class="p-sr-only">Estado</label>
                                        <Dropdown id="state" v-model="filterModel.caseStatusId" :options="statusCases" optionValue="id" optionLabel="description" placeholder="Estado"></Dropdown>
                                    </div>
                                    <div class="field col-12 md:col-4">
                                        <label for="lastname1" class="p-sr-only">Dirigido a:</label>
                                        <Dropdown id="state" v-model="filterModel.departmentId" :options="departments" optionValue="id" optionLabel="description" placeholder="Dirigido a:"></Dropdown>
                                    </div>
                                    <div class="field col-12 md:col-2">
                                        <label for="lastname1" class="p-sr-only">Fecha Inicio</label>
                                        <Calendar :showIcon="true" :showButtonBar="true" v-model="filterModel.initialDate" placeholder="Fecha Inicio"></Calendar>
                                    </div>
                                    <div class="field col-12 md:col-2">
                                        <label for="lastname1" class="p-sr-only">Fecha Fin</label>
                                        <Calendar :showIcon="true" :showButtonBar="true" v-model="filterModel.finalDate" placeholder="Fecha Fin"></Calendar>
                                    </div>
                                    <div class="field col-12 md:col-2">
                                        <Button label="Buscar" @click="loadData()"></Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </Toolbar>

                <DataTable
                    ref="dt"
                    :value="products"
                    v-model:selection="selectedProducts"
                    dataKey="id"
                    :paginator="true"
                    :rows="pagination.pageSize"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Mostrar {first} a {last} de {totalRecords} casos"
                    responsiveLayout="scroll"
                    :totalRecords="pagination.total"
                    @page="onPage($event)"
                    lazy
                    :loading="loadingPage"
                >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">Reporte de Casos</h5>
                            <Button label="Exportar" icon="pi pi-upload" class="p-button-secondary" @click="exportToExcel()" />
                        </div>
                    </template>

                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                    <Column field="category" header="Fecha Recepción" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Fecha Recepción</span>
                            {{ slotProps.data.receptionDate }}
                        </template>
                    </Column>
                    <Column field="name" header="Recibido Fisico" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Recibido Fisico</span>
                            {{ slotProps.data.physicallyReceived }}
                        </template>
                    </Column>
                    <Column field="code" header="No. Requerimiento" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">No. Requerimiento</span>
                            {{ slotProps.data.documentNumber }}
                        </template>
                    </Column>
                    <Column header="Origen" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Origen</span>
                            {{ slotProps.data.originDocumentDescription }}
                        </template>
                    </Column>
                    <Column field="typeRequirementDescription" header="Tipo Requerimiento" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Tipo Requerimiento</span>
                            {{ slotProps.data.typeRequirementDescription }}
                        </template>
                    </Column>
                    <Column field="departmentDescription" header="Area" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Area</span>
                            {{ slotProps.data.departmentDescription }}
                        </template>
                    </Column>
                    <Column field="category" header="Fecha Vencimiento" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Fecha Vencimiento</span>
                            {{ slotProps.data.dueDate }}
                        </template>
                    </Column>
                    <Column field="inventoryStatus" header="Estado" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Estado</span>
                            {{ slotProps.data.caseStatusDescription }}
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/demo/styles/badges.scss';
</style>
