<script setup>
import { ref } from 'vue';
import { ImagePlus, X, Star, Loader2, Image as ImageIcon } from 'lucide-vue-next';
import { usePropertyStorage } from '../../composables/usePropertyStorage';

const props = defineProps({
  formData: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update:formData', 'finish', 'back']);

const { uploadImage } = usePropertyStorage();
const isUploading = ref(false);
const fileInput = ref(null);

const handleFileUpload = async (event) => {
  const files = Array.from(event.target.files);
  if (!files.length) return;

  isUploading.value = true;
  
  try {
    const uploadPromises = files.map(file => uploadImage(file));
    const base64Images = await Promise.all(uploadPromises);
    
    const newImages = [...props.formData.images, ...base64Images];
    emit('update:formData', { ...props.formData, images: newImages });
  } catch (error) {
    console.error('Upload failed:', error);
  } finally {
    isUploading.value = false;
    if (fileInput.value) fileInput.value.value = '';
  }
};

const removeImage = (index) => {
  const updatedImages = [...props.formData.images];
  updatedImages.splice(index, 1);
  emit('update:formData', { ...props.formData, images: updatedImages });
};

const setMainImage = (index) => {
  if (index === 0) return;
  const updatedImages = [...props.formData.images];
  const [image] = updatedImages.splice(index, 1);
  updatedImages.unshift(image);
  emit('update:formData', { ...props.formData, images: updatedImages });
};
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <div class="text-center mb-8">
      <h2 class="text-2xl font-bold text-gray-900">Fotos de la Propiedad</h2>
      <p class="text-gray-500 text-sm">Paso 4: Atrae a los clientes visualmente</p>
    </div>

    <!-- Upload Area -->
    <div 
      @click="!isUploading && fileInput.click()"
      class="border-2 border-dashed border-gray-200 rounded-3xl p-10 flex flex-col items-center justify-center gap-4 transition-all hover:border-rose-300 hover:bg-rose-50/30 cursor-pointer group"
      :class="{ 'opacity-50 cursor-not-allowed': isUploading }"
    >
      <input 
        ref="fileInput"
        type="file" 
        multiple 
        accept="image/*" 
        class="hidden" 
        @change="handleFileUpload"
      />
      
      <div class="w-16 h-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
        <Loader2 v-if="isUploading" :size="32" class="animate-spin" />
        <ImagePlus v-else :size="32" />
      </div>
      
      <div class="text-center">
        <p class="text-sm font-bold text-gray-900">Haz clic para subir fotos</p>
        <p class="text-xs text-gray-400 mt-1">Sube hasta 10 imágenes (JPG, PNG)</p>
      </div>
    </div>

    <!-- Image Grid -->
    <div v-if="formData.images.length > 0" class="space-y-4">
      <div class="flex items-center justify-between">
        <label class="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
          <ImageIcon :size="14" /> Tus fotos ({{ formData.images.length }})
        </label>
        <p class="text-[10px] text-gray-400 font-medium">* La primera será la foto de portada</p>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div 
          v-for="(img, index) in formData.images" 
          :key="index"
          class="relative group rounded-2xl overflow-hidden aspect-square border border-gray-100 shadow-sm"
        >
          <img :src="img" class="w-full h-full object-cover" />
          
          <!-- Cover Badge -->
          <div v-if="index === 0" class="absolute top-2 left-2 bg-rose-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest shadow-lg">
            Portada
          </div>

          <!-- Actions Overlay -->
          <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button 
              @click="removeImage(index)"
              class="w-8 h-8 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-rose-500 transition-colors"
              title="Eliminar"
            >
              <X :size="16" />
            </button>
            <button 
              v-if="index !== 0"
              @click="setMainImage(index)"
              class="w-8 h-8 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-amber-500 transition-colors"
              title="Hacer Portada"
            >
              <Star :size="16" />
            </button>
          </div>
        </div>
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
        @click="emit('finish')"
        :disabled="formData.images.length === 0 || isUploading"
        class="flex-[2] py-4 bg-rose-500 text-white font-bold rounded-2xl shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="isUploading">Subiendo...</span>
        <span v-else>Terminar y Publicar</span>
      </button>
    </div>
  </div>
</template>
