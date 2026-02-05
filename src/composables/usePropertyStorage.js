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

            const updatedProperties = [...userProperties.value, newProperty];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProperties));

            // Only update reactive state if save was successful
            userProperties.value = updatedProperties;

            isLoading.value = false;
            return newProperty;
        } catch (e) {
            console.error('Error saving property:', e);
            isLoading.value = false;

            if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                alert('¡Error! No hay espacio suficiente en el almacenamiento local para guardar esta propiedad con tantas imágenes. Intenta subir menos fotos o fotos más pequeñas.');
            } else {
                alert('Hubo un error al intentar guardar la propiedad. Por favor, intenta de nuevo.');
            }
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
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    const maxDim = 1200;

                    if (width > height) {
                        if (width > maxDim) {
                            height *= maxDim / width;
                            width = maxDim;
                        }
                    } else {
                        if (height > maxDim) {
                            width *= maxDim / height;
                            height = maxDim;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    // Compress as JPEG
                    const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
                    resolve(compressedBase64);
                };
            };
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
