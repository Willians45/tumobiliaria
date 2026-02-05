<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import PropertyCard from '../components/PropertyCard.vue';
import PropertyCardList from '../components/PropertyCardList.vue';
import MapComponent from '../components/MapComponent.vue';
import propertiesData from '../assets/properties.json';
import { SlidersHorizontal, Grid3x3, List, MapIcon, X } from 'lucide-vue-next';
import { usePropertyStorage } from '../composables/usePropertyStorage';
import { onMounted } from 'vue';

const route = useRoute();
const { userProperties, loadProperties } = usePropertyStorage();

onMounted(() => {
  loadProperties();
});

const properties = computed(() => {
  return [...userProperties.value, ...propertiesData];
});
const showFilters = ref(false);
const viewMode = ref('grid'); // grid, list, mosaic, map

// Filter State
const filters = ref({
  type: route.query.type || '', // sale/rent
  category: route.query.category || '', // Apartamento/Casa/Villa/Comercio
  searchQuery: route.query.q || '',
  maxPrice: 1000000,
  maxArea: 500,
  bedrooms: 0,
  bathrooms: 0,
});

// Watch route changes to update filters
watch(() => route.query, (newQuery) => {
  if (newQuery.type) filters.value.type = newQuery.type;
  if (newQuery.category) filters.value.category = newQuery.category;
  if (newQuery.q !== undefined) {
    filters.value.searchQuery = newQuery.q;
  } else {
    filters.value.searchQuery = '';
  }
  
  // Open filters panel if requested
  if (newQuery.openFilters === 'true') {
    showFilters.value = true;
    
    // Remove the query param to avoid reopening on refresh/back (optional but good UX)
    // const query = { ...newQuery };
    // delete query.openFilters;
    // router.replace({ query }); 
    // Commented out to simpler approach first
  }
}, { immediate: true });

const filteredProperties = computed(() => {
  return properties.value.filter(p => {
    // Type filter (sale/rent)
    if (filters.value.type && p.type !== filters.value.type) return false;
    
    // Category filter (Apartamento/Casa/Villa/Comercio)
    if (filters.value.category && p.category !== filters.value.category) return false;
    
    // Price filter
    if (p.price > filters.value.maxPrice) return false;
    
    // Area filter
    if (p.features.area > filters.value.maxArea) return false;
    
    // Bedrooms filter
    if (filters.value.bedrooms > 0 && p.features.bedrooms < filters.value.bedrooms) return false;
    
    // Bathrooms filter
    if (filters.value.bathrooms > 0 && p.features.bathrooms < filters.value.bathrooms) return false;
    
    // Search Query Filter
    if (filters.value.searchQuery) {
        const query = filters.value.searchQuery.toLowerCase();
        const matchesTitle = p.title?.toLowerCase().includes(query);
        const matchesAddress = p.address?.toLowerCase().includes(query);
        const matchesLocation = p.location?.city?.toLowerCase().includes(query);
        
        if (!matchesTitle && !matchesAddress && !matchesLocation) return false;
    }
    
    return true;
  });
});

const toggleFilters = () => {
  showFilters.value = !showFilters.value;
};
</script>

