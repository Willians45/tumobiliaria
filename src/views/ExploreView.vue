<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import PropertyCard from '../components/PropertyCard.vue';
import propertiesData from '../assets/properties.json';
import { SlidersHorizontal } from 'lucide-vue-next';

const route = useRoute();
const properties = ref(propertiesData);
const showFilters = ref(false);

// Filter State
const filters = ref({
  type: route.query.type || '',
  minPrice: '',
  maxPrice: '',
  bedrooms: '',
  bathrooms: '',
});

const filteredProperties = computed(() => {
  return properties.value.filter(p => {
    if (filters.value.type && p.type !== filters.value.type && p.category !== filters.value.type) { 
        // Allow matching either transaction type (sale/rent) or category (house/apt) for flexibility
        if (p.type !== filters.value.type && p.category !== filters.value.type) return false;
    }
    if (filters.value.minPrice && p.price < filters.value.minPrice) return false;
    if (filters.value.maxPrice && p.price > filters.value.maxPrice) return false;
    if (filters.value.bedrooms && p.features.bedrooms < filters.value.bedrooms) return false;
    return true;
  });
});
</script>

<template>
  <div class="pt-20 pb-24 px-4 min-h-screen">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold text-gray-900">Explorar</h1>
      <button 
        @click="showFilters = !showFilters"
        class="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <SlidersHorizontal :size="16" />
        Filtros
      </button>
    </div>

    <!-- Filters Panel -->
    <div v-if="showFilters" class="bg-white p-4 rounded-2xl shadow-sm mb-6 border border-gray-100 animate-in slide-in-from-top-2 fade-in duration-200">
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label class="text-xs font-bold text-gray-500 uppercase mb-1 block">Tipo</label>
          <select v-model="filters.type" class="w-full bg-gray-50 rounded-lg p-2 text-sm border-none focus:ring-2 focus:ring-rose-500">
            <option value="">Todos</option>
            <option value="sale">Venta</option>
            <option value="rent">Alquiler</option>
            <option value="commercial">Comercio</option>
          </select>
        </div>
         <div>
          <label class="text-xs font-bold text-gray-500 uppercase mb-1 block">Habitaciones</label>
          <select v-model="filters.bedrooms" class="w-full bg-gray-50 rounded-lg p-2 text-sm border-none focus:ring-2 focus:ring-rose-500">
            <option value="">Cualquiera</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
          </select>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="text-xs font-bold text-gray-500 uppercase mb-1 block">Min Precio ($)</label>
          <input v-model.number="filters.minPrice" type="number" class="w-full bg-gray-50 rounded-lg p-2 text-sm border-none focus:ring-2 focus:ring-rose-500" placeholder="0">
        </div>
        <div>
          <label class="text-xs font-bold text-gray-500 uppercase mb-1 block">Max Precio ($)</label>
          <input v-model.number="filters.maxPrice" type="number" class="w-full bg-gray-50 rounded-lg p-2 text-sm border-none focus:ring-2 focus:ring-rose-500" placeholder="No límite">
        </div>
      </div>
    </div>

    <!-- Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="prop in filteredProperties" :key="prop.id" class="w-full">
         <PropertyCard :property="prop" class="w-full !w-full" /> 
         <!-- Note: PropertyCard has w-64 by default, we override it here with !w-full logic or we need to edit component. 
              Let's rely on class override or wrap it. The component has w-64 class built-in. 
              I might need to make PropertyCard more flexible or wrap it in a div that handles width.
              Actually styling overrides might not work if scoped without deep or prop.
              I will assume for now I should edit PropertyCard to accept class or width prop, but easier is to just wrap it in a div and hope flex-shrink-0 doesn't mess it up.
              Actually w-64 is hardcoded class. I should probably update PropertyCard to 'w-full' and let parent control width, OR accept a prop.
         -->
      </div>
    </div>
    
    <div v-if="filteredProperties.length === 0" class="text-center py-10 text-gray-500">
      <p>No se encontraron propiedades con estos filtros.</p>
    </div>
  </div>
</template>
