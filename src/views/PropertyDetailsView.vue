<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { MapPin, Bed, Bath, Square, User, Car, Warehouse, ArrowLeft, Star, Heart, CheckCircle2, Share2, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import propertiesData from '../assets/properties.json';
import { useFavorites } from '../composables/useFavorites';

const route = useRoute();
const router = useRouter();
const property = ref(null);
const currentImageIndex = ref(0);
const { toggleFavorite, isFavorite } = useFavorites();

// Computed property to use the real images
const propertyImages = computed(() => {
  if (!property.value) return [];
  return property.value.images || [property.value.image];
});

onMounted(() => {
  window.scrollTo(0, 0); // Scroll to top
  const id = parseInt(route.params.id);
  property.value = propertiesData.find(p => p.id === id);
});

const goBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/');
  }
};

const nextImage = () => {
    currentImageIndex.value = (currentImageIndex.value + 1) % propertyImages.value.length;
};

const prevImage = () => {
    currentImageIndex.value = (currentImageIndex.value - 1 + propertyImages.value.length) % propertyImages.value.length;
};
</script>

<template>
  <div v-if="property" class="min-h-screen bg-gray-50 pb-20">
    <!-- Navbar Mobile (Hidden on mobile now, we use overlay button and internal action buttons) -->
    <div class="hidden md:hidden sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 justify-between items-center flex">
       <div class="w-6"></div> 
    </div>
    
    <!-- Navbar Mobile Action Buttons (REMOVED from fixed position - moving to inline) -->

    <!-- Back Button Desktop -->
    <div class="hidden md:block max-w-7xl mx-auto pt-6 px-6">
        <button @click="goBack" class="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors">
            <ArrowLeft :size="20" /> Volver
        </button>
    </div>

    <div class="max-w-7xl mx-auto pt-6 md:px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <!-- Main Content (Images + Details) -->
      <div class="lg:col-span-2 space-y-6">
        
        <!-- Image Gallery -->
        <div class="relative w-full aspect-[4/3] md:aspect-[16/9] md:rounded-3xl overflow-hidden group shadow-sm bg-gray-200">
          <img :src="propertyImages[currentImageIndex]" :alt="property.title" class="w-full h-full object-cover transition-all duration-500" />
          
          <!-- Back Button Overlay (Mobile & Desktop Image) -->
          <button @click="goBack" class="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md p-2 rounded-full shadow-md text-gray-700 hover:bg-white hover:scale-110 transition-all">
             <ArrowLeft :size="24" />
          </button>

          <!-- Image Controls (Visible always on mobile, hover on desktop) -->
          <div class="absolute inset-0 flex items-center justify-between p-4 pointer-events-none" v-if="propertyImages.length > 1">
               <button @click.stop="prevImage" class="pointer-events-auto bg-white/80 backdrop-blur hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-transform hover:scale-110 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                   <ChevronLeft :size="24" />
               </button>
               <button @click.stop="nextImage" class="pointer-events-auto bg-white/80 backdrop-blur hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-transform hover:scale-110 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                   <ChevronRight :size="24" />
               </button>
          </div>
          
          <!-- Image Dots (Hidden on mobile as requested) -->
          <div class="absolute bottom-16 md:bottom-4 left-0 right-0 justify-center gap-2 z-10 px-4 hidden md:flex" v-if="propertyImages.length > 1">
              <span v-for="(img, idx) in propertyImages" :key="idx" 
                class="w-2 h-2 rounded-full transition-all shadow-sm cursor-pointer"
                @click="currentImageIndex = idx"
                :class="idx === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50'">
              </span>
          </div>

          <!-- Image Overlay Info (Mobile Only) -->
          <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent pt-12 p-5 md:hidden pointer-events-none">
            <h1 class="text-white text-2xl font-bold leading-tight mb-1 text-outline drop-shadow-md">{{ property.title }}</h1>
            <p class="text-white/90 text-sm flex items-center gap-1 font-medium text-shadow-sm">
              <MapPin :size="14"/> {{ property.location.city || property.address }}
            </p>
          </div>
          <div class="absolute top-4 right-4 hidden md:flex gap-2">
             <button class="bg-white/90 backdrop-blur hover:bg-white text-gray-700 px-4 py-2 rounded-full text-sm font-semibold shadow-sm transition-all flex items-center gap-2">
                <Share2 :size="16" /> Compartir
             </button>
             <button @click="toggleFavorite(property.id)" class="bg-white/90 backdrop-blur hover:bg-white text-gray-700 px-4 py-2 rounded-full text-sm font-semibold shadow-sm transition-all flex items-center gap-2" :class="{ 'text-red-500': isFavorite(property.id) }">
                <Heart :size="16" :class="{ 'fill-current': isFavorite(property.id) }" /> Guardar
             </button>
          </div>
        </div>
        
        <!-- Mobile Action Buttons (Inline) -->
        <div class="flex gap-4 px-4 md:hidden">
            <button class="flex-1 bg-white border border-gray-200 text-gray-700 py-2.5 rounded-xl font-medium shadow-sm flex items-center justify-center gap-2">
                <Share2 :size="18" /> Compartir
            </button>
            <button @click="toggleFavorite(property.id)" class="flex-1 bg-white border border-gray-200 text-gray-700 py-2.5 rounded-xl font-medium shadow-sm flex items-center justify-center gap-2" :class="{ 'text-red-600 border-red-100 bg-red-50': isFavorite(property.id) }">
                <Heart :size="18" :class="{ 'fill-current': isFavorite(property.id) }" /> Guardar
            </button>
        </div>

        <!-- Property Header (Desktop) -->
        <div class="hidden md:block bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
           <div class="flex justify-between items-start mb-4">
             <div>
                <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ property.title }}</h1>
                 <div class="flex items-center gap-2 text-gray-500">
                    <MapPin :size="18" />
                    <span>{{ property.address }}</span>
                 </div>
             </div>
             <div class="flex flex-col items-end">
                <span class="text-3xl font-bold text-gray-900">${{ property.price.toLocaleString() }}</span>
                <span class="text-gray-500">{{ property.type === 'rent' ? '/mes' : 'Precio Total' }}</span>
             </div>
           </div>
           
           <div class="flex flex-wrap gap-2">
              <span class="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100">
                  {{ property.type === 'sale' ? 'Venta' : 'Alquiler' }}
              </span>
              <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium border border-gray-200">
                  {{ property.category }}
              </span>
               <div class="flex items-center gap-1 px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-sm font-medium border border-yellow-100">
                  <Star :size="14" class="fill-current" />
                  <span>4.88 (32 reseñas)</span>
              </div>
           </div>
        </div>

        <!-- Key Features Grid -->
        <div class="bg-white px-5 py-6 md:rounded-3xl md:shadow-sm md:border md:border-gray-100">
          <h2 class="text-lg font-bold text-gray-900 mb-4">Lo que ofrece este lugar</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Bed class="text-gray-500" :size="24" />
              <div>
                <p class="font-bold text-gray-900">{{ property.features.bedrooms }}</p>
                <p class="text-xs text-gray-500">Habitaciones</p>
              </div>
            </div>
            <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Bath class="text-gray-500" :size="24" />
              <div>
                <p class="font-bold text-gray-900">{{ property.features.bathrooms }}</p>
                <p class="text-xs text-gray-500">Baños</p>
              </div>
            </div>
            <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Square class="text-gray-500" :size="24" />
              <div>
                <p class="font-bold text-gray-900">{{ property.features.area }}m²</p>
                <p class="text-xs text-gray-500">Área</p>
              </div>
            </div>
            <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl" v-if="property.features.parking">
              <Car class="text-gray-500" :size="24" />
              <div>
                <p class="font-bold text-gray-900">Sí</p>
                <p class="text-xs text-gray-500">Parking</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div class="bg-white px-5 py-6 md:rounded-3xl md:shadow-sm md:border md:border-gray-100">
            <h2 class="text-lg font-bold text-gray-900 mb-3">Descripción</h2>
            <p class="text-gray-600 leading-relaxed text-sm md:text-base">
                Disfruta de una experiencia única en esta propiedad exclusiva. 
                Perfectamente ubicada cerca de todo lo que necesitas, con acabados de primera y diseñada para el confort.
                Ideal para quienes buscan calidad de vida y tranquilidad en una zona privilegiada.
                Cuenta con todas las comodidades modernas, espacios amplios y luminosos.
            </p>
        </div>

      </div>

      <!-- Sidebar (Contact Form / Uploader Profile) -->
      <div class="lg:col-span-1 space-y-6 px-4 lg:px-0">
        
        <!-- Uploader Card -->
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 class="text-gray-400 uppercase text-xs font-bold tracking-wider mb-4">Anfitrión</h3>
            <div class="flex items-center gap-4 mb-6">
                <div class="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
                    <User :size="28" />
                </div>
                <div>
                   <h4 class="font-bold text-gray-900 text-lg">{{ property.uploader.name }}</h4>
                   <p class="text-sm text-gray-500 capitalize">{{ property.uploader.type === 'agency' ? 'Agencia Inmobiliaria' : 'Agente Independiente' }}</p>
                </div>
            </div>

             <div class="flex gap-2 mb-6">
                 <div class="flex-1 bg-gray-50 rounded-lg p-3 text-center">
                     <p class="font-bold text-gray-900">98%</p>
                     <p class="text-xs text-gray-500">Respuesta</p>
                 </div>
                 <div class="flex-1 bg-gray-50 rounded-lg p-3 text-center">
                     <p class="font-bold text-gray-900">4.9</p>
                     <p class="text-xs text-gray-500">Calificación</p>
                 </div>
             </div>

            <button class="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                Ver perfil
            </button>
        </div>

        <!-- Action Card -->
        <div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 sticky top-24">
            <div class="flex justify-between items-end mb-6 md:hidden">
               <div>
                  <p class="text-sm text-gray-500">{{ property.type === 'sale' ? 'Precio de Venta' : 'Alquiler Mensual' }}</p>
                  <p class="text-2xl font-bold text-gray-900">${{ property.price.toLocaleString() }}</p>
               </div>
               <div class="flex items-center gap-1 text-sm bg-gray-50 px-2 py-1 rounded">
                   <Star :size="14" class="text-orange-400 fill-orange-400" /> 4.88
               </div>
            </div>

             <h3 class="text-lg font-bold text-gray-900 mb-4 text-center md:text-left">¿Te interesa esta propiedad?</h3>
             <p class="text-sm text-gray-500 mb-6 text-center md:text-left">
                 Contacta al anfitrión para agendar una visita o solicitar más información.
             </p>

            <button disabled class="w-full bg-gray-200 text-gray-400 py-3.5 rounded-xl font-bold cursor-not-allowed flex items-center justify-center gap-2 mb-3">
                Consultar Disponibilidad
            </button>
            <button disabled class="w-full border border-gray-200 text-gray-400 py-3.5 rounded-xl font-bold cursor-not-allowed hover:bg-gray-50">
                Chat con {{ property.uploader.name.split(' ')[0] }}
            </button>
            
            <p class="text-center text-xs text-gray-400 mt-4">
                La funcionalidad de consulta estará disponible próximamente.
            </p>
        </div>

      </div>
    
    </div>
  </div>
</template>
