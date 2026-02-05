import { ref, onMounted } from 'vue';

const STORAGE_KEY = 'tu_mobiliaria_user_properties';

// Shared state
const userProperties = ref([]);
const isLoading = ref(false);
const isInitialized = ref(false);

const loadProperties = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) {
            userProperties.value = JSON.parse(data);
        }
    } catch (e) {
        console.error('Error loading properties from local storage:', e);
        userProperties.value = [];
    }
    isInitialized.value = true;
};

// Initial load
if (typeof window !== 'undefined') {
    loadProperties();
}

export function usePropertyStorage() {
    // Load properties if not yet initialized (extra safety)
    if (!isInitialized.value && typeof window !== 'undefined') {
        loadProperties();
    }

    const saveProperty = async (propertyData) => {
        isLoading.value = true;

        // Simulate network delay for future-proofing
        await new Promise(resolve => setTimeout(resolve, 800));

        try {
            const newProperty = {
                ...propertyData,
                id: Date.now(), // Simple unique ID
                createdAt: new Date().toISOString(),
                status: 'published'
            };

            userProperties.value.push(newProperty);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(userProperties.value));

            isLoading.value = false;
            return newProperty;
        } catch (e) {
            console.error('Error saving property:', e);
            isLoading.value = false;
            throw e;
        }
    };

    const deleteProperty = async (id) => {
        isLoading.value = true;
        await new Promise(resolve => setTimeout(resolve, 500));

        try {
            userProperties.value = userProperties.value.filter(p => p.id !== id);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(userProperties.value));
            isLoading.value = false;
        } catch (e) {
            console.error('Error deleting property:', e);
            isLoading.value = false;
            throw e;
        }
    };

    const uploadImage = async (file) => {
        // For MVP, we convert to Base64
        // In the future, this is where Cloudinary integration goes
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    return {
        userProperties,
        isLoading,
        saveProperty,
        deleteProperty,
        uploadImage,
        loadProperties
    };
}
