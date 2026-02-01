<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import PropertyCard from '../components/PropertyCard.vue';
import PropertyCardList from '../components/PropertyCardList.vue';
import MapComponent from '../components/MapComponent.vue';
import propertiesData from '../assets/properties.json';
import { SlidersHorizontal, Grid3x3, List, MapIcon } from 'lucide-vue-next';

const route = useRoute();
const properties = ref(propertiesData);
const showFilters = ref(false);
const viewMode = ref('grid'); // grid, list, mosaic, map

// Filter State
const filters = ref({
  type: route.query.type || '', // sale/rent
  category: route.query.category || '', // Apartamento/Casa/Villa/Comercio
  maxPrice: 1000000,
  maxArea: 500,
  bedrooms: 0,
  bathrooms: 0,
});

// Watch route changes to update filters
watch(() => route.query, (newQuery) => {
  if (newQuery.type) filters.value.type = newQuery.type;
  if (newQuery.category) filters.value.category = newQuery.category;
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
    
    return true;
  });
});

const toggleFilters = () => {
  showFilters.value = !showFilters.value;
};
</script>

<template>
  <div class="pt-20 pb-24 px-4 min-h-screen">
    <!-- Header with View Modes and Filters -->
    <div class="flex justify-between items-center mb-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Explorar</h1>
        <p class="text-sm text-gray-500 mt-1">{{ filteredProperties.length }} propiedades encontradas</p>
      </div>
      
      <div class="flex gap-2 items-center">
        <!-- View Mode Selector -->
        <div class="flex gap-1 bg-gray-100 p-1 rounded-lg">
          <button 
            @click="viewMode = 'grid'" 
            :class="viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-500'"
            class="p-2 rounded transition-all"
          >
            <Grid3x3 :size="18" />
          </button>
          <button 
            @click="viewMode = 'list'" 
            :class="viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-500'"
            class="p-2 rounded transition-all"
          >
            <List :size="18" />
          </button>
          <button 
            @click="viewMode = 'map'" 
            :class="viewMode === 'map' ? 'bg-white shadow-sm' : 'text-gray-500'"
            class="p-2 rounded transition-all"
          >
            <MapIcon :size="18" />
          </button>
        </div>
        
        <!-- Filters Button -->
        <button 
          @click="toggleFilters"
          class="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
          :class="{ 'bg-rose-50 border-rose-200 text-rose-700': showFilters }"
        >
          <SlidersHorizontal :size="16" />
          Filtros
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
      <div v-if="showFilters" class="bg-white p-6 rounded-2xl shadow-sm mb-6 border border-gray-100">
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
    <div v-if="viewMode === 'map'" class="h-[70vh] -mx-4">
      <MapComponent :properties="filteredProperties" />
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
