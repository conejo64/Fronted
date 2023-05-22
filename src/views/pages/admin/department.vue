<!-- eslint-disable prettier/prettier -->
<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import DepartmentService from '@/service/DepartmentService';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const catalogs = ref(null);
const catalogModel = {
    description: ref(null)
};
const loadingPage = ref(false);
const pagination = ref({
    page: 0,
    pageSize: 10,
    total: 0
});
const elementDialog = ref(false);
const deleteElementDialog = ref(false);
const deleteElementsDialog = ref(false);
const catalog = ref({});
const selectedElements = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
const catalogService = new DepartmentService();

onBeforeMount(() => {
    initFilters();
});
onMounted(() => {
    loadData();
});

const loadData = () => {
    loadingPage.value = true;
    const ff = filters.value['global'].value ?? '';
    const paginate = {
        page: 1,
        pageSize: 10,
        search: ff
    };
    catalogService
        .readCatalogs(paginate)
        .then((data) => {
            catalogs.value = data.data.entities;
            pagination.value = data.data.pagination;
        })
        .finally(() => {
            loadingPage.value = false;
        });
};

const onPage = (event) => {
    loadingPage.value = true;
    const { page, rows } = event;

    const paginate = {
        page: page + 1,
        pageSize: rows,
        search: ''
    };
    catalogService.readCatalogs(paginate).then((data) => {
        catalogs.value = data.data.entities;
        pagination.value = data.data.pagination;
    })
        .finally(() => {
            loadingPage.value = false;
        });
};

const openNew = () => {
    catalog.value = {};
    submitted.value = false;
    elementDialog.value = true;
};

const hideDialog = () => {
    elementDialog.value = false;
    submitted.value = false;
};

const saveElement = () => {
    submitted.value = true;
    if (catalog.value.id) {
        catalogService.updateCatalog(catalog.value).then((result) => {
            if (result.status == 200 || result.status == 201) {
                toast.add({ severity: 'success', summary: 'Created', detail: 'Registro actualizado correctamente!', life: 3000 });
                close();
                loadData();
            } else {
                toast.add({ severity: 'error', summary: 'Deleted', detail: 'Error creating record!', life: 3000 });
            }
        });
    } else{
        let model = {
            description: catalog.value.description
        };
        catalogService.createCatalog(model).then((result) => {
            if (result.status == 200 || result.status == 201) {
                toast.add({ severity: 'success', summary: 'Created', detail: 'Record created successfully!', life: 3000 });
                close();
                loadData();
            } else {
                toast.add({ severity: 'error', summary: 'Deleted', detail: 'Error creating record!', life: 3000 });
            }
        });
    }

    catalogModel.value = null;
    elementDialog.value = false;
};

const editCatalog = (editCatalog) => {
    catalog.value = { ...editCatalog };
    elementDialog.value = true;
};

const confirmDeleteElement = (editCatalog) => {
    catalog.value = editCatalog;
    deleteElementDialog.value = true;
};

const deleteElement = () => {
    catalogs.value = catalogs.value.filter((val) => val.id !== catalog.value.id);
    deleteElementDialog.value = false;
    catalog.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Item eliminado', life: 3000 });
};

const confirmDeleteSelected = () => {
    deleteElementsDialog.value = true;
};
const deleteSelectedElements = () => {
    catalogs.value = catalogs.value.filter((val) => !selectedElements.value.includes(val));
    deleteElementsDialog.value = false;
    selectedElements.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Items eliminados', life: 3000 });
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
            <div class="card">
                <Toast />
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Button label="Agregar" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
                            <Button label="Eliminar" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedElements || !selectedElements.length" />
                        </div>
                    </template>
                </Toolbar>

                <DataTable
                    ref="dt"
                    :value="catalogs"
                    v-model:selection="selectedElements"
                    dataKey="id"
                    :paginator="true"
                    :rows="pagination.pageSize"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Mostrar {first} to {last} of {totalRecords} registros"
                    responsiveLayout="scroll"
                    :totalRecords="pagination.total" 
                    @page="onPage($event)"
                    lazy
                    :loading="loadingPage"
                >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">Departamento</h5>
                            <span class="block mt-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global'].value" placeholder="Buscar..." @change="loadData" />
                            </span>
                        </div>
                    </template>

                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                    <Column field="description" header="Descripción" :sortable="true" headerStyle="width:90%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Descripción</span>
                            {{ slotProps.data.description }}
                        </template>
                    </Column>
                    <Column headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editCatalog(slotProps.data)" />
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteElement(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="elementDialog" :style="{ width: '450px' }" header="Detalles" :modal="true" class="p-fluid">
                    <div class="field">
                        <label for="name">Descripción</label>
                        <InputText id="name" v-model.trim="catalog.description" required="true" autofocus :class="{ 'p-invalid': submitted && !catalog.description }" />
                        <small class="p-invalid" v-if="submitted && !catalog.description">Descripción es requerido.</small>
                    </div>
                    <template #footer>
                        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="saveElement" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteElementDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="catalog">
                            Desea eliminar el registro <b>{{ catalog.description }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteElementDialog = false" />
                        <Button label="Si" icon="pi pi-check" class="p-button-text" @click="deleteElement" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteElementsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="catalog">Desea eliminar todos los elementos seleccionados?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteElementsDialog = false" />
                        <Button label="Si" icon="pi pi-check" class="p-button-text" @click="deleteSelectedElements" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/demo/styles/badges.scss';
</style>
