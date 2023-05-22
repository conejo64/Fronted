import { createRouter, createWebHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';
import AuthService from '@/service/AuthService';

const authService = new AuthService();

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            meta: {
                hiddenInMenu: false,
                requiresAuth: true
            },
            children: [
                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue'),
                    meta: {
                        requiresAuth: true,
                        requirePermissions: false,
                        authorize: []
                    }
                },
                {
                    path: '/pages/cases/list',
                    name: 'cases',
                    component: () => import('@/views/pages/cases/List.vue'),
                    meta: {
                        requiresAuth: true,
                        requirePermissions: true,
                        authorize: ['Backend:Cases:FullAccess', 'Backend:Cases:ReadOnlyAccess']
                    }
                },
                {
                    path: '/pages/cases/report',
                    name: 'cases_report',
                    component: () => import('@/views/pages/cases/Report.vue'),
                    meta: {
                        requiresAuth: true,
                        requirePermissions: true,
                        authorize: ['Backend:Cases:FullAccess', 'Backend:Cases:ReadOnlyAccess']
                    }
                },
                {
                    path: '/pages/others/list',
                    name: 'others',
                    component: () => import('@/views/pages/others/List.vue'),
                    meta: {
                        requiresAuth: true,
                        requirePermissions: true,
                        authorize: ['Backend:MyCase:FullAccess', 'Backend:MyCase:ReadOnlyAccess']
                    }
                },
                {
                    path: '/pages/user/users',
                    name: 'users',
                    component: () => import('@/views/pages/user/users/List.vue'),
                    meta: {
                        requiresAuth: true,
                        requirePermissions: true,
                        authorize: ['Backend:Users:FullAccess', 'Backend:Users:ReadOnlyAccess']
                    }
                },
                {
                    path: '/pages/user/profiles',
                    name: 'profiles',
                    component: () => import('@/views/pages/user/profiles/List.vue'),
                    meta: {
                        requiresAuth: true,
                        requirePermissions: true,
                        authorize: ['Backend:Profiles:FullAccess', 'Backend:Profiles:ReadOnlyAccess']
                    }
                },
                {
                    path: '/pages/admin/originDocuments',
                    name: 'admin_originDocuments',
                    component: () => import('@/views/pages/admin/originDocuments.vue'),
                    meta: {
                        requiresAuth: true,
                        requirePermissions: true,
                        authorize: ['Backend:Catalogs:FullAccess', 'Backend:Catalogs:ReadOnlyAccess']
                    }
                },
                {
                    path: '/pages/admin/brand',
                    name: 'admin_brands',
                    component: () => import('@/views/pages/admin/brand.vue'),
                    meta: {
                        requiresAuth: true,
                        requirePermissions: true,
                        authorize: ['Backend:Catalogs:FullAccess', 'Backend:Catalogs:ReadOnlyAccess']
                    }
                },
                {
                    path: '/pages/admin/typeRequirement',
                    name: 'admin_typeRequirement',
                    component: () => import('@/views/pages/admin/typeRequirement.vue'),
                    meta: {
                        requiresAuth: true,
                        requirePermissions: true,
                        authorize: ['Backend:TypeRequirement:FullAccess', 'Backend:TypeRequirement:ReadOnlyAccess']
                    }
                },
                {
                    path: '/pages/admin/department',
                    name: 'admin_department',
                    component: () => import('@/views/pages/admin/department.vue'),
                    meta: {
                        requiresAuth: true,
                        requirePermissions: true,
                        authorize: ['Backend:Catalogs:FullAccess', 'Backend:Catalogs:ReadOnlyAccess']
                    }
                },
                {
                    path: '/pages/admin/reminder',
                    name: 'admin_reminder',
                    component: () => import('@/views/pages/admin/reminder.vue'),
                    meta: {
                        requiresAuth: true,
                        requirePermissions: true,
                        authorize: ['Backend:Catalogs:FullAccess', 'Backend:Catalogs:ReadOnlyAccess']
                    }
                },
                {
                    path: '/pages/admin/province',
                    name: 'admin_province',
                    component: () => import('@/views/pages/admin/province.vue'),
                    meta: {
                        requiresAuth: true,
                        requirePermissions: true,
                        authorize: ['Backend:Catalogs:FullAccess', 'Backend:Catalogs:ReadOnlyAccess']
                    }
                },
                {
                    path: '/pages/admin/status',
                    name: 'admin_status',
                    component: () => import('@/views/pages/admin/status.vue'),
                    meta: {
                        requiresAuth: true,
                        requirePermissions: true,
                        authorize: ['Backend:Catalogs:FullAccess', 'Backend:Catalogs:ReadOnlyAccess']
                    }
                },
                {
                    path: '/pages/admin/statusSecretary',
                    name: 'admin_status_secretary',
                    component: () => import('@/views/pages/admin/statusSecretary.vue'),
                    meta: {
                        requiresAuth: true,
                        requirePermissions: true,
                        authorize: ['Backend:Catalogs:FullAccess', 'Backend:Catalogs:ReadOnlyAccess']
                    }
                },
            ]
        },
        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        }
    ]
});

router.beforeEach(async (to, from, next) => {
    if (to.matched.some((value) => value.meta && value.meta.requiresAuth === true)) {
        // const isAuthenticated = await authService.isAuthenticated();
        // if (!isAuthenticated) {
        //     // next({ name: 'login', query: { returnUrl: window.location.href } });
        //     router.push('/auth/login');
        // } else {
        //     // const userRoles = await authService.getUserRoles()
        //     // if (!to.matched.every(value => value.meta.requiredRoles
        //     //   ? value.meta.requiredRoles.some(role => userRoles.indexOf(role) !== -1)
        //     //   : true
        //     // )) {
        //     //   next({ name: '401' })
        //     // } else {
        //     next();
        //     // }
        // }

        const token = localStorage.getItem('token');
        if (!token) {
            localStorage.clear();

            router.push('/auth/login');
            // window.location.replace('https://identity.guayaquil.gob.ec')
        } else {
            const permissions = localStorage.getItem('permissions');
            const { authorize, requirePermissions } = to.meta;
            console.log(permissions);
            // Este caso es para la raiz, si el usuario esta autenticado, almenos puede
            // acceder a la raiz del sistema
            if (!requirePermissions && authorize.length === 0) {
                next();
            }

            // Si el usuario tiene entre sus permisos, el o los permisos que se requieren para la ruta
            // Pasa en caso contrario no lo deja pasar
            if (authorize.length > 0) {
                let count = 0;
                for (let index = 0; index < authorize.length; index += 1) {
                    const element = authorize[index];
                    if (permissions.includes(element)) {
                        count += 1;
                    }
                }
                if (count >= 1) {
                    next();
                } else {
                    next({ name: 'error-404' });
                }
            }
        }
    } else {
        next();
    }
});

export default router;
