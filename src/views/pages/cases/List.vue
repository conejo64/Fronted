<!-- eslint-disable prettier/prettier -->
<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import CasesService from '@/service/CasesService';
import OriginDocumentService from '@/service/OriginDocumentService';
import TypeRequirementService from '@/service/TypeRequirementService';
import BrandService from '@/service/BrandService';
import DepartmentService from '@/service/DepartmentService';
import ProvinceService from '@/service/ProvinceService';
import ReminderService from '@/service/ReminderService';
import UserService from '@/service/UserService';
import StatusService from '@/service/StatusService';
import StatusSecretaryService from '@/service/StatusSecretaryService';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const step1 = ref(true);
const step2 = ref(false);
const step3 = ref(false);
const step4 = ref(false);

const displayShowNotification = ref(false);
const displaySetStatus = ref(false);
const displayMoreInfomation = ref(false);

const loadingPage = ref(false);
const pagination = ref({
    page: 0,
    pageSize: 10,
    total: 0
});

const products = ref(null);
const caseId = ref(null);
//Catalogs
const originDocuments = ref(null);
const brands = ref(null);
const departments = ref(null);
const provinces = ref(null);
const reminders = ref(null);
const users = ref(null);
const statusCases = ref(null);
const statusSecretaries = ref(null);
const typeRequirements = ref(null);

const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const product = ref({});
const selectedProducts = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
const editable = ref(false);

const caseModel = ref({
    requirementNumber: null,
    receptionDate: null,
    originDocumentId: null,
    physicallyReceived: null,
    digitallyReceived: null,
    documentNumber: null,
    sbsNumber: null,
    judgmentNumber: null,
    issueDate: null,
    description: null,
    brandId: null,
    departmentId: null,
    userId: null,
    typeRequirementId: null,
    notification: null,
    subject: null,
    transferDate: null,
    deadline: null,
    provinceId: null,
    dueDate: null,
    reminderId: null,
//Screen Department
    replyDate: null,
    comments: null,
//Screen Close Secretary
    responseDate: null,
    caseStatusId: null,
    observationDepartment: null,
    caseStatusSecretaryId: null,
    acknowledgmentDate: null,
//Screen Prorrogation
    extensionRequestDate: null,
    newExtensionRequestDate: null,
    observationExtension: null,
// attachments
    documentString: [],
    documentStringNames: [],
    caseStage: null
});

const moreComments = ref(null);
const docNumber = ref(null);
const dueDate = ref(null);
const attachments = ref([]);
const closeCaseModel = ref({
    responseDate: null,
    caseStatusId: null,
    observationDepartment: null,
    caseStatusSecretaryId: null,
    acknowledgmentDate: null,
    documentString: [],
    documentStringNames: [],
});
const extensionCaseModel = ref({
    extensionRequestDate: null,
    newExtensionRequestDate: null,
    observationExtension: null
});
const notificationModel = ref({
    message: null
});
const attachementsCaseModel = ref([]);

const filterModel = ref({
    originDocumentId: null,
    departmentId: null,
    caseStatusId: null,
    initialDate: null,
    finalDate: null
});

const caseService = new CasesService();
const originDocumentService = new OriginDocumentService();
const brandService = new BrandService();
const departmentService = new DepartmentService();
const provinceService = new ProvinceService();
const reminderService = new ReminderService();
const userService = new UserService();
const statusService = new StatusService();
const statusSecretaryService = new StatusSecretaryService();  
const typeRequirementService = new TypeRequirementService();  

const fileInput = ref(null);
const fileInputClose = ref(null);

onBeforeMount(() => {
    initFilters();
});
onMounted(() => {
    loadData();
    loadOriginDocuments();
    loadBrands();
    loadDepartments();
    loadProvinces();
    loadReminders();
    loadUsers();
    loadStatuses();
    loadStatusesSecretary();
    loadTypeRequirements();
});

const onFileChanged = () => {
    caseModel.value.documentStringNames = [];
    caseModel.value.documentString = [];
    const input = fileInput.value;
    const files = input.files;
    files.forEach(element => {
        caseModel.value.documentStringNames.push(element.name);
            caseService.getBase64(element).then((data) => {
                //console.log(data);
                caseModel.value.documentString.push(data);
            });        
    });

};

