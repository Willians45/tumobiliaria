<script setup>
import { Heart, Star, Bed, Bath, Square } from 'lucide-vue-next';
import { useFavorites } from '../composables/useFavorites';

defineProps({
  property: {
    type: Object,
    required: true
  }
});

const { toggleFavorite, isFavorite } = useFavorites();

const handleLike = (e, id) => {
  e.preventDefault();
  e.stopPropagation();
  toggleFavorite(id);
};
</script>

<template>
  <router-link :to="{ name: 'property-details', params: { id: property.id } }" class="block">
    <div class="bg-white rounded-2xl p-3 md:p-4 shadow-sm hover:shadow-md transition-all duration-300 flex flex-row gap-3 md:gap-4 group cursor-pointer w-full">
      <!-- Image Section -->
      <div class="relative w-28 md:w-48 h-28 md:h-auto md:aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
        <img :src="property.image" :alt="property.title" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        
        <!-- Favorite Button -->
        <button 
          @click="(e) => handleLike(e, property.id)"
          class="absolute top-2 right-2 p-2 rounded-full transition-all duration-300 z-10"
          :class="isFavorite(property.id) ? 'bg-red-50 text-red-500 scale-110' : 'bg-black/20 text-white hover:bg-white hover:text-red-500 hover:scale-110 backdrop-blur-sm'"
        >
          <Heart :size="18" :class="{ 'fill-current animate-heart-beat': isFavorite(property.id) }" stroke-width="2.5" />
        </button>

        <!-- Badge -->
        <div v-if="property.uploader?.name" class="absolute bottom-2 left-2 bg-white/95 backdrop-blur-md px-2 py-1 rounded-full shadow-sm z-10">
          <span class="text-[10px] font-bold text-gray-800 uppercase tracking-wide">
            {{ property.category }}
          </span>
        </div>
      </div>
      
      <!-- Info Section -->
      <div class="flex flex-col flex-grow justify-between py-0.5">
        <div>
          <div class="flex justify-between items-start mb-1 md:mb-2">
            <h3 class="font-bold text-gray-900 text-sm md:text-lg leading-tight flex-1 line-clamp-2 pr-4 md:pr-0">{{ property.address.split(',')[0] }}</h3>
            <div class="flex items-center gap-1 bg-gray-50 px-1.5 md:px-2 py-0.5 md:py-1 rounded-md shrink-0 ml-1 md:ml-2">
              <Star :size="10" class="md:hidden text-orange-400 fill-orange-400" />
              <Star :size="12" class="hidden md:block text-orange-400 fill-orange-400" />
              <span class="text-[10px] md:text-xs font-semibold text-gray-700">4.88</span>
            </div>
          </div>
          
          <p class="text-gray-500 text-[10px] md:text-sm mb-1.5 md:mb-3">Anfitrión: {{ property.uploader.name }}</p>

          <!-- Features -->
          <div class="flex gap-2 md:gap-4 mb-1.5 md:mb-3">
            <div class="flex items-center gap-1 text-gray-600" v-if="property.features.bedrooms > 0">
              <Bed :size="14" class="md:hidden" />
              <Bed :size="16" class="hidden md:block" />
              <span class="text-[11px] md:text-sm">{{ property.features.bedrooms }}</span>
            </div>
            <div class="flex items-center gap-1 text-gray-600" v-if="property.features.bathrooms > 0">
              <Bath :size="14" class="md:hidden" />
              <Bath :size="16" class="hidden md:block" />
              <span class="text-[11px] md:text-sm">{{ property.features.bathrooms }}</span>
            </div>
            <div class="flex items-center gap-1 text-gray-600">
              <Square :size="14" class="md:hidden" />
              <Square :size="16" class="hidden md:block" />
              <span class="text-[11px] md:text-sm">{{ property.features.area }}m²</span>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between pt-1.5 md:pt-3 border-t border-gray-100">
          <div class="flex items-baseline gap-1">
            <span class="font-bold text-gray-900 text-base md:text-xl">${{ property.price.toLocaleString() }}</span>
            <span class="text-gray-500 text-[10px] md:text-sm">/ {{ property.type === 'rent' ? 'mes' : 'total' }}</span>
          </div>
          <span class="text-[9px] md:text-xs font-semibold px-2 md:px-3 py-1 md:py-1.5 rounded-lg" 
            :class="property.type === 'sale' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'">
            {{ property.type === 'sale' ? 'Venta' : 'Alquiler' }}
          </span>
        </div>
      </div>
    </div>
  </router-link>
</template>

<style scoped>
@keyframes heart-beat {
  0% { transform: scale(1); }
  25% { transform: scale(1.3); }
  50% { transform: scale(1); }
  75% { transform: scale(1.3); }
  100% { transform: scale(1); }
}
.animate-heart-beat {
  animation: heart-beat 0.4s ease-in-out;
}
</style>
