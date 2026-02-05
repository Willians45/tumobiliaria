<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker, LControl } from "@vue-leaflet/vue-leaflet";
import { Locate, Star, X, Heart, LocateFixed, Loader2 } from 'lucide-vue-next';
import { useFavorites } from '../composables/useFavorites';
import { usePropertyStorage } from '../composables/usePropertyStorage';
import { useAuth } from '../composables/useAuth';

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
  },
  height: {
    type: String,
    default: 'h-[45vh]'
  }
});

const router = useRouter();
const route = useRoute(); // Added
const { toggleFavorite, isFavorite } = useFavorites();
const { userProperties, loadProperties } = usePropertyStorage();
const { currentUser, isGuest } = useAuth();

const zoom = ref(13);
const center = ref([10.205, -64.695]); // Default Lechería
const mapRef = ref(null);
const selectedProperty = ref(null);
const isLocating = ref(false);

onMounted(() => { // Added
  loadProperties(); // Ensure user properties are fresh
});

const allProperties = computed(() => { // Renamed from 'properties' to avoid conflict with props
  return [...userProperties.value, ...props.properties];
});

const locateUser = () => {
  if (navigator.geolocation) {
    isLocating.value = true;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        center.value = [position.coords.latitude, position.coords.longitude];
        zoom.value = 15;
        isLocating.value = false;
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("No se pudo obtener tu ubicación.");
        isLocating.value = false;
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

const selectedPropertyImage = computed(() => {
  if (!selectedProperty.value) return '';
  return selectedProperty.value.image || (selectedProperty.value.images && selectedProperty.value.images.length > 0 ? selectedProperty.value.images[0] : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=400');
});
</script>

<template>
  <div :class="[height, 'relative w-full overflow-hidden shadow-sm z-0']">
    <l-map ref="mapRef" v-model:zoom="zoom" v-model:center="center" :use-global-leaflet="false" @click="closeCard">
      <l-tile-layer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        layer-type="base"
        name="OpenStreetMap"
        attribution=""
      ></l-tile-layer>

      <!-- Custom Price Markers -->
      <l-marker 
        v-for="property in allProperties" 
        :key="property.id" 
        :lat-lng="[property.location.lat, property.location.lng]"
        :icon="createPriceMarker(property)"
        @click="handleMarkerClick(property)"
      />
      
      <l-control position="topright">
         <button 
           @click.stop="locateUser" 
           class="p-2.5 bg-white rounded-xl shadow-lg border border-gray-100 text-rose-500 hover:bg-rose-50 transition-all active:scale-95 flex items-center justify-center group"
           :disabled="isLocating"
         >
            <LocateFixed v-if="!isLocating" :size="20" />
            <Loader2 v-else :size="20" class="animate-spin text-gray-400" />
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
            <div class="w-28 h-full bg-gray-100 relative">
              <img 
                :key="selectedProperty.id"
                :src="selectedPropertyImage" 
                :alt="selectedProperty.title" 
                class="w-full h-full object-cover" 
              />
              <button v-if="isGuest || (!userProperties.some(p => String(p.id) === String(selectedProperty.id)) && !(selectedProperty.uploader?.name === currentUser?.name))" @click.stop="toggleFavorite(selectedProperty.id)" class="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white text-gray-500 backdrop-blur-sm transition-colors z-10">
                <Heart :size="14" :class="{ 'fill-rose-500 text-rose-500': isFavorite(selectedProperty.id) }" />
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