const onFileChangedClose = () => {
    caseModel.value.documentStringNames = [];
    caseModel.value.documentString = [];
    const input1 = fileInputClose.value;
    const files1 = input1.files;
    //console.log(files1);
    files1.forEach(element => {
        console.log(element);
        closeCaseModel.value.documentStringNames.push(element.name);
            caseService.getBase64(element).then((data) => {
                //console.log(data);
                closeCaseModel.value.documentString.push(data);
            });        
    });

};
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
            step3.value = false;
            step4.value = false;
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
//Catalogs
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
const loadProvinces = () => {
    provinceService.readCatalogsAll().then((data) => {
        provinces.value = data.data;
    });
};
const loadReminders = () => {
    reminderService.readCatalogsAll().then((data) => {
        reminders.value = data.data;
    })
};
const loadUsers = () => {
    userService.readUsersAll().then((data) => {
        console.log(data.data);
        users.value = data.data;
    })
};
const loadStatuses = () => {
    statusService.readCatalogsAll().then((data) => {
        statusCases.value = data.data;
    })
};
const loadStatusesSecretary = () => {
    statusSecretaryService.readCatalogsAll().then((data) => {
        statusSecretaries.value = data.data;
    })
};
const loadTypeRequirements = () => {
    typeRequirementService.readCatalogsAll().then((data) => {
        typeRequirements.value = data.data;
    })
}
//End catalog
const openNewStep = () => {
    submitted.value = false;
    step1.value = false;
    step2.value = true;
    step3.value = false;
    step4.value = false;
    editable.value = false;
    caseModel.value = {};
};

const hideStep = () => {
    step1.value = true;
    step2.value = false;
    step3.value = false;
    step4.value = false;
    submitted.value = false;
    caseModel.value = {};
    editable.value = false;
};

const loadAttachments = (id) => {
    caseService.attachementsCase(id).then((data) => {
        let temp = data.data;
        console.log(temp);
        attachementsCaseModel.value = temp;
    });
};

const openAttachmentCase = (id) => {
    submitted.value = true;
    caseService.openAttachementCase(caseId.value, id).then(() => {
        
    }).catch(() => {
        toast.error('Error al abrir el archivo');
    }).finally(() => {
        submitted.value = false;
    });
};

const closeCaseStep = (caso) => {
    let caseTemp = { ...caso };
    caseId.value = caseTemp.id;
    docNumber.value = caseTemp.documentNumber;
    closeCaseModel.value = {
        responseDate: caseTemp.responseDate,
        caseStatusId: caseTemp.caseStatusId,
        observationDepartment: caseTemp.observationDepartment,
        caseStatusSecretaryId: caseTemp.caseStatusSecretaryId,
        acknowledgmentDate: caseTemp.acknowledgmentDate,
        documentString: [],
        documentStringNames: [],
    };
    step1.value = false;
    step2.value = false;
    step3.value = true;
    step4.value = false;
    submitted.value = false;
};

const cerrarCasoStep = () => {
    submitted.value = true;
    caseModel.value.caseStage = "secretary";
    caseService.createCase(caseModel.value).then(() => {
        toast.add({ severity: 'success', summary: '', detail: 'Caso creado correctamente', life: 3000 });    
    }).catch(() => {
        toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el caso', life: 3000 });
    }).finally(() => {
        step1.value = false;
        step2.value = false;
        step3.value = true;
        step4.value = false;
        submitted.value = false;
        docNumber.value = caseModel.value.documentNumber;
    });            
    caseModel.value = null;    
};

const prorrogarCasoStep = (caso) => {
    let caseTemp = { ...caso };
    caseId.value = caseTemp.id;
    docNumber.value = caseTemp.documentNumber;
    dueDate.value = caseTemp.dueDate;
    extensionCaseModel.value = {
        extensionRequestDate: caseTemp.extensionRequestDate,
        newExtensionRequestDate : caseTemp.newExtensionRequestDate,
        extensionObservations: caseTemp.extensionObservations
    };
    step1.value = false;
    step2.value = false;
    step3.value = false;
    step4.value = true;
    submitted.value = false;
};

