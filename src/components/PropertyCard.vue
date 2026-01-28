<script setup>
import { Heart, Star } from 'lucide-vue-next';

defineProps({
  property: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <div class="bg-transparent mb-6 group cursor-pointer" :class="$attrs.class || 'w-full'">
    <!-- Image Section -->
    <div class="relative w-full aspect-[4/3.5] rounded-2xl overflow-hidden mb-3">
      <img :src="property.image" :alt="property.title" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
      
      <!-- Favorite Button -->
      <button class="absolute top-3 right-3 p-2 text-white/70 hover:text-white hover:scale-110 transition-all">
        <Heart :size="24" class="drop-shadow-sm" stroke-width="2" />
      </button>

      <!-- Badge -->
      <div v-if="property.uploader?.name" class="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-md shadow-sm">
        <span class="text-[10px] font-bold text-gray-800 uppercase tracking-wide">{{ property.category }}</span>
      </div>
    </div>
    
    <!-- Info Section -->
    <div>
      <div class="flex justify-between items-start">
        <h3 class="font-bold text-gray-900 text-[15px] truncate max-w-[80%]">{{ property.address.split(',')[0] }}</h3>
        <div class="flex items-center gap-1">
           <Star :size="12" class="text-black fill-black" />
           <span class="text-sm font-light">4.88</span>
        </div>
      </div>
      <p class="text-gray-500 text-sm font-light truncate">Anfitrión: {{ property.uploader.name }}</p>
      <p class="text-gray-500 text-sm font-light truncate mb-1.5">{{ property.type === 'sale' ? 'Venta' : 'Alquiler' }} - Disponible ahora</p>
      
      <div class="flex items-baseline gap-1">
        <span class="font-bold text-gray-900 text-lg">${{ property.price.toLocaleString() }}</span>
        <span class="text-gray-900 text-sm font-normal"> / {{ property.type === 'rent' ? 'mes' : 'total' }}</span>
      </div>
    </div>
  </div>
</template>
