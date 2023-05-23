<script setup>
import { useLayout } from '@/layout/composables/layout';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import md5 from 'md5';
import AuthService from '@/service/AuthService';

const router = useRouter();
const authService = new AuthService();

const { layoutConfig, contextPath } = useLayout();
const email = ref('');
const password = ref('');
const message = ref([]);
const submitted = ref(false);

const logoUrl = computed(() => {
    return `${contextPath}layout/images/${layoutConfig.darkTheme.value ? 'logo' : 'logo'}.png`;
});
const addMessage = (type, msg) => {
    message.value = [{ severity: type, detail: 'Error', content: msg }];
};

const login = () => {
    submitted.value = true;
    if (email.value == '') {
        addMessage('error', 'Usuario y/o contraseña incorrectos');
        submitted.value = false;
        return;
    } else if (password.value == '') {
        addMessage('error', 'Usuario y/o contraseña incorrectos');
        submitted.value = false;
        return;
    } else {
        setTimeout(() => {
            const obj = {
                username: email.value,
                password: md5(password.value)
            };
            authService
                .loginUser(obj)
                .then((response) => {
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('userId', response.data.userId);
                    localStorage.setItem('permissions', response.data.permissions);

                    router.push('/');
                    password.value = '';
                })
                .catch(() => {
                    // eslint-disable-next-line no-debugger
                    addMessage('error', 'Usuario y/o contraseña incorrectos');
                })
                .finally(() => {
                    submitted.value = false;
                });
        }, 3000);
    }
};
</script>

<template>
    <Toast />
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden" style="background: #2196f3 !important; padding: 2rem !important">
        <div class="flex flex-column align-items-center justify-content-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <img :src="logoUrl" alt="Image" height="150" class="mb-3" />
                        <h2 class="text-900 text-3xl font-bold mb-3">
                            Gestión Documental <br />
                            Secretaría General Diners Club
                        </h2>
                    </div>

                    <div>
                        <label for="email1" class="block text-900 text-xl font-medium mb-2">Usuario</label>
                        <InputText id="email1" type="text" placeholder="Usuario" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="email" />

                        <label for="password1" class="block text-900 font-medium text-xl mb-2">Contraseña</label>
                        <Password id="password1" v-model="password" placeholder="Password" :toggleMask="true" class="w-full mb-3" inputClass="w-full" inputStyle="padding:1rem"></Password>

                        <div class="flex align-items-center justify-content-between mb-5 gap-5"></div>
                        <Button label="Entrar" class="w-full p-3 text-xl" :loading="submitted" @click="login"></Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