const saveCase = () => {
    submitted.value = true;    
    caseModel.value.caseStage = "others";
    console.log(caseModel.value);
    caseService.createCase(caseModel.value).then(() => {
        toast.add({ severity: 'success', summary: '', detail: 'Caso creado correctamente', life: 3000 });    
    }).catch(() => {
        toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear el caso', life: 3000 });
    }).finally(() => {
        submitted.value = false;
        loadData();
    });   
    console.log(attachments.value);         
    caseModel.value = {};
}

// const getBase64 = (file) => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result);
//     reader.onerror = error => reject(error);
//   });
// }


const ShowCase = (caso) => {
    caseModel.value = { ...caso };
    caseId.value = caseModel.value.id;
    loadAttachments(caseId.value);
    step1.value = false;
    step2.value = true;
    step3.value = false;
    step4.value = false;
    submitted.value = false;
    editable.value = true;    
};

const sendNotificationDialog = (caso) => {
    let aux = { ...caso };
    caseId.value = aux.id;
    displayShowNotification.value = true;
};

const moreInformationDialog = (caso) => {
    let aux = { ...caso };
    caseId.value = aux.id;
    displayMoreInfomation.value = true;
};

const closeShowNotification = () => {
    submitted.value = true;
    caseService.notificationCase(caseId.value, notificationModel.value).then(() => {
        toast.add({ severity: 'success', summary: '', detail: 'Notificación enviada correctamente', life: 3000 });
    }).catch(() => {
        toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo enviar la notificación', life: 3000 });
    }).finally(() => {
        displayShowNotification.value = false;
        loadData();
        submitted.value = false;
        notificationModel.value = {};        
    })
};

const closeSetStatus = () => {
    displaySetStatus.value = false;
};

const saveMoreInformation = () => {
    submitted.value = true;
    var request = {
        comments: moreComments.value
    };
    caseService.updateInformationCase(caseId.value, request).then(() => {
        toast.add({ severity: 'success', summary: '', detail: 'Caso actualizado correctamente', life: 3000 });
    }).catch(() => {
        toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar el caso', life: 3000 });
    }).finally(() => {
        displayMoreInfomation.value = false;
        loadData();
        submitted.value = false;
    })
};

const closeMoreInformation = () => {
    displayMoreInfomation.value = false;
};

const saveCloseCase = () => {
    submitted.value = true;
    console.log(closeCaseModel.value);
    caseService.closeCase(caseId.value, closeCaseModel.value).then(() => {
        toast.add({ severity: 'success', summary: '', detail: 'Caso cerrado correctamente', life: 3000 });
    }).catch(() => {
        toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cerrar el caso', life: 3000 });
    }).finally(() => {
        loadData();
        submitted.value = false;
        closeCaseModel.value = null;
    });
};

const saveExtensionCase = () => {
    submitted.value = true;
    caseService.extensionCase(caseId.value, extensionCaseModel.value).then(() => {
        toast.add({ severity: 'success', summary: '', detail: 'Caso prorrogado correctamente', life: 3000 });
    }).catch(() => {
        toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo prorrogar el caso', life: 3000 });
    }).finally(() => {
        loadData();
        submitted.value = false;
        extensionCaseModel.value = null;
    });
};

// const confirmDeleteProduct = (caso) => {
//     product.value = caso;
//     deleteProductDialog.value = true;
// };

const deleteProduct = () => {
    products.value = products.value.filter((val) => val.id !== product.value.id);
    deleteProductDialog.value = false;
    product.value = {};
    toast.add({ severity: 'success', summary: '', detail: 'Product Deleted', life: 3000 });
};

// const confirmDeleteSelected = () => {
//     deleteProductsDialog.value = true;
// };
const deleteSelectedProducts = () => {
    products.value = products.value.filter((val) => !selectedProducts.value.includes(val));
    deleteProductsDialog.value = false;
    selectedProducts.value = null;
    toast.add({ severity: 'success', summary: '', detail: 'Products Deleted', life: 3000 });
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};
</script>

