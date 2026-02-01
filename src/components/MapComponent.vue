<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker, LControl } from "@vue-leaflet/vue-leaflet";
import { Locate, Star, X, Heart } from 'lucide-vue-next';
import { useFavorites } from '../composables/useFavorites';

// Fix for missing marker icons in Leaflet + Vite
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const props = defineProps({
  properties: {
    type: Array,
    default: () => []
  }
});

const router = useRouter();
const { toggleFavorite, isFavorite } = useFavorites();
const zoom = ref(13);
const center = ref([10.205, -64.695]); // Default Lechería
const mapRef = ref(null);
const selectedProperty = ref(null);

const locateUser = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        center.value = [position.coords.latitude, position.coords.longitude];
        zoom.value = 15;
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("No se pudo obtener tu ubicación.");
      }
    );
  }
};

const createPriceMarker = (property) => {
  const isSelected = selectedProperty.value?.id === property.id;
  const bgColor = isSelected ? 'bg-black text-white z-50 scale-110' : 'bg-white text-gray-900 hover:scale-105';
  
  return L.divIcon({
    className: 'custom-price-marker',
    html: `
      <div class="${bgColor} px-3 py-1.5 rounded-full shadow-md border border-gray-200 font-bold text-xs whitespace-nowrap transition-all duration-300 cursor-pointer pointer-events-auto">
        $${property.price.toLocaleString()}
      </div>
    `,
    iconSize: [null, null], // Auto size based on content
    iconAnchor: [20, 15],
  });
};

const handleMarkerClick = (property) => {
  selectedProperty.value = property;
  // Optional: Center map on selected property
  // center.value = [property.location.lat, property.location.lng];
};

const closeCard = () => {
  selectedProperty.value = null;
};

const navigateToProperty = () => {
  if (selectedProperty.value) {
    router.push({ name: 'property-details', params: { id: selectedProperty.value.id } });
  }
};
</script>

<template>
  <div class="relative h-[65vh] w-full rounded-b-3xl overflow-hidden shadow-lg z-0">
    <l-map ref="mapRef" v-model:zoom="zoom" v-model:center="center" :use-global-leaflet="false" @click="closeCard">
      <l-tile-layer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        layer-type="base"
        name="OpenStreetMap"
        attribution=""
      ></l-tile-layer>

      <!-- Custom Price Markers -->
      <l-marker 
        v-for="property in properties" 
        :key="property.id" 
        :lat-lng="[property.location.lat, property.location.lng]"
        :icon="createPriceMarker(property)"
        @click="handleMarkerClick(property)"
      />
      
      <l-control position="topright">
         <button @click.stop="locateUser" class="bg-white p-2 rounded-lg shadow-md hover:bg-gray-100 transition-colors">
            <Locate :size="20" class="text-gray-700" />
         </button>
      </l-control>
    </l-map>

    <!-- Airbnb-style Property Floating Card -->
    <transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="translate-y-full opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-full opacity-0"
    >
      <div v-if="selectedProperty" class="absolute bottom-6 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white rounded-2xl shadow-xl z-[1000] overflow-hidden cursor-pointer" @click="navigateToProperty">
        <div class="flex h-28">
           <!-- Image -->
           <div class="w-28 h-full bg-gray-200 relative">
             <img :src="selectedProperty.image" :alt="selectedProperty.title" class="w-full h-full object-cover" />
             <button @click.stop="toggleFavorite(selectedProperty.id)" class="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white text-gray-500 backdrop-blur-sm transition-colors z-10">
                <Heart :size="14" :class="{ 'fill-red-500 text-red-500': isFavorite(selectedProperty.id) }" v-if="isFavorite" />
                <!-- Icon logic handled by Heart component if we import it, or just generic logic. Adding Heart import manually above if missing -->
             </button>
           </div>
           
           <!-- Content -->
           <div class="flex-1 p-3 flex flex-col justify-center relative">
              <button @click.stop="closeCard" class="absolute top-2 right-2 p-1 text-gray-400 hover:bg-gray-100 rounded-full">
                <X :size="16" />
              </button>
              
              <div class="flex justify-between items-start pr-6">
                 <div>
                    <h3 class="font-bold text-gray-900 text-sm line-clamp-1 pr-2">{{ selectedProperty.title }}</h3>
                    <p class="text-xs text-gray-500">{{ selectedProperty.category }}</p>
                 </div>
              </div>
              
              <div class="mt-2 flex justify-between items-end">
                 <div>
                    <span class="font-bold text-gray-900">${{ selectedProperty.price.toLocaleString() }}</span>
                    <span class="text-xs text-gray-500"> /{{ selectedProperty.type === 'rent' ? 'mes' : 'total' }}</span>
                 </div>
                 <div class="flex items-center gap-1 text-xs font-semibold">
                    <Star :size="10" class="fill-current" /> 4.88
                 </div>
              </div>
           </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
/* Ensure map z-index sits below header */
:deep(.leaflet-pane) {
  z-index: 10; 
}
:deep(.leaflet-top), :deep(.leaflet-bottom) {
  z-index: 20;
}

/* Custom marker styles - Remove default border to allow custom styling via HTML */
:deep(.custom-price-marker) {
  background: transparent;
  border: none;
}
</style>
