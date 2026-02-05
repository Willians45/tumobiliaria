<script setup>
import { ref, onMounted, computed } from 'vue';
import MapComponent from '../components/MapComponent.vue';
import PropertyCard from '../components/PropertyCard.vue';
import propertiesData from '../assets/properties.json';
// Explicitly import icons for production reliability
import ventaIcon from '../assets/categories/venta.png';
import alquilerIcon from '../assets/categories/alquiler.png';
import comercioIcon from '../assets/categories/comercio.png';
import { ChevronRight, Heart } from 'lucide-vue-next';
import { useFavorites } from '../composables/useFavorites';
import { usePropertyStorage } from '../composables/usePropertyStorage';
import { useAuth } from '../composables/useAuth';

// Use mock data + User properties
const { userProperties } = usePropertyStorage();
const { isGuest } = useAuth();
const properties = computed(() => {
  return [...userProperties.value, ...propertiesData];
});

const { favoriteProperties } = useFavorites();

// Categories for "Que buscas"
const categories = [
  { id: 'sale', label: 'Venta', icon: ventaIcon, queryKey: 'type', queryValue: 'sale' },
  { id: 'rent', label: 'Alquiler', icon: alquilerIcon, queryKey: 'type', queryValue: 'rent' },
  { id: 'commercial', label: 'Comercio', icon: comercioIcon, queryKey: 'category', queryValue: 'Comercio' }
];

</script>

<template>
  <div class="pt-24 pb-24 min-h-screen bg-white">
    <!-- Map Section -->
    <section class="relative w-full overflow-hidden">
      <MapComponent :properties="properties" />
    </section>

    <!-- Categories Section -->
    <section class="px-6 mt-10">
      <h2 class="text-xl font-bold text-gray-900 mb-6">¿Qué estás buscando?</h2>
      <div class="grid grid-cols-3 gap-6">
        <RouterLink 
          v-for="cat in categories" 
          :key="cat.id" 
          :to="{ name: 'explore', query: { [cat.queryKey]: cat.queryValue } }"
          class="flex flex-col items-center gap-3 group active:scale-95 transition-all duration-200"
        >
          <div class="relative w-24 h-24 rounded-full border-2 border-orange-400 p-1 bg-white shadow-sm overflow-hidden group-hover:shadow-md group-hover:border-orange-500 transition-all">
            <div class="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center p-1">
                <img :src="cat.icon" :alt="cat.label" class="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110" />
            </div>
          </div>
          <span class="text-sm font-bold text-gray-800 tracking-tight">{{ cat.label }}</span>
        </RouterLink>
      </div>
    </section>

    <!-- My Favorites Section (Dynamic) -->
    <transition name="fade-slide">
      <section v-if="favoriteProperties.length > 0" class="mt-12 pl-6">
        <div class="flex justify-between items-center pr-6 mb-4">
          <h2 class="text-xl font-bold text-gray-900">Tus favoritos</h2>
          <RouterLink to="/favorites" class="text-rose-500 text-sm font-medium hover:underline">Ver todos</RouterLink>
        </div>
        
        <div class="flex gap-4 overflow-x-auto pb-4 pr-6 scrollbar-hide">
          <div v-for="prop in favoriteProperties" :key="prop.id" class="w-72 flex-shrink-0">
            <PropertyCard :property="prop" />
          </div>
        </div>
      </section>
    </transition>

    <!-- My Properties Section (New) -->
    <transition name="fade-slide">
      <section v-if="!isGuest && userProperties.length > 0" class="mt-12 pl-6">
        <div class="flex justify-between items-center pr-6 mb-4">
          <div class="flex items-center gap-2">
            <h2 class="text-xl font-bold text-gray-900">Mis publicaciones</h2>
          </div>
          <RouterLink to="/add" class="text-rose-500 text-sm font-medium hover:underline">Gestionar</RouterLink>
        </div>
        
        <div class="flex gap-4 overflow-x-auto pb-4 pr-6 scrollbar-hide">
          <div v-for="prop in userProperties" :key="prop.id" class="w-72 flex-shrink-0">
            <PropertyCard :property="prop" />
          </div>
        </div>
      </section>
    </transition>

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

/* Transitions */
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.4s ease-out;
}
.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
