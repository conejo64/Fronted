<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import UserService from '@/service/UserService';
import ProfileService from '@/service/ProfileService';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const userValues = ref(null);
const pagination = ref({
    page: 0,
    pageSize: 10,
    total: 0
});
const userDialog = ref(false);
const deleteUserDialog = ref(false);
const deleteUsersDialog = ref(false);
const userSelectId = ref(null);
const userModel = ref({
    firstName: '',
    lastName: '',
    dni: '',
    email: '',
    phone: ''
});
const selectedUsers = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
const loadingPage = ref(false);

const profileValues = ref(null);
const profileSelect = ref(null);

const userService = new UserService();
const profileService = new ProfileService();

onBeforeMount(() => {
    initFilters();
});
onMounted(() => {
    loadData();
});
const loadData = () => {
    const paginate = {
        page: 1,
        pageSize: 10,
        search: ''
    };
    userService
        .readUsers(paginate)
        .then((data) => {
            userValues.value = data.data.entities;
            pagination.value = data.data.pagination;
        })
        .finally(() => {
            loadingPage.value = false;
        });

    profileService.readProfilesAll().then((data) => {
        console.log(data);
        profileValues.value = data.data.value;
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
    userService
        .readUsers(paginate)
        .then((data) => {
            userValues.value = data.data.entities;
            pagination.value = data.data.pagination;
        })
        .finally(() => {
            loadingPage.value = false;
        });
};

const openNew = () => {
    userModel.value = {};
    submitted.value = false;
    userDialog.value = true;
};

const hideDialog = () => {
    userDialog.value = false;
    submitted.value = false;
};

const saveUser = () => {
    submitted.value = true;
    let profiles = [];
    profiles.push(profileSelect.value.id);
    let model = {
        username: userModel.value.email,
        firstName: userModel.value.firstName,
        lastName: userModel.value.lastName,
        identification: userModel.value.dni,
        email: userModel.value.email,
        phone: userModel.value.phone,
        profileIds: profiles
    };
    console.log(model);
    if (userSelectId.value == null || userSelectId.value == '') {
        userService
            .createUser(model)
            .then(() => {
                toast.add({ severity: 'success', summary: '', detail: 'Usuario creado correctamente!', life: 3000 });
            })
            .catch(() => {
                toast.add({ severity: 'error', summary: 'Crear', detail: 'Error creando usuario!', life: 3000 });
            })
            .finally(() => {
                loadData();
                userDialog.value = false;
                submitted.value = false;
                userModel.value = {};
                userSelectId.value = null;
            });
    } else {
        userService
            .updateUser(userSelectId.value, model)
            .then(() => {
                toast.add({ severity: 'success', summary: '', detail: 'Usuario actualizado correctamente!', life: 3000 });
            })
            .catch(() => {
                toast.add({ severity: 'error', summary: 'Actualizar', detail: 'Error actualizando usuario!', life: 3000 });
            })
            .finally(() => {
                loadData();
                userDialog.value = false;
                submitted.value = false;
                userModel.value = {};
                userSelectId.value = null;
            });
    }

    userModel.value = null;
    userDialog.value = false;
};

const editUser = (editUser) => {
    let userTemp = { ...editUser };
    console.log(userTemp);
    userModel.value = userTemp;
    userSelectId.value = userTemp.id;
    console.log(userTemp.profiles);
    for (let index = 0; index < profileValues.value.length; index++) {
        if (profileValues.value[index].id == userTemp.profiles[0].id) {
            profileSelect.value = profileValues.value[index];
        }
    }
    userDialog.value = true;
};

const confirmDeleteUser = (editUser) => {
    userModel.value = editUser;
    deleteUserDialog.value = true;
};

const deleteUser = () => {
    userService.deleteUser(userModel.value.id).then((result) => {
        if (result.status === 200) {
            toast.add({ severity: 'success', summary: '', detail: 'Registro eliminado', life: 3000 });
        }
    });
    deleteUserDialog.value = false;
    userModel.value = {};
    loadData();
};

const confirmDeleteSelected = () => {
    deleteUsersDialog.value = true;
};
const deleteSelectedUsers = () => {
    console.log(selectedUsers.value[0].id);
    selectedUsers.value.forEach((element) => {
        userService.deleteUser(element.id).then((result) => {
            if (result.status === 200) {
                toast.add({ severity: 'success', summary: '', detail: 'Registro eliminado', life: 3000 });
            }
        });
    });

    deleteUsersDialog.value = false;
    selectedUsers.value = null;
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
            <div class="card">
                <Toast />
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Button label="New" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
                            <Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedUsers || !selectedUsers.length" />
                        </div>
                    </template>

                    <!-- <template v-slot:end>
                        <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="mr-2 inline-block" />
                        <Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)" />
                    </template> -->
                </Toolbar>

                <DataTable
                    ref="dt"
                    :value="userValues"
                    v-model:selection="selectedUsers"
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
                            <h5 class="m-0">Usuarios</h5>
                            <span class="block mt-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global'].value" placeholder="Buscar..." @change="loadData" />
                            </span>
                        </div>
                    </template>

                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                    <Column field="dni" header="Dni" :sortable="true" headerStyle="width:15%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Identificación</span>
                            {{ slotProps.data.dni }}
                        </template>
                    </Column>
                    <Column field="fullName" header="Name" :sortable="true" headerStyle="width:35%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Nombre</span>
                            {{ slotProps.data.fullName }}
                        </template>
                    </Column>
                    <Column field="email" header="Email" :sortable="true" headerStyle="width:25%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Correo Electrónico</span>
                            {{ slotProps.data.email }}
                        </template>
                    </Column>
                    <Column field="phone" header="Phone" :sortable="true" headerStyle="width:15%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Teléfono</span>
                            {{ slotProps.data.phone }}
                        </template>
                    </Column>
                    <Column headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editUser(slotProps.data)" />
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteUser(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="userDialog" :style="{ width: '450px' }" header="User Details" :modal="true" class="p-fluid">
                    <div class="card p-fluid">
                        <div class="field">
                            <label for="firstName">Nombres</label>
                            <InputText id="firstName" type="text" v-model="userModel.firstName" />
                        </div>
                        <div class="field">
                            <label for="lastName">Apellidos</label>
                            <InputText id="lastName" type="text" v-model="userModel.lastName" />
                        </div>
                        <div class="field">
                            <label for="dni">Identificación</label>
                            <InputText id="dni" type="text" v-model="userModel.dni" />
                        </div>
                        <div class="field">
                            <label for="email">Correo Electrónico</label>
                            <InputText id="email" type="text" v-model="userModel.email" />
                        </div>
                        <div class="field">
                            <label for="phone">Teléfono</label>
                            <InputText id="phone" type="text" v-model="userModel.phone" />
                        </div>
                        <div class="field">
                            <label for="profileSelect">Perfil</label>
                            <Dropdown id="profileSelect" v-model="profileSelect" :options="profileValues" optionLabel="name" placeholder="Seleccione Perfil"> </Dropdown>
                        </div>
                    </div>
                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveUser" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteUserDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="userModel"
                            >Desea eliminar el registro <b>{{ catalog.description }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteUserDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteUser" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteUsersDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="userModel">Desea eliminar todos los usuarios seleccionados?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteUsersDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedUsers" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/demo/styles/badges.scss';
</style>
