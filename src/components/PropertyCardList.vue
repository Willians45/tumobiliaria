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
    <div class="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-4 group cursor-pointer w-full">
      <!-- Image Section -->
      <div class="relative w-full md:w-48 h-48 md:h-auto md:aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
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
        <div v-if="property.uploader?.name" class="absolute top-2 left-2 bg-white/95 backdrop-blur-md px-2 py-1 rounded-full shadow-sm">
          <span class="text-[10px] font-bold text-gray-800 uppercase tracking-wide">
            {{ property.category }}
          </span>
        </div>
      </div>
      
      <!-- Info Section -->
      <div class="flex flex-col flex-grow justify-between">
        <div>
          <div class="flex justify-between items-start mb-2">
            <h3 class="font-bold text-gray-900 text-lg leading-tight flex-1">{{ property.address.split(',')[0] }}</h3>
            <div class="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md shrink-0 ml-2">
              <Star :size="12" class="text-orange-400 fill-orange-400" />
              <span class="text-xs font-semibold text-gray-700">4.88</span>
            </div>
          </div>
          
          <p class="text-gray-500 text-sm mb-3">Anfitrión: {{ property.uploader.name }}</p>

          <!-- Features -->
          <div class="flex gap-4 mb-3">
            <div class="flex items-center gap-1 text-gray-600" v-if="property.features.bedrooms > 0">
              <Bed :size="16" />
              <span class="text-sm">{{ property.features.bedrooms }}</span>
            </div>
            <div class="flex items-center gap-1 text-gray-600" v-if="property.features.bathrooms > 0">
              <Bath :size="16" />
              <span class="text-sm">{{ property.features.bathrooms }}</span>
            </div>
            <div class="flex items-center gap-1 text-gray-600">
              <Square :size="16" />
              <span class="text-sm">{{ property.features.area }}m²</span>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between pt-3 border-t border-gray-100">
          <div class="flex items-baseline gap-1">
            <span class="font-bold text-gray-900 text-xl">${{ property.price.toLocaleString() }}</span>
            <span class="text-gray-500 text-sm">/ {{ property.type === 'rent' ? 'mes' : 'total' }}</span>
          </div>
          <span class="text-xs font-semibold px-3 py-1.5 rounded-lg" 
            :class="property.type === 'sale' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'">
            {{ property.type === 'sale' ? 'En Venta' : 'Alquiler' }}
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
