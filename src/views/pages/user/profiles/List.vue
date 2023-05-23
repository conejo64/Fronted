<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import ProfileService from '@/service/ProfileService';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const step1 = ref(true);
const step2 = ref(false);

const profileValues = ref(null);
const pagination = ref({
    page: 0,
    pageSize: 10,
    total: 0
});
const permissionValues = ref([], []);
const deleteProfileDialog = ref(false);
const deleteProfilesDialog = ref(false);
const profileModel = ref({
    name: '',
    description: ''
});
const profileId = ref(null);
// const ProfileValueName = ref(null);
const selectedProfiles = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
const loadingPage = ref(false);

const profileService = new ProfileService();

onBeforeMount(() => {
    initFilters();
});
onMounted(() => {
    loadData();
    loadPermissions();
});
const loadData = () => {
    const paginate = {
        page: 1,
        pageSize: 10,
        search: ''
    };
    profileService.readProfiles(paginate).then((data) => {
        profileValues.value = data.data.entities;
        pagination.value = data.data.pagination;
    });
};

const loadPermissions = () => {
    loadingPage.value = true;
    profileService
        .readPermissions()
        .then((data) => {
            permissionValues.value[0] = data.data.value;
            permissionValues.value[1] = [];
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: '', detail: 'Error loading Permissions', life: 3000 });
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
    profileService.readProfiles(paginate).then((data) => {
        profileValues.value = data.data.entities;
        pagination.value = data.data.pagination;
    });
};

const openNew = () => {
    step1.value = false;
    step2.value = true;
    profileModel.value = {};
    submitted.value = false;
};

const hideDialog = () => {
    step1.value = true;
    step2.value = false;
    profileModel.value = {};
    submitted.value = false;
};

const saveProfile = () => {
    submitted.value = true;
    if (profileModel.value.name == null || profileModel.value.name == '') {
        toast.add({ severity: 'error', summary: '', detail: 'Nombre requerido', life: 2000 });
    }
    if (permissionValues.value[1].length == 0) {
        toast.add({ severity: 'error', summary: '', detail: 'Debe seleccionar al menos un permiso', life: 2000 });
        return;
    }
    let permissions = [];
    for (let i = 0; i < permissionValues.value[1].length; i++) {
        permissions.push(permissionValues.value[1][i].id);
    }
    let model = {
        name: profileModel.value.name,
        description: profileModel.value.description,
        profilePermissions: permissions
    };
    if (profileId.value != null) {
        profileService
            .updateProfile(profileId.value, model)
            .then(() => {
                toast.add({ severity: 'success', summary: '', detail: 'Perfil actualizado', life: 3000 });
            })
            .catch(() => {
                toast.add({ severity: 'error', summary: '', detail: 'Error actualizando perfil', life: 3000 });
            })
            .finally(() => {
                hideDialog();
                profileModel.value.name = null;
                profileModel.value.description = null;
                permissionValues.value[1] = [];
                submitted.value = false;
                loadData();
            });
    } else {
        profileService
            .createProfile(model)
            .then(() => {
                toast.add({ severity: 'success', summary: 'Created', detail: 'Perfil creado correctamente!', life: 3000 });
            })
            .catch(() => {
                toast.add({ severity: 'error', summary: '', detail: 'Error creando el perfil', life: 3000 });
            })
            .finally(() => {
                hideDialog();
                profileModel.value.name = null;
                profileModel.value.description = null;
                permissionValues.value[1] = [];
                submitted.value = false;
                loadData();
            });
    }
};

const editProfile = (editProfile) => {
    let profileTemp = { ...editProfile };
    profileModel.value = profileTemp;
    profileId.value = profileTemp.id;
    console.log(permissionValues.value[0]);
    for (let i = 0; i < permissionValues.value[0].length; i++) {
        for (let index = 0; index < profileTemp.permissions.length; index++) {
            if (permissionValues.value[0][i].id == profileTemp.permissions[index].id) {
                permissionValues.value[1].push(profileTemp.permissions[index]);
                permissionValues.value[0].splice(i, 1);
            }
        }
    }
    step1.value = false;
    step2.value = true;
    submitted.value = false;
};

