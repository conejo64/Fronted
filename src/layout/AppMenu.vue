<script setup>
import { ref, computed } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const haveAccessFull = ref(false);
const haveAccessToCase = ref(false);
const haveAccessToCaseReport = ref(false);
const haveAccessMyCases = ref(false);
const haveAccessToCatalogs = ref(false);
const haveAccessToUsers = ref(false);
const haveAccessToProfiles = ref(false);

const permissions = localStorage.getItem('permissions');
if (permissions) {
    haveAccessFull.value = computed(() => permissions.includes('Backend:Cases:FullAccess') || permissions.includes('Backend:MyCase:FullAccess') || permissions.includes('Backend:Status:FullAccess'));
    haveAccessToCase.value = computed(() => permissions.includes('Backend:Cases:FullAccess') || permissions.includes('Backend:Cases:ReadOnlyAccess'));
    haveAccessToCaseReport.value = computed(() => permissions.includes('Backend:Cases:FullAccess') || permissions.includes('Backend:Cases:ReadOnlyAccess'));
    haveAccessMyCases.value = computed(() => permissions.includes('Backend:MyCase:ReadOnlyAccess') || permissions.includes('Backend:MyCase:FullAccess'));
    haveAccessToCatalogs.value = computed(() => permissions.includes('Backend:Catalogs:ReadOnlyAccess') || permissions.includes('Backend:Catalogs:FullAccess'));
    haveAccessToUsers.value = computed(() => permissions.includes('Backend:Users:ReadOnlyAccess') || permissions.includes('Backend:Users:FullAccess'));
    haveAccessToProfiles.value = computed(() => permissions.includes('Backend:Profiles:ReadOnlyAccess') || permissions.includes('Backend:Profiles:FullAccess'));
}

const model = ref([
    {
        label: 'Principal',
        items: [
            { label: 'Panel de control', icon: 'pi pi-fw pi-home', to: '/' },
            { label: 'Casos', icon: 'pi pi-fw pi-file-o', to: '/pages/cases/list', visible: haveAccessToCase.value },
            { label: 'Reporte de casos', icon: 'pi pi-fw pi-file-excel', to: '/pages/cases/report', visible: haveAccessToCaseReport.value },
            { label: 'Mis Casos', icon: 'pi pi-fw pi-file-o', to: '/pages/others/list', visible: haveAccessMyCases.value },
        ]
    },
    {
        label: 'Catálogos',
        items: [
            { label: 'Origen de documentos', icon: 'pi pi-fw pi-id-card', to: '/pages/admin/originDocuments', visible: haveAccessToCatalogs.value },
            { label: 'Marcas', icon: 'pi pi-fw pi-id-card', to: '/pages/admin/brand', visible: haveAccessToCatalogs.value },
            { label: 'Tipo de Requerimiento', icon: 'pi pi-fw pi-id-card', to: '/pages/admin/typeRequirement', visible: haveAccessToCatalogs.value },
            { label: 'Departmentos', icon: 'pi pi-fw pi-id-card', to: '/pages/admin/department', visible: haveAccessToCatalogs.value },
            { label: 'Recordatorios', icon: 'pi pi-fw pi-id-card', to: '/pages/admin/reminder', visible: haveAccessToCatalogs.value },
            { label: 'Provincias', icon: 'pi pi-fw pi-id-card', to: '/pages/admin/province', visible: haveAccessToCatalogs.value },
            { label: 'Estado Casos', icon: 'pi pi-fw pi-id-card', to: '/pages/admin/status', visible: haveAccessToCatalogs.value },
            { label: 'Estado Casos Secretaría', icon: 'pi pi-fw pi-id-card', to: '/pages/admin/statusSecretary', visible: haveAccessToCatalogs.value },
        ],
        visible: haveAccessToCatalogs.value
    },
    {
        label: 'Usuarios y permisos',
        items: [
            { label: 'Usuarios', icon: 'pi pi-fw pi-users', to: '/pages/user/users', visible: haveAccessToUsers.value },
            { label: 'Perfiles', icon: 'pi pi-fw pi-key', to: '/pages/user/profiles', visible: haveAccessToProfiles.value },
        ],
        visible: haveAccessToUsers.value
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
