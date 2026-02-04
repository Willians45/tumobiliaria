import { ref, computed } from 'vue';

// Using a persistent mock state for the demo
const currentUser = ref(null); // null = Guest

export function useAuth() {
    const isGuest = computed(() => currentUser.value === null);

    const loginAsTestUser = () => {
        currentUser.value = {
            id: 1,
            name: 'Usuario de Prueba',
            avatar: null
        };
    };

    const logout = () => {
        currentUser.value = null;
    };

    return {
        currentUser,
        isGuest,
        loginAsTestUser,
        logout
    };
}