<template>
    <div class="grid">
        <Toast />
        <div class="col-12">
            <div class="card" v-if="step1">
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
                    <!-- <template v-slot:end>
                        <div class="my-2">
                            <Button label="Nuevo Caso" icon="pi pi-plus" class="p-button-primary mr-2" @click="openNewStep" />
                        </div>
                    </template> -->
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
                            <h5 class="m-0">Administración de Casos</h5>
                            <Button label="Nuevo Caso" icon="pi pi-plus" class="p-button-secondary mr-2" @click="openNewStep" />
                        </div>
                    </template>

                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                    <Column field="receptionDate" header="Fecha Recepción" :sortable="true" headerStyle="width:14%; min-width:10rem;">
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
                            <span>{{ slotProps.data.caseStatusDescription }}</span>
                        </template>
                    </Column>
                    <Column headerStyle="min-width:20rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-eye" class="p-button-rounded p-button-text mr-2 mb-2" @click="ShowCase(slotProps.data)" v-tooltip.top="{ value: 'Ver' }" />
                            <Button v-if="slotProps.data.caseStatusDescription != 'CERRADO'" icon="pi pi-send" class="p-button-rounded p-button-text mr-2 mb-2" @click="sendNotificationDialog(slotProps.data)" v-tooltip.top="{ value: 'Enviar' }" />
                            <Button v-if="slotProps.data.caseStatusDescription != 'CERRADO'" icon="pi pi-cog" class="p-button-rounded p-button-text mr-2 mb-2" @click="closeCaseStep(slotProps.data)" v-tooltip.top="{ value: 'Cerrar Caso' }" />
                            <Button
                                v-if="slotProps.data.caseStatusDescription != 'CERRADO'"
                                icon="pi pi-pencil"
                                class="p-button-rounded p-button-text mr-2 mb-2"
                                @click="moreInformationDialog(slotProps.data)"
                                v-tooltip.top="{ value: 'Más Información' }"
                            />
                            <Button
                                v-if="slotProps.data.caseStatusDescription != 'CERRADO'"
                                icon="pi pi-calendar-plus"
                                class="p-button-rounded p-button-text mr-2 mb-2"
                                @click="prorrogarCasoStep(slotProps.data)"
                                v-tooltip.top="{ value: 'Prorrogar' }"
                            />
                            <!-- <Button icon="pi pi-pencil" class="p-button-rounded p-button-info mr-2" @click="editProduct(slotProps.data)" />
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-danger mt-2" @click="confirmDeleteProduct(slotProps.data)" /> -->
                        </template>
                    </Column>
                </DataTable>

                <Dialog header="Enviar notificación" v-model:visible="displayShowNotification" :breakpoints="{ '960px': '75vw' }" :style="{ width: '30vw' }" :modal="true">
                    <div class="p-fluid formgrid grid">
                        <div class="field col-12">
                            <label for="address">Mensaje</label>
                            <Textarea id="address" rows="3" v-model="notificationModel.message" />
                        </div>
                    </div>
                    <template #footer>
                        <Button label="Enviar" @click="closeShowNotification" icon="pi pi-send" class="p-button-outlined" />
                    </template>
                </Dialog>

                <Dialog header="Cambiar estado" v-model:visible="displaySetStatus" :breakpoints="{ '960px': '75vw' }" :style="{ width: '30vw' }" :modal="true">
                    <div class="p-fluid formgrid grid">
                        <div class="field col-12">
                            <label for="address">Mensaje</label>
                            <Dropdown id="state" v-model="dropdownItem" :options="dropdownItems" optionLabel="name" placeholder="Seleccione"></Dropdown>
                        </div>
                    </div>
                    <template #footer>
                        <Button label="Continuar" @click="closeSetStatus" icon="pi pi-cog" class="p-button-outlined" />
                    </template>
                </Dialog>

                <Dialog header="Más información" v-model:visible="displayMoreInfomation" :breakpoints="{ '960px': '75vw' }" :style="{ width: '30vw' }" :modal="true">
                    <div class="p-fluid formgrid grid">
                        <div class="field col-12">
                            <label for="information">Comentario</label>
                            <Textarea id="information" rows="3" v-model="moreComments" />
                        </div>
                    </div>
                    <template #footer>
                        <Button label="Cancelar" @click="closeMoreInformation" icon="pi pi-pencil" class="p-button-outlined" />
                        <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="saveMoreInformation()" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="product"
                            >Está seguro que desea eliminar el caso <b>{{ product.code }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProductDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteProduct" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteProductsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="product">Está seguro que desea eliminar los casos seleccionados?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProductsDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedProducts" />
                    </template>
                </Dialog>
            </div>
            <!--Step 2-->
            <div class="card" v-if="step2">
                <div class="col-12">
                    <div class="card">
                        <h5>Registro nuevo caso</h5>
                        <hr />
                        <div class="p-fluid formgrid grid">
                            <div class="field col-12 md:col-4">
                                <label>No. Requerimiento</label>
                                <InputText type="text" v-model="caseModel.documentNumber" :disabled="editable" />
                            </div>
                            <div class="field col-12 md:col-4">
                                <label for="xyz">Fecha Recepción</label>
                                <Calendar :showIcon="true" :showButtonBar="true" v-model="caseModel.receptionDate" :disabled="editable"></Calendar>
                            </div>
                        </div>
                        <div class="p-fluid formgrid grid">
                            <div class="field col-12 md:col-4">
                                <label for="state">Origen de Documento</label>
                                <Dropdown id="state" v-model="caseModel.originDocumentId" :options="originDocuments" optionLabel="description" optionValue="id" placeholder="Seleccione" :disabled="editable"></Dropdown>
                            </div>
                            <div class="col-12 md:col-4">
                                <div class="field">
                                    <label class="mb-3">Recepción de Documento</label>
                                    <div class="formgrid grid">
                                        <div class="field-radiobutton col-6">
                                            <RadioButton name="option" value="SI" v-model="caseModel.physicallyReceived" :disabled="editable" />
                                            <label for="physicallyReceived">Físico</label>
                                        </div>
                                        <div class="field-radiobutton col-6">
                                            <RadioButton name="option" value="NO" v-model="caseModel.physicallyReceived" :disabled="editable" />
                                            <label for="digitallyReceived">Digital</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="field col-12 md:col-4">
                                <label for="lastname2">No Oficio Referido en SB</label>
                                <InputText type="text" v-model="caseModel.sbsNumber" required="true" autofocus :class="{ 'p-invalid': submitted && !caseModel.sbsNumber }" :disabled="editable" />
                                <small class="p-invalid" v-if="submitted && !caseModel.sbsNumber">Campo requerido</small>
                            </div>
                            <div class="field col-12 md:col-4">
                                <label for="lastname2">No. de Juicio</label>
                                <InputText id="lastname2" type="text" v-model="caseModel.judgmentNumber" :disabled="editable" />
                            </div>
                            <div class="field col-12 md:col-4">
                                <label for="calendar">Fecha Emisión</label>
                                <Calendar :showIcon="true" :showButtonBar="true" v-model="caseModel.issueDate" :disabled="editable"></Calendar>
                            </div>
                            <div class="field col-12">
                                <label for="description">Descripción</label>
                                <Textarea rows="4" v-model="caseModel.description" :disabled="editable" />
                            </div>
                            <div class="field col-12 md:col-4">
                                <label>Dirigido a: </label>
                                <Dropdown id="state" v-model="caseModel.brandId" :options="brands" optionLabel="description" optionValue="id" placeholder="Seleccione" :disabled="editable"></Dropdown>
                            </div>
                            <div class="field col-12 md:col-4">
                                <label>Area que responde</label>
                                <Dropdown v-model="caseModel.departmentId" :options="departments" optionLabel="description" optionValue="id" placeholder="Seleccione" :disabled="editable"></Dropdown>
                            </div>
                            <div class="field col-12 md:col-4">
                                <label>Destinatario responsable</label>
                                <Dropdown v-model="caseModel.userId" :options="users" optionLabel="fullName" optionValue="id" placeholder="Seleccione" :disabled="editable"></Dropdown>
                            </div>
                            <div class="field col-12 md:col-4">
                                <label>Tipo de Requerimiento</label>
                                <Dropdown v-model="caseModel.typeRequirementId" :options="typeRequirements" optionLabel="description" optionValue="id" placeholder="Seleccione" :disabled="editable"></Dropdown>
                            </div>
                            <div class="field col-12 md:col-4">
                                <label>Notificar a:</label>
                                <InputText type="text" v-model="caseModel.notification" :disabled="editable" />
                            </div>
                            <div class="field col-12 md:col-4">
                                <label>Asunto de correo:</label>
                                <InputText type="text" v-model="caseModel.subject" :disabled="editable" />
                            </div>
                            <div class="field col-12 md:col-4">
                                <label for="calendar">Fecha Límite</label>
                                <Calendar :showIcon="true" :showButtonBar="true" v-model="caseModel.deadline" :disabled="editable"></Calendar>
                            </div>
                            <div class="field col-12 md:col-4">
                                <label>Lugar Destinatario</label>
                                <Dropdown v-model="caseModel.provinceId" :options="provinces" optionLabel="description" optionValue="id" placeholder="Seleccione" :disabled="editable"></Dropdown>
                            </div>
                            <div class="field col-12 md:col-4">
                                <label for="calendar">Fecha Vencimiento</label>
                                <Calendar :showIcon="true" :showButtonBar="true" v-model="caseModel.dueDate" :disabled="editable"></Calendar>
                            </div>
                            <div class="field col-12 md:col-4">
                                <label for="calendar">Envío Recordatorio (en horas)</label>
                                <Dropdown v-model="caseModel.reminderId" :options="reminders" optionLabel="description" optionValue="id" placeholder="Seleccione" :disabled="editable"></Dropdown>
                            </div>
                        </div>
                        <hr />
                        <div class="p-fluid formgrid grid" v-if="editable">
                            <h4 class="col-12">Respuesta del caso</h4>
                            <div class="field col-12 md:col-4">
                                <label for="calendar">Fecha de Respuesta</label>
                                <Calendar :showIcon="true" :showButtonBar="true" v-model="caseModel.replyDate" :disabled="editable"></Calendar>
                            </div>
                            <div class="field col-12 md:col-8">
                                <label for="description">Comentarios</label>
                                <Textarea rows="4" v-model="caseModel.comments" :disabled="editable" />
                            </div>
                        </div>
                        <div class="p-fluid formgrid grid" v-if="!editable">
                            <div class="col-12">
                                <div class="card">
                                    <h5>Respaldos</h5>
                                    <FileUpload
                                        :multiple="true"
                                        accept="application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document,
                                    application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, image/*"
                                        :maxFileSize="1000000"
                                        chooseLabel="Seleccione"
                                        class="p-mr-2"
                                        :showUploadButton="false"
                                        cancelLabel="Cancelar"
                                        :auto="false"
                                        ref="fileInput"
                                        @change="onFileChanged($event)"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="p-fluid formgrid grid" v-if="editable">
                            <div class="col-12">
                                <div class="card">
                                    <h5>Documentos cargados</h5>
                                    <ul>
                                        <li v-for="(att, index) in attachementsCaseModel" :key="index">
                                            <a href="#" class="p-button-text mr-2 mb-2" @click="openAttachmentCase(att.id)">{{ att.document64Name }}</a>
                                            <span
                                                >|
                                                {{
                                                    att.documentSource == 'create'
                                                        ? 'Cargado en la creación de caso'
                                                        : att.documentSource == 'close'
                                                        ? 'Cargado en el cierre de caso'
                                                        : att.documentSource == 'reply'
                                                        ? 'Cargado en la respuesta del caso'
                                                        : ''
                                                }}</span
                                            >
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <br />
                    <Button v-if="!editable" label="Cerrar Secretaría" class="p-button-warning mr-2 mb-2" @click="cerrarCasoStep()" :loading="submitted" />
                    <Button v-if="!editable" label="Enviar Caso" class="p-button-raised mr-2 mb-2" @click="saveCase()" :loading="submitted" />
                    <Button label="Cancelar" class="p-button-raised p-button-secondary mr-2 mb-2" @click="hideStep()" />
                </div>
            </div>

            <div class="card" v-if="step3">
                <div class="col-12">
                    <div class="card">
                        <h5>Cerrar caso secretaría</h5>
                        <hr />
                        <div class="p-fluid formgrid grid">
                            <div class="field col-12 md:col-4">
                                <label>No. Requerimiento</label>
                                <InputText type="text" v-model="docNumber" :disabled="true" />
                            </div>
                            <div class="field col-12 md:col-4">
                                <label for="calendar">Fecha Cierre de Requerimiento</label>
                                <Calendar :showIcon="true" :showButtonBar="true" v-model="closeCaseModel.responseDate"></Calendar>
                            </div>
                            <div class="field col-12 md:col-4">
                                <label for="state">Estado del caso</label>
                                <Dropdown id="state" v-model="closeCaseModel.caseStatusId" :options="statusCases" optionLabel="description" optionValue="id" placeholder="Seleccione"></Dropdown>
                            </div>
                            <div class="field col-12">
                                <label>Observaciones</label>
                                <Textarea rows="4" v-model="closeCaseModel.observationDepartment" />
                            </div>
                            <div class="field col-12 md:col-4">
                                <label for="state">Revisión de secretaría: </label>
                                <Dropdown id="state" v-model="closeCaseModel.caseStatusSecretaryId" :options="statusSecretaries" optionLabel="description" optionValue="id" placeholder="Seleccione"></Dropdown>
                            </div>
                            <div class="field col-12 md:col-4">
                                <label for="calendar">Fecha Acuse de Recibo</label>
                                <Calendar :showIcon="true" :showButtonBar="true" v-model="closeCaseModel.acknowledgmentDate"></Calendar>
                            </div>
                        </div>
                        <div class="p-fluid formgrid grid">
                            <div class="col-12">
                                <div class="card">
                                    <h5>Respaldos</h5>
                                    <FileUpload
                                        :multiple="true"
                                        accept="application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document,
                                application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                        :maxFileSize="1000000"
                                        chooseLabel="Seleccione"
                                        class="p-mr-2"
                                        :showUploadButton="false"
                                        cancelLabel="Cancelar"
                                        :auto="false"
                                        ref="fileInputClose"
                                        @change="onFileChangedClose($event)"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <br />
                    <Button label="Cerrar Caso" class="p-button-warning mr-2 mb-2" @click="saveCloseCase()" :loading="submitted" />
                    <Button label="Cancelar" class="p-button-raised p-button-secondary mr-2 mb-2" @click="hideStep" />
                </div>
            </div>

            <div class="card" v-if="step4">
                <div class="col-12">
                    <div class="card">
                        <h5>Generar Solicitud de Prórroga</h5>
                        <hr />
                        <div class="p-fluid formgrid grid">
                            <div class="field col-12 md:col-4">
                                <label>No. Requerimiento</label>
                                <InputText type="text" v-model="docNumber" :disabled="true" />
                            </div>
                            <div class="field col-12 md:col-4">
                                <label for="calendar">Fecha de Vencimiento</label>
                                <Calendar :showIcon="true" :showButtonBar="true" v-model="dueDate"></Calendar>
                            </div>
                        </div>
                        <div class="p-fluid formgrid grid">
                            <div class="field col-12 md:col-4">
                                <label for="calendar">Fecha Solicitud de Prórroga</label>
                                <Calendar :showIcon="true" :showButtonBar="true" v-model="extensionCaseModel.extensionRequestDate"></Calendar>
                            </div>
                            <div class="field col-12 md:col-4">
                                <label for="state">Fecha Prorrogada</label>
                                <Calendar :showIcon="true" :showButtonBar="true" v-model="extensionCaseModel.newExtensionRequestDate"></Calendar>
                            </div>
                        </div>
                        <div class="p-fluid formgrid grid">
                            <div class="field col-12 md:col-8">
                                <label for="address">Observaciones</label>
                                <Textarea id="address" rows="4" />
                            </div>
                        </div>
                    </div>
                </div>

                <br />
                <Button label="Solicitar Prórroga" class="p-button-warning mr-2 mb-2" @click="saveExtensionCase()" />
                <Button label="Cancelar" class="p-button-raised p-button-secondary mr-2 mb-2" @click="hideStep" />
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/demo/styles/badges.scss';
</style>
