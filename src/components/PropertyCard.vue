<script setup>
import { Heart, Star } from 'lucide-vue-next';
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
  <router-link :to="{ name: 'property-details', params: { id: property.id } }" class="block h-full">
    <div class="bg-white rounded-2xl p-3 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col group cursor-pointer w-full">
      <!-- Image Section -->
      <div class="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-gray-100 flex-shrink-0">
        <img :src="property.image" :alt="property.title" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        
        <!-- Favorite Button -->
        <button 
          @click="(e) => handleLike(e, property.id)"
          class="absolute top-3 right-3 p-2 rounded-full transition-all duration-300 z-10"
          :class="isFavorite(property.id) ? 'bg-red-50 text-red-500 scale-110' : 'bg-black/20 text-white hover:bg-white hover:text-red-500 hover:scale-110 backdrop-blur-sm'"
        >
          <Heart :size="20" :class="{ 'fill-current animate-heart-beat': isFavorite(property.id) }" stroke-width="2.5" />
        </button>

        <!-- Badge -->
        <div v-if="property.uploader?.name" class="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm">
          <span class="text-[10px] font-bold text-gray-800 uppercase tracking-wide flex items-center gap-1">
            {{ property.category }}
          </span>
        </div>
      </div>
      
      <!-- Info Section -->
      <div class="flex flex-col flex-grow w-full px-1 pb-1">
        <div class="flex justify-between items-start mb-1 gap-2 h-10">
          <h3 class="font-bold text-gray-900 text-[15px] leading-tight line-clamp-2 flex-1">{{ property.address.split(',')[0] }}</h3>
           <div class="flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded-md shrink-0 h-fit">
             <Star :size="10" class="text-orange-400 fill-orange-400" />
             <span class="text-xs font-semibold text-gray-700">4.88</span>
          </div>
        </div>
        
        <p class="text-gray-500 text-xs font-medium mb-3 line-clamp-1">Anfitrión: {{ property.uploader.name }}</p>

        <div class="mt-auto pt-2 border-t border-gray-50 flex items-center justify-between">
           <div class="flex items-baseline gap-1">
            <span class="font-bold text-gray-900 text-lg">${{ property.price.toLocaleString() }}</span>
            <span class="text-gray-500 text-xs font-medium">/ {{ property.type === 'rent' ? 'mes' : 'total' }}</span>
          </div>
          <span class="text-[10px] font-semibold px-2 py-1 rounded-md" 
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
