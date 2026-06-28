import { defineStore } from 'pinia';    
import { authApi } from '@/config/api';
import { useUserStore } from '@/features/users/userStore';

export const useAuthStore = defineStore('auth', {
    actions: {
        async login(payload) {
            try {
                const response = await authApi.post('/login', payload);
                if (response.status === 200) {
                    const userData = response.data;
                    const userStore = useUserStore();
                    userStore.setUser(userData);
                    if (userData.imageReference) {
                        await userStore.setImage(userData.imageReference);
                    }
                    return true;
                } else {
                    return false;
                }
            } catch (error) {
                console.error('Login failed', error);
                return false;
            }
        },
        async register(payload, image) {   
            try {
                const response = await authApi.post('/register', payload);
                if (response.status === 201) {
                    const userData = response.data;
                    // console.log('Data backend response:', response.data);
                    const userStore = useUserStore();
                    userStore.setUser(userData);

                    if (image && userData.imageReference) {
                        // TODO: "Upload image to cloudflare by naming it profile_imageReference"
                        await userStore.setImage(image);
                    }
                    return true;
                } else {
                    return false;
                }
            } catch (error) {
                console.error('Registration failed', error);
                return false;
            }
        }
    },
});