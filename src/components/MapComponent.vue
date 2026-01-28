<script setup>
import { ref, onMounted } from 'vue';
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker, LPopup, LControl } from "@vue-leaflet/vue-leaflet";
import { Locate } from 'lucide-vue-next';

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

const zoom = ref(13);
const center = ref([10.205, -64.695]); // Default Lechería
const mapRef = ref(null);

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
</script>

<template>
  <div class="relative h-[65vh] w-full rounded-b-3xl overflow-hidden shadow-lg z-0">
    <l-map ref="mapRef" v-model:zoom="zoom" v-model:center="center" :use-global-leaflet="false">
      <l-tile-layer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        layer-type="base"
        name="OpenStreetMap"
        attribution=""
      ></l-tile-layer>

      <l-marker 
        v-for="property in properties" 
        :key="property.id" 
        :lat-lng="[property.location.lat, property.location.lng]"
      >
        <l-popup>
          <div class="p-1">
            <img :src="property.image" class="w-full h-20 object-cover rounded mb-2" />
            <p class="font-bold text-sm">{{ property.title }}</p>
            <p class="text-rose-500 font-bold">${{ property.price }}</p>
          </div>
        </l-popup>
      </l-marker>
      
      <l-control position="topright">
         <button @click="locateUser" class="bg-white p-2 rounded-lg shadow-md hover:bg-gray-100 transition-colors">
            <Locate :size="20" class="text-gray-700" />
         </button>
      </l-control>
    </l-map>
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
</style>
