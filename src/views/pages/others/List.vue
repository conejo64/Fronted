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
const loadingPage = ref(false);

const products = ref(null);
const pagination = ref({
    page: 0,
    pageSize: 10,
    total: 0
});
const caseId = ref(null);
const docNumber = ref(null);
const dueDate = ref(null);
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

const selectedProducts = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
const editable = ref(true);

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
    observationExtension: null
});

const replyCaseModel = ref({
    replyDate: null,
    comments: null,
    documentString: [],
    documentStringNames: [],
});
const attachementsCaseModel = ref([]);

const filterModel = ref({
    originDocumentId: '',
    departmentId: '',
    caseStatusId: '',
    initialDate: '',
    finalDate: ''
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
        .readOtherCases(paginate)
        .then((data) => {
            products.value = data.data.entities;
            pagination.value = data.data.pagination;
        })
        .finally(() => {
            loadingPage.value = false;
            step1.value = true;
            step2.value = false;
            step3.value = false;
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
        .readOtherCases(paginate)
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
    });
};
const loadUsers = () => {
    userService.readUsersAll().then((data) => {
        console.log(data.data);
        users.value = data.data;
    });
};
const loadStatuses = () => {
    statusService.readCatalogsAll().then((data) => {
        statusCases.value = data.data;
    });
};
const loadStatusesSecretary = () => {
    statusSecretaryService.readCatalogsAll().then((data) => {
        statusSecretaries.value = data.data;
    });
};
const loadTypeRequirements = () => {
    typeRequirementService.readCatalogsAll().then((data) => {
        typeRequirements.value = data.data;
    })
}
//End catalog

const gestionarCasoStep = (caso) => {
    let caseTemp = { ...caso };
    caseId.value = caseTemp.id;
    dueDate.value = caseTemp.dueDate;
    docNumber.value = caseTemp.documentNumber;
    submitted.value = false;
    step1.value = false;
    step2.value = true;
    step3.value = false;
};

const hideStep = () => {
    step1.value = true;
    step2.value = false;
    step3.value = false;
    submitted.value = false;
    caseModel.value = {};
    replyCaseModel.value = {};
    caseId.value = null;
    docNumber.value = null;
    dueDate.value = null;
};

const fileInput = ref(null);
const onFileChanged = () => {
    const input = fileInput.value;
    const files = input.files;
    files.forEach(element => {
        //attachments.value.push(element); 
        replyCaseModel.value.documentStringNames.push(element.name);
            caseService.getBase64(element).then((data) => {
                console.log(data);
                replyCaseModel.value.documentString.push(data);
            });        
    });
};

const saveReplyCase = () => {
    submitted.value = true;
    caseService
        .replyCase(caseId.value, replyCaseModel.value)
        .then(() => {
            toast.add({ severity: 'success', summary: '', detail: 'Respuesta enviada a secretaría', life: 3000 });
        })
        .catch(() => {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Error enviando respuesta a secretaría', life: 3000 });
        })
        .finally(() => {
            hideStep();
            loadData();
            submitted.value = false;
            replyCaseModel.value = {};
        });
};

const showCase = (caso) => {
    caseModel.value = { ...caso };
    caseId.value = caseModel.value.id;
    loadAttachments(caseId.value);
    step1.value = false;
    step2.value = false;
    step3.value = true;
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
                            <h5 class="m-0">Mis Casos</h5>
                        </div>
                    </template>

                    <Column field="receptionDate" header="Fecha Recepción" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Fecha Recepción</span>
                            {{ slotProps.data.receptionDate }}
                        </template>
                    </Column>
                    <Column field="physicallyReceived" header="Recibido Fisico" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Recibido Fisico</span>
                            {{ slotProps.data.physicallyReceived }}
                        </template>
                    </Column>
                    <Column field="documentNumber" header="No. Requerimiento" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">No. Requerimiento</span>
                            {{ slotProps.data.documentNumber }}
                        </template>
                    </Column>
                    <Column header="originDocumentDescription" headerStyle="width:14%; min-width:10rem;">
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
                    <Column field="dueDate" header="Fecha Vencimiento" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Fecha Vencimiento</span>
                            {{ slotProps.data.dueDate }}
                        </template>
                    </Column>
                    <Column field="caseStatusDescription" header="Estado" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Estado</span>
                            {{ slotProps.data.caseStatusDescription }}
                        </template>
                    </Column>
                    <Column headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-eye" class="p-button-rounded p-button-text mr-2 mb-2" @click="showCase(slotProps.data)" v-tooltip.top="{ value: 'Ver' }" />
                            <Button v-if="slotProps.data.caseStatusDescription != 'CERRADO'" icon="pi pi-send" class="p-button-rounded p-button-text mr-2 mb-2" @click="gestionarCasoStep(slotProps.data)" v-tooltip.top="'Gestionar'" />
                        </template>
                    </Column>
                </DataTable>
            </div>
            <!--Step 2-->
            <div class="card" v-if="step2">
                <div class="col-12">
                    <div class="card">
                        <h5>Responder caso</h5>
                        <hr />
                        <div class="p-fluid formgrid grid">
                            <div class="field col-12 md:col-4">
                                <label>No. Requerimiento</label>
                                <InputText type="text" :disabled="true" v-model="docNumber" />
                            </div>
                            <div class="field col-12 md:col-4">
                                <label for="calendar">Fecha Contestación</label>
                                <Calendar :showIcon="true" :showButtonBar="true" v-model="replyCaseModel.replyDate"></Calendar>
                            </div>
                            <div class="field col-12">
                                <label>Comentario</label>
                                <Textarea rows="4" v-model="replyCaseModel.comments" />
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
                                            ref="fileInput"
                                            @change="onFileChanged($event)"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <br />
                    <Button label="Responder a Secretaría" class="p-button-warning mr-2 mb-2" @click="saveReplyCase()" />
                    <Button label="Cancelar" class="p-button-raised p-button-secondary mr-2 mb-2" @click="hideStep()" />
                </div>
            </div>

            <div class="card" v-if="step3">
                <div class="col-12">
                    <div class="card">
                        <h5>Datos del caso</h5>
                        <hr />
                        <div class="p-fluid formgrid grid">
                            <div class="field col-12 md:col-4">
                                <label>No. Requerimiento</label>
                                <InputText type="text" v-model="caseModel.documentNumber" :disabled="editable" />
                            </div>
                            <div class="field col-12 md:col-4">
                                <label for="calendar">Fecha Recepción</label>
                                <Calendar :showIcon="true" :showButtonBar="true" v-model="caseModel.receptionDate" :disabled="editable"></Calendar>
                            </div>
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
                            <!-- <div class="field col-12 md:col-4" v-if="!editable">
                                <label>Destinatario responsable</label>
                                <Dropdown v-model="caseModel.userId" :options="users" optionLabel="fullName" optionValue="id" placeholder="Seleccione" :disabled="editable"></Dropdown>
                            </div> -->
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
                            <!-- <div class="field col-12 md:col-4">
                                <label for="calendar">Fecha Vencimiento</label>
                                <Calendar :showIcon="true" :showButtonBar="true" v-model="caseModel.dueDate" :disabled="editable"></Calendar>
                            </div>
                            <div class="field col-12 md:col-4">
                                <label for="calendar">Envío Recordatorio</label>
                                <Dropdown v-model="caseModel.reminderId" :options="reminders" optionLabel="description" optionValue="id" placeholder="Seleccione" :disabled="editable"></Dropdown>
                            </div> -->
                            <div class="p-fluid formgrid grid">
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
                    </div>

                    <br />
                    <Button label="Cancelar" class="p-button-raised p-button-secondary mr-2 mb-2" @click="hideStep()" />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/demo/styles/badges.scss';
</style>
