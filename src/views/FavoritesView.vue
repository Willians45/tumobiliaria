<script setup>
import PropertyCard from '../components/PropertyCard.vue';
import { Heart } from 'lucide-vue-next';
import { useFavorites } from '../composables/useFavorites';

const { favoriteProperties } = useFavorites();
</script>

<template>
  <div class="pt-20 pb-24 px-4 min-h-screen">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Mis Favoritos</h1>
    
    <div v-if="favoriteProperties.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
       <div v-for="prop in favoriteProperties" :key="prop.id" class="w-full">
         <PropertyCard :property="prop" class="w-full !w-full" />
      </div>
    </div>

    <div v-else class="flex flex-col items-center justify-center py-20 text-center opacity-60">
      <div class="bg-gray-100 p-6 rounded-full mb-4">
        <Heart :size="40" class="text-gray-400" />
      </div>
      <h3 class="font-bold text-lg text-gray-900">Tu lista está vacía</h3>
      <p class="text-gray-500 mb-6 max-w-xs">Dale "Me gusta" a las propiedades que te interesen para guardarlas aquí.</p>
      <RouterLink to="/explore" class="bg-rose-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-rose-600 transition-colors">
        Explorar Propiedades
      </RouterLink>
    </div>
  </div>
</template>
