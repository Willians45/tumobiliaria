<script setup>
import { ref, onMounted, computed } from 'vue';
import { MapPin, Navigation, LocateFixed, Loader2 } from 'lucide-vue-next';
import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet';
import 'leaflet/dist/leaflet.css';

const props = defineProps({
  formData: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update:formData', 'next', 'back']);

const center = ref([10.4806, -66.9036]); // Caracas default if none
const markerPos = ref(props.formData.location ? [props.formData.location.lat, props.formData.location.lng] : [10.4806, -66.9036]);
const zoom = ref(13);
const isLocating = ref(false);
const isFetchingAddress = ref(false);

const fetchAddress = async (lat, lng) => {
  isFetchingAddress.value = true;
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`, {
      headers: {
        'Accept-Language': 'es'
      }
    });
    const data = await response.json();
    if (data && data.display_name) {
      // Simplify the display name (Nominatim often returns very long strings)
      const parts = data.display_name.split(', ');
      // Take the first few parts (Street, Number, Neighborhood, City)
      const simplified = parts.slice(0, 4).join(', ');
      emit('update:formData', { ...props.formData, address: simplified, location: { lat, lng } });
    }
  } catch (error) {
    console.error('Error fetching address:', error);
  } finally {
    isFetchingAddress.value = false;
  }
};

const getCurrentLocation = () => {
  if (!navigator.geolocation) {
    alert('Tu navegador no soporta geolocalización');
    return;
  }

  isLocating.value = true;
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      center.value = [latitude, longitude];
      markerPos.value = [latitude, longitude];
      zoom.value = 16;
      fetchAddress(latitude, longitude);
      isLocating.value = false;
    },
    (error) => {
      console.error('Error getting location:', error);
      alert('No se pudo obtener tu ubicación. Verifica los permisos de tu navegador.');
      isLocating.value = false;
    },
    { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
  );
};

const handleMapClick = (e) => {
  const { lat, lng } = e.latlng;
  markerPos.value = [lat, lng];
  fetchAddress(lat, lng);
};

const handleMarkerDrag = (e) => {
  const { lat, lng } = e.target.getLatLng();
  markerPos.value = [lat, lng];
  fetchAddress(lat, lng);
};

const updateLocation = (lat, lng) => {
  emit('update:formData', { 
    ...props.formData, 
    location: { lat, lng } 
  });
};

const handleAddressChange = (e) => {
  emit('update:formData', { ...props.formData, address: e.target.value });
};

onMounted(() => {
  if (props.formData.location) {
    center.value = [props.formData.location.lat, props.formData.location.lng];
  }
});

const isStepValid = computed(() => {
  return props.formData.address && props.formData.address.length > 5 && props.formData.location;
});
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <div class="text-center mb-8">
      <h2 class="text-2xl font-bold text-gray-900">¿Dónde está ubicada?</h2>
      <p class="text-gray-500 text-sm">Paso 2: Ubicación exacta</p>
    </div>

    <!-- Address Input -->
    <div class="space-y-2">
      <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest">Dirección descriptiva</label>
      <div class="relative">
        <MapPin :size="18" class="absolute left-5 top-3.5 text-gray-400" />
        <input 
          :value="formData.address"
          @input="handleAddressChange"
          type="text" 
          :disabled="isFetchingAddress"
          placeholder="Ej: Calle Principal, Edif. Altavila, Apto 4B" 
          class="w-full bg-white border border-gray-200 rounded-2xl py-3.5 pl-12 pr-12 text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all shadow-sm disabled:opacity-50"
        />
        <div v-if="isFetchingAddress" class="absolute right-4 top-3.5">
          <Loader2 :size="18" class="animate-spin text-rose-500" />
        </div>
      </div>
    </div>

    <!-- Mini Map -->
    <div class="space-y-2">
      <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
        <Navigation :size="14" /> Marca el punto exacto
      </label>
      <div class="h-64 rounded-3xl overflow-hidden border border-gray-200 shadow-sm z-0 relative">
        <!-- Geolocalización Button Overlay -->
        <button 
          @click.stop="getCurrentLocation"
          type="button"
          class="absolute top-4 right-4 z-[1000] p-2.5 bg-white rounded-xl shadow-lg border border-gray-100 text-rose-500 hover:bg-rose-50 transition-all active:scale-95 flex items-center gap-2 group"
          :class="{ 'opacity-70 pointer-events-none': isLocating }"
        >
          <LocateFixed v-if="!isLocating" :size="18" />
          <Loader2 v-else :size="18" class="animate-spin text-gray-400" />
          <span class="text-[10px] font-bold uppercase tracking-wider hidden sm:group-hover:block pr-2">Mi Ubicación</span>
        </button>

        <l-map ref="map" v-model:zoom="zoom" :center="center" @click="handleMapClick" :use-global-leaflet="false">
          <l-tile-layer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            layer-type="base"
            name="OpenStreetMap"
          ></l-tile-layer>
          <l-marker 
            :lat-lng="markerPos" 
            draggable 
            @dragend="handleMarkerDrag"
          ></l-marker>
        </l-map>
      </div>
      <p class="text-[10px] text-gray-400">Puedes tocar el mapa para mover el marcador o arrastrarlo directamente.</p>
    </div>

    <div class="flex gap-4 pt-4">
      <button 
        @click="emit('back')"
        class="flex-1 py-4 bg-gray-100 text-gray-500 font-bold rounded-2xl transition-all active:scale-95"
      >
        Atrás
      </button>
      <button 
        @click="emit('next')"
        :disabled="!formData.location || !formData.address"
        class="flex-[2] py-4 bg-rose-500 text-white font-bold rounded-2xl shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continuar
      </button>
    </div>
  </div>
</template>
