import { ref, watch, computed } from 'vue';
import propertiesData from '../assets/properties.json';

const favorites = ref(JSON.parse(localStorage.getItem('favorites') || '[]'));

// Helper to save to localStorage
watch(favorites, (newVal) => {
    localStorage.setItem('favorites', JSON.stringify(newVal));
}, { deep: true });

export function useFavorites() {

    const toggleFavorite = (propertyId) => {
        const index = favorites.value.indexOf(propertyId);
        if (index === -1) {
            favorites.value.push(propertyId);
        } else {
            favorites.value.splice(index, 1);
        }
    };

    const isFavorite = (propertyId) => {
        return favorites.value.includes(propertyId);
    };

    // Get full property objects for the favorites list
    const favoriteProperties = computed(() => {
        return propertiesData.filter(p => favorites.value.includes(p.id));
    });

    return {
        favorites, // IDs list
        favoriteProperties, // Full objects list
        toggleFavorite,
        isFavorite
    };
}
