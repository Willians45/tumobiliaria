<script setup>
import { computed } from 'vue';
import { Bed, Bath, Maximize, Car, Sparkles, Check } from 'lucide-vue-next';

const props = defineProps({
  formData: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update:formData', 'next', 'back']);

const amenitiesList = [
  'Piscina', 'Gimnasio', 'Seguridad 24/7', 'Área de Juegos', 
  'Jardín', 'Balcón', 'Aire Acondicionado', 'Jacuzzi', 
  'Maletero', 'Ascensor', 'Cámara de Seguridad', 'Salón de Fiestas'
];

const handleFeatureUpdate = (key, value) => {
  emit('update:formData', { 
    ...props.formData, 
    features: { ...props.formData.features, [key]: value } 
  });
};

const toggleAmenity = (amenity) => {
  const currentAmenities = [...props.formData.features.amenities];
  const index = currentAmenities.indexOf(amenity);
  
  if (index > -1) {
    currentAmenities.splice(index, 1);
  } else {
    currentAmenities.push(amenity);
  }
  
  handleFeatureUpdate('amenities', currentAmenities);
};

const isStepValid = computed(() => {
  return props.formData.features.area > 0;
});
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <div class="text-center mb-8">
      <h2 class="text-2xl font-bold text-gray-900">Características Técnicas</h2>
      <p class="text-gray-500 text-sm">Paso 3: Detalles de la propiedad</p>
    </div>

    <!-- Counters: Bedrooms & Bathrooms -->
    <div class="grid grid-cols-2 gap-4">
      <div class="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center gap-3">
        <div class="w-10 h-10 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
          <Bed :size="20" />
        </div>
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Habitaciones</p>
        <div class="flex items-center gap-4">
          <button 
            @click="handleFeatureUpdate('bedrooms', Math.max(0, formData.features.bedrooms - 1))"
            class="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:border-rose-300 hover:text-rose-500 transition-all"
          >
            -
          </button>
          <span class="font-bold text-xl">{{ formData.features.bedrooms }}</span>
          <button 
            @click="handleFeatureUpdate('bedrooms', formData.features.bedrooms + 1)"
            class="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:border-rose-300 hover:text-rose-500 transition-all"
          >
            +
          </button>
        </div>
      </div>

      <div class="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center gap-3">
        <div class="w-10 h-10 bg-cyan-50 text-cyan-500 rounded-2xl flex items-center justify-center">
          <Bath :size="20" />
        </div>
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Baños</p>
        <div class="flex items-center gap-4">
          <button 
            @click="handleFeatureUpdate('bathrooms', Math.max(0, formData.features.bathrooms - 1))"
            class="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:border-rose-300 hover:text-rose-500 transition-all"
          >
            -
          </button>
          <span class="font-bold text-xl">{{ formData.features.bathrooms }}</span>
          <button 
            @click="handleFeatureUpdate('bathrooms', formData.features.bathrooms + 1)"
            class="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:border-rose-300 hover:text-rose-500 transition-all"
          >
            +
          </button>
        </div>
      </div>
    </div>

    <!-- Area Input -->
    <div class="space-y-2">
      <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest">Área total (m²)</label>
      <div class="relative">
        <Maximize :size="18" class="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input 
          :value="formData.features.area"
          @input="e => handleFeatureUpdate('area', parseFloat(e.target.value) || 0)"
          type="number" 
          placeholder="Ej: 120" 
          class="w-full bg-white border border-gray-200 rounded-2xl py-3.5 pl-12 pr-5 text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all shadow-sm"
        />
        <span class="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">m²</span>
      </div>
    </div>

    <!-- Parking Switch -->
    <div class="flex items-center justify-between p-4 bg-white rounded-3xl border border-gray-100 shadow-sm">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-slate-50 text-slate-500 rounded-2xl flex items-center justify-center">
          <Car :size="20" />
        </div>
        <div>
          <p class="text-sm font-bold text-gray-900 tracking-tight">Puesto de Estacionamiento</p>
          <p class="text-[10px] text-gray-400">¿Incluye lugar para vehículo?</p>
        </div>
      </div>
      <button 
        @click="handleFeatureUpdate('parking', !formData.features.parking)"
        class="w-12 h-6 rounded-full transition-colors relative"
        :class="formData.features.parking ? 'bg-rose-500' : 'bg-gray-200'"
      >
        <div 
          class="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform"
          :class="formData.features.parking ? 'translate-x-6' : ''"
        ></div>
      </button>
    </div>

    <!-- Amenities Grid -->
    <div class="space-y-4">
      <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
        <Sparkles :size="14" /> Amenidades y servicios
      </label>
      <div class="grid grid-cols-2 gap-2">
        <button 
          v-for="amenity in amenitiesList" 
          :key="amenity"
          @click="toggleAmenity(amenity)"
          class="flex items-center gap-2 p-3 rounded-2xl border text-left transition-all"
          :class="formData.features.amenities.includes(amenity) ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'"
        >
          <div 
            class="w-4 h-4 rounded-md flex items-center justify-center flex-shrink-0"
            :class="formData.features.amenities.includes(amenity) ? 'bg-rose-500 text-white' : 'bg-gray-100'"
          >
            <Check v-if="formData.features.amenities.includes(amenity)" :size="10" stroke-width="4" />
          </div>
          <span class="text-xs font-medium">{{ amenity }}</span>
        </button>
      </div>
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
        :disabled="!isStepValid"
        class="flex-[2] py-4 bg-rose-500 text-white font-bold rounded-2xl shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continuar
      </button>
    </div>
  </div>
</template>
