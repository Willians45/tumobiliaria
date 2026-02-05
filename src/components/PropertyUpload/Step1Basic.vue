<script setup>
import { computed } from 'vue';

const props = defineProps({
  formData: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update:formData', 'next']);

const categories = ['Apartamento', 'Casa', 'Villa', 'Comercio', 'Terreno'];

const isStepValid = computed(() => {
  return props.formData.title.length >= 10 && 
         props.formData.price > 0 && 
         props.formData.type && 
         props.formData.category;
});

const handleUpdate = (key, value) => {
  emit('update:formData', { ...props.formData, [key]: value });
};
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <div class="text-center mb-8">
      <h2 class="text-2xl font-bold text-gray-900">Cuéntanos sobre tu propiedad</h2>
      <p class="text-gray-500 text-sm">Paso 1: Información básica</p>
    </div>

    <!-- Title -->
    <div class="space-y-2">
      <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest">Título del anuncio</label>
      <input 
        :value="formData.title"
        @input="e => handleUpdate('title', e.target.value)"
        type="text" 
        placeholder="Ej: Hermoso Penthouse con vista al mar" 
        class="w-full bg-white border border-gray-200 rounded-2xl py-3.5 px-5 text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all shadow-sm"
      />
      <p class="text-[10px] text-gray-400" :class="{ 'text-rose-500': formData.title.length > 0 && formData.title.length < 10 }">
        Mínimo 10 caracteres (Llevas {{ formData.title.length }})
      </p>
    </div>

    <!-- Type (Sale/Rent) -->
    <div class="space-y-2">
      <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest">¿Qué buscas con esta propiedad?</label>
      <div class="flex gap-3">
        <button 
          v-for="type in ['sale', 'rent']" 
          :key="type"
          @click="handleUpdate('type', type)"
          class="flex-1 py-3 px-4 rounded-2xl text-sm font-bold transition-all border-2"
          :class="formData.type === type ? 'bg-rose-500 border-rose-500 text-white shadow-lg' : 'bg-white border-gray-100 text-gray-500 hover:border-rose-200'"
        >
          {{ type === 'sale' ? 'Venta' : 'Alquiler' }}
        </button>
      </div>
    </div>

    <!-- Category -->
    <div class="space-y-2">
      <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest">Categoría</label>
      <select 
        :value="formData.category"
        @change="e => handleUpdate('category', e.target.value)"
        class="w-full bg-white border border-gray-200 rounded-2xl py-3.5 px-5 text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all shadow-sm appearance-none"
      >
        <option value="" disabled>Selecciona una categoría</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
    </div>

    <!-- Price -->
    <div class="space-y-2">
      <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest">Precio ($)</label>
      <div class="relative">
        <span class="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
        <input 
          :value="formData.price"
          @input="e => handleUpdate('price', parseFloat(e.target.value) || 0)"
          type="number" 
          placeholder="0.00" 
          class="w-full bg-white border border-gray-200 rounded-2xl py-3.5 pl-10 pr-5 text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all shadow-sm"
        />
      </div>
    </div>

    <!-- Description -->
    <div class="space-y-2">
      <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest">Descripción</label>
      <textarea 
        :value="formData.description"
        @input="e => handleUpdate('description', e.target.value)"
        placeholder="Describe detalladamente tu propiedad..." 
        rows="4"
        class="w-full bg-white border border-gray-200 rounded-2xl py-3.5 px-5 text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all shadow-sm resize-none"
      ></textarea>
    </div>

    <button 
      @click="emit('next')"
      :disabled="!isStepValid"
      class="w-full py-4 bg-rose-500 text-white font-bold rounded-2xl shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
    >
      Continuar
    </button>
  </div>
</template>