<template>
  <div class="px-4 flex flex-col" :class="viewMode === 'map' ? 'h-screen pt-24 pb-20 overflow-hidden' : 'pt-24 pb-24 min-h-screen'">
    <!-- Header with View Modes and Filters -->
    <div class="space-y-4 mb-6 flex-shrink-0">
      <div class="flex justify-between items-end">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Explorar</h1>
          <p class="text-sm font-medium text-gray-500 mt-1 flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></span>
            {{ filteredProperties.length }} propiedades disponibles
          </p>
        </div>
        
        <div class="flex gap-2 items-center">
          <!-- View Mode Selector -->
          <div class="flex gap-1 bg-gray-100/80 p-1 rounded-xl backdrop-blur-sm">
            <button 
              @click="viewMode = 'grid'" 
              :class="viewMode === 'grid' ? 'bg-white shadow-md text-gray-900' : 'text-gray-400'"
              class="p-2 rounded-lg transition-all"
            >
              <Grid3x3 :size="18" />
            </button>
            <button 
              @click="viewMode = 'list'" 
              :class="viewMode === 'list' ? 'bg-white shadow-md text-gray-900' : 'text-gray-400'"
              class="p-2 rounded-lg transition-all"
            >
              <List :size="18" />
            </button>
            <button 
              @click="viewMode = 'map'" 
              :class="viewMode === 'map' ? 'bg-white shadow-md text-gray-900' : 'text-gray-400'"
              class="p-2 rounded-lg transition-all"
            >
              <MapIcon :size="18" />
            </button>
          </div>
          
          <!-- Filters Button -->
          <button 
            @click="toggleFilters"
            class="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-100 rounded-xl shadow-sm text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all active:scale-95"
            :class="{ 'bg-rose-50 border-rose-200 text-rose-700': showFilters }"
          >
            <SlidersHorizontal :size="16" stroke-width="2.5" />
            <span>Filtros</span>
          </button>
        </div>
      </div>

      <!-- Real-time Search Tags -->
      <div v-if="filters.searchQuery" class="flex flex-wrap gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
        <div class="flex items-center gap-2 px-3 py-1.5 bg-gray-900 text-white rounded-full text-xs font-bold shadow-lg shadow-gray-200">
          <span>Buscas: "{{ filters.searchQuery }}"</span>
          <button @click="filters.searchQuery = ''" class="hover:text-rose-400 transition-colors">
            <X :size="14" stroke-width="3" />
          </button>
        </div>
        
        <!-- Quick Action to clear all if we had more tags -->
        <button v-if="filters.searchQuery" @click="filters.searchQuery = ''" class="text-xs font-bold text-gray-400 hover:text-rose-500 transition-colors px-2">
          Limpiar todos
        </button>
      </div>
    </div>

    <!-- Filters Panel -->
    <transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="showFilters" class="bg-white p-6 rounded-2xl shadow-sm mb-6 border border-gray-100 flex-shrink-0">
        <!-- Type and Category -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label class="text-xs font-bold text-gray-500 uppercase mb-2 block">Tipo de Transacción</label>
            <div class="flex gap-2">
              <button 
                @click="filters.type = ''" 
                :class="filters.type === '' ? 'bg-rose-500 text-white' : 'bg-gray-100 text-gray-700'"
                class="flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all"
              >
                Cualquiera
              </button>
              <button 
                @click="filters.type = 'sale'" 
                :class="filters.type === 'sale' ? 'bg-rose-500 text-white' : 'bg-gray-100 text-gray-700'"
                class="flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all"
              >
                Venta
              </button>
              <button 
                @click="filters.type = 'rent'" 
                :class="filters.type === 'rent' ? 'bg-rose-500 text-white' : 'bg-gray-100 text-gray-700'"
                class="flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all"
              >
                Alquiler
              </button>
            </div>
          </div>
          
          <div>
            <label class="text-xs font-bold text-gray-500 uppercase mb-2 block">Categoría</label>
            <select v-model="filters.category" class="w-full bg-gray-50 rounded-lg p-3 text-sm border-none focus:ring-2 focus:ring-rose-500">
              <option value="">Todas</option>
              <option value="Apartamento">Apartamento</option>
              <option value="Casa">Casa</option>
              <option value="Villa">Villa</option>
              <option value="Comercio">Comercio</option>
            </select>
          </div>
        </div>

        <!-- Price Slider -->
        <div class="mb-6">
          <label class="text-xs font-bold text-gray-500 uppercase mb-2 block">
            Precio máximo: ${{ filters.maxPrice.toLocaleString() }}
          </label>
          <input 
            v-model.number="filters.maxPrice" 
            type="range" 
            min="0" 
            max="1000000" 
            step="10000"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
          >
          <div class="flex justify-between text-xs text-gray-400 mt-1">
            <span>$0</span>
            <span>$1,000,000</span>
          </div>
        </div>

        <!-- Area Slider -->
        <div class="mb-6">
          <label class="text-xs font-bold text-gray-500 uppercase mb-2 block">
            Área máxima: {{ filters.maxArea }}m²
          </label>
          <input 
            v-model.number="filters.maxArea" 
            type="range" 
            min="0" 
            max="500" 
            step="10"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
          >
          <div class="flex justify-between text-xs text-gray-400 mt-1">
            <span>0m²</span>
            <span>500m²</span>
          </div>
        </div>

        <!-- Bedrooms and Bathrooms Sliders -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="text-xs font-bold text-gray-500 uppercase mb-2 block">
              Habitaciones: {{ filters.bedrooms === 0 ? 'Cualquiera' : filters.bedrooms + '+' }}
            </label>
            <input 
              v-model.number="filters.bedrooms" 
              type="range" 
              min="0" 
              max="5" 
              step="1"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
            >
            <div class="flex justify-between text-xs text-gray-400 mt-1">
              <span>0</span>
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5+</span>
            </div>
          </div>
          
          <div>
            <label class="text-xs font-bold text-gray-500 uppercase mb-2 block">
              Baños: {{ filters.bathrooms === 0 ? 'Cualquiera' : filters.bathrooms + '+' }}
            </label>
            <input 
              v-model.number="filters.bathrooms" 
              type="range" 
              min="0" 
              max="5" 
              step="1"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
            >
            <div class="flex justify-between text-xs text-gray-400 mt-1">
              <span>0</span>
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5+</span>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Map View -->
    <div v-if="viewMode === 'map'" class="flex-1 -mx-4">
      <MapComponent :properties="filteredProperties" height="h-full" />
    </div>

    <!-- Grid View (2 columns) -->
    <div v-else-if="viewMode === 'grid'" class="grid grid-cols-2 gap-4 md:gap-6">
      <PropertyCard v-for="prop in filteredProperties" :key="prop.id" :property="prop" />
    </div>

    <!-- List View (1 column, horizontal layout) -->
    <div v-else-if="viewMode === 'list'" class="space-y-4">
      <PropertyCardList v-for="prop in filteredProperties" :key="prop.id" :property="prop" />
    </div>

    <!-- No Results -->
    <div v-if="filteredProperties.length === 0" class="text-center py-10 text-gray-500">
      <p>No se encontraron propiedades con estos filtros.</p>
    </div>
  </div>
</template>
