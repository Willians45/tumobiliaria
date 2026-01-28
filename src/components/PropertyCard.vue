<script setup>
import { BedDouble, Bath, Square, Heart } from 'lucide-vue-next';

defineProps({
  property: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <div class="flex-shrink-0 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative group" 
       :class="$attrs.class || 'w-64'">
    <div class="relative h-40">
      <img :src="property.image" :alt="property.title" class="w-full h-full object-cover" />
      <button class="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full text-gray-500 hover:text-rose-500 transition-colors">
        <Heart :size="16" />
      </button>
      <div class="absolute bottom-2 left-2 bg-black/50 backdrop-blur-md px-2 py-1 rounded-md">
        <span class="text-white text-xs font-bold">{{ property.category }}</span>
      </div>
    </div>
    
    <div class="p-3">
      <div class="flex justify-between items-start mb-1">
        <h3 class="font-bold text-gray-900 truncate pr-2">{{ property.title }}</h3>
        <p class="text-rose-500 font-bold flex-shrink-0">${{ property.price }}</p>
      </div>
      <p class="text-xs text-gray-500 mb-3 truncate">{{ property.address }}</p>
      
      <div class="flex items-center gap-3 text-gray-400 text-xs">
        <div class="flex items-center gap-1" v-if="property.features.bedrooms">
          <BedDouble :size="14" />
          <span>{{ property.features.bedrooms }}</span>
        </div>
        <div class="flex items-center gap-1" v-if="property.features.bathrooms">
          <Bath :size="14" />
          <span>{{ property.features.bathrooms }}</span>
        </div>
         <div class="flex items-center gap-1" v-if="property.features.area">
          <Square :size="14" />
          <span>{{ property.features.area }}m²</span>
        </div>
      </div>
    </div>
  </div>
</template>