const confirmDeleteProfile = (editProfile) => {
    let profileTemp = { ...editProfile };
    profileModel.value = profileTemp;
    deleteProfileDialog.value = true;
};

const deleteProfile = () => {
    submitted.value = true;
    profileService
        .deleteProfile(profileModel.value.id)
        .then(() => {
            toast.add({ severity: 'success', summary: '', detail: 'Perfil eliminado', life: 3000 });
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: '', detail: 'Error eliminando perfil', life: 3000 });
        })
        .finally(() => {
            deleteProfileDialog.value = false;
            profileModel.value = {};
            loadData();
            submitted.value = false;
        });
    loadData();
};

const confirmDeleteSelected = () => {
    deleteProfilesDialog.value = true;
};
const deleteSelectedProfiles = () => {
    console.log(selectedProfiles.value[0].id);
    selectedProfiles.value.forEach((element) => {
        profileService.deleteProfile(element.id).then((result) => {
            if (result.status === 200) {
                toast.add({ severity: 'success', summary: '', detail: 'Record deleting', life: 3000 });
            }
        });
    });

    deleteProfilesDialog.value = false;
    selectedProfiles.value = null;
    loadData();
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
            <Toast />
            <div class="card" v-if="step1">
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Button label="New" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
                            <Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedProfiles || !selectedProfiles.length" />
                        </div>
                    </template>

                    <!-- <template v-slot:end>
                        <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="mr-2 inline-block" />
                        <Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)" />
                    </template> -->
                </Toolbar>

                <DataTable
                    ref="dt"
                    :value="profileValues"
                    v-model:selection="selectedProfiles"
                    dataKey="id"
                    :paginator="true"
                    :rows="pagination.pageSize"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Mostrar {first} a {last} de {totalRecords} registros"
                    :totalRecords="pagination.total"
                    responsiveLayout="scroll"
                    @page="onPage($event)"
                    lazy
                    :loading="loadingPage"
                >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">Perfiles</h5>
                            <span class="block mt-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global'].value" placeholder="Buscar..." @change="loadData" />
                            </span>
                        </div>
                    </template>

                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                    <Column field="name" header="Name" :sortable="true" headerStyle="width:30%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Nombre</span>
                            {{ slotProps.data.name }}
                        </template>
                    </Column>
                    <Column field="description" header="Description" :sortable="true" headerStyle="width:45%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Descripción</span>
                            {{ slotProps.data.description }}
                        </template>
                    </Column>
                    <Column headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editProfile(slotProps.data)" />
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteProfile(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="deleteProfileDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="profileModel"
                            >Desea eliminar el registro <b>{{ profileModel.name }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProfileDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteProfile" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteProfilesDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="profileModel">Desea eliminar todos los pefiles seleccionados?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProfilesDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedProfiles" />
                    </template>
                </Dialog>
            </div>
            <div class="card" v-if="step2">
                <div class="card p-fluid formgrid grid">
                    <div class="field col-12 md:col-4">
                        <label for="name">Nombre</label>
                        <InputText id="name" type="text" v-model="profileModel.name" />
                    </div>
                    <div class="field col-12 md:col-8">
                        <label for="description">Descripción</label>
                        <InputText id="description" type="text" v-model="profileModel.description" />
                    </div>
                    <div class="col-12">
                        <div class="card">
                            <h5>Permisos</h5>
                            <PickList v-model="permissionValues" listStyle="height:250px" dataKey="id">
                                <template #sourceheader> Disponibles </template>
                                <template #targetheader> Seleccionados </template>
                                <template #item="slotProps">
                                    <div>{{ slotProps.item.description }}</div>
                                </template>
                            </PickList>
                        </div>
                    </div>
                </div>
                <hr />
                <Button label="Save" icon="pi pi-check" class="p-button-raised mr-2 mb-2" @click="saveProfile" />
                <Button label="Cancelar" icon="pi pi-times" class="p-button-raised p-button-secondary mr-2 mb-2" @click="hideDialog" />
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/demo/styles/badges.scss';
</style>
