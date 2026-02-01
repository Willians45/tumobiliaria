<script setup>
import { ref, onMounted } from 'vue';
import MapComponent from '../components/MapComponent.vue';
import PropertyCard from '../components/PropertyCard.vue';
import propertiesData from '../assets/properties.json';
import { Home, Key, Store } from 'lucide-vue-next';

// Use mock data
const properties = ref(propertiesData);

// Categories for "Que buscas"
const categories = [
  { id: 'sale', label: 'Venta', icon: Home, color: 'text-indigo-500', bg: 'bg-indigo-50', queryKey: 'type', queryValue: 'sale' },
  { id: 'rent', label: 'Alquiler', icon: Key, color: 'text-rose-500', bg: 'bg-rose-50', queryKey: 'type', queryValue: 'rent' },
  { id: 'commercial', label: 'Comercio', icon: Store, color: 'text-amber-500', bg: 'bg-amber-50', queryKey: 'category', queryValue: 'Comercio' }
];

</script>

<template>
  <div class="pt-24 pb-24">
    <!-- Map Section -->
    <section class="relative px-6 -mt-2">
      <MapComponent :properties="properties" />
    </section>

    <!-- Categories Section -->
    <section class="px-6 mt-8">
      <h2 class="text-xl font-bold text-gray-900 mb-4">¿Qué estás buscando?</h2>
      <div class="flex gap-4 justify-between">
        <RouterLink 
          v-for="cat in categories" 
          :key="cat.id" 
          :to="{ name: 'explore', query: { [cat.queryKey]: cat.queryValue } }"
          class="flex flex-col items-center gap-2 w-full p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
          :class="cat.bg"
        >
          <component :is="cat.icon" :size="32" :class="cat.color" stroke-width="1.5" />
          <span class="text-sm font-medium text-gray-700">{{ cat.label }}</span>
        </RouterLink>
      </div>
    </section>

    <!-- Nearby Results -->
    <section class="mt-8 pl-6">
      <div class="flex justify-between items-center pr-6 mb-4">
        <h2 class="text-xl font-bold text-gray-900">Resultados cercanos</h2>
        <RouterLink to="/explore" class="text-rose-500 text-sm font-medium hover:underline">Ver más</RouterLink>
      </div>
      
      <!-- Horizontal Scroll List -->
      <div class="flex gap-4 overflow-x-auto pb-4 pr-6 scrollbar-hide">
        <div v-for="prop in properties.slice(0, 5)" :key="prop.id" class="w-64 flex-shrink-0">
          <PropertyCard :property="prop" />
        </div>
      </div>
    </section>

    <!-- Recommended Section (Placeholder) -->
    <section class="mt-4 px-6 opacity-60 grayscale filter mb-8">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-gray-900">Recomendados</h2>
      </div>
      <div class="h-32 bg-gray-200 rounded-2xl flex items-center justify-center border-dashed border-2 border-gray-300">
         <span class="text-gray-400 text-sm">Espacio patrocinado</span>
      </div>
    </section>
  </div>
</template>

<style>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
