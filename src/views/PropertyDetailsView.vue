<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { MapPin, Bed, Bath, Square, User, Car, Warehouse, ArrowLeft, Star, Heart, CheckCircle2, Share2, ChevronLeft, ChevronRight, X, LogIn } from 'lucide-vue-next';
import propertiesData from '../assets/properties.json';
import { useFavorites } from '../composables/useFavorites';
import { useAuth } from '../composables/useAuth';
import { usePropertyStorage } from '../composables/usePropertyStorage';

const route = useRoute();
const router = useRouter();
const property = ref(null);
const currentImageIndex = ref(0);
const { toggleFavorite, isFavorite } = useFavorites();
const { currentUser, isGuest, loginAsTestUser } = useAuth();
const { userProperties } = usePropertyStorage();

const userRating = ref(0);
const hoverRating = ref(0);

const handleRate = (rating) => {
  if (isGuest.value) {
    alert('Debes iniciar sesión para puntuar esta propiedad.');
    return;
  }
  userRating.value = rating;
};

// Computed property to use the real images
const propertyImages = computed(() => {
  if (!property.value) return [];
  return property.value.images || [property.value.image];
});

onMounted(() => {
  window.scrollTo(0, 0); // Scroll to top
  const id = route.params.id; // Keep as string to match both types
  
  // Try to find in user properties first
  let found = userProperties.value.find(p => String(p.id) === String(id));
  
  // If not found, look in default static data
  if (!found) {
    found = propertiesData.find(p => String(p.id) === String(id));
  }
  
  property.value = found;
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
const showGallery = ref(false);
const touchStart = ref(0);
const dragOffset = ref(0);
const isDragging = ref(false);
const containerWidth = ref(0);

const handleTouchStart = (e) => {
  touchStart.value = e.touches[0].clientX;
  isDragging.value = true;
  containerWidth.value = e.currentTarget.offsetWidth;
};

const handleTouchMove = (e) => {
  if (!isDragging.value) return;
  const currentX = e.touches[0].clientX;
  dragOffset.value = currentX - touchStart.value;
};

const handleTouchEnd = () => {
  if (!isDragging.value) return;
  isDragging.value = false;
  
  const threshold = containerWidth.value * 0.2;
  
  if (dragOffset.value < -threshold) {
    nextImage();
  } else if (dragOffset.value > threshold) {
    prevImage();
  }
  
  dragOffset.value = 0;
};

const shareProperty = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: property.value.title,
        text: `Mira esta propiedad: ${property.value.title}`,
        url: window.location.href,
      });
    } catch (err) {
      console.log('Error sharing:', err);
    }
  } else {
    await navigator.clipboard.writeText(window.location.href);
    alert('Enlace copiado!');
  }
};
</script>

<template>
  <div v-if="property" class="pt-0 pb-24 min-h-screen bg-gray-50">
    <!-- Navbar Mobile (Sticky) -->
    <div class="flex md:hidden sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 justify-between items-center transition-all">
       <button @click="goBack" class="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-700">
          <ArrowLeft :size="20" />
       </button>
       <span class="font-bold text-gray-900 truncate max-w-[200px]">{{ property.title }}</span>
       <button @click="shareProperty" class="p-2 -mr-2 rounded-full hover:bg-gray-100 text-gray-700">
          <Share2 :size="20" />
       </button>
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
          <!-- Slider Container -->
          <div 
            class="flex h-full cursor-pointer" 
            :class="{ 'transition-transform duration-500 ease-out': !isDragging }"
            :style="{ transform: `translateX(calc(-${currentImageIndex * 100}% + ${dragOffset}px))` }"
            @click="showGallery = true"
            @touchstart="handleTouchStart" 
            @touchmove="handleTouchMove"
            @touchend="handleTouchEnd"
          >
            <div v-for="(img, idx) in propertyImages" :key="idx" class="w-full h-full flex-shrink-0">
              <img :src="img" :alt="property.title" class="w-full h-full object-cover" />
            </div>
          </div>
          
          <!-- Back Button Overlay (Desktop Only - Mobile has sticky navbar) -->
          <button @click="goBack" class="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md p-2 rounded-full shadow-md text-gray-700 hover:bg-white hover:scale-110 transition-all hidden md:block">
             <ArrowLeft :size="24" />
          </button>

          <!-- Image Controls (Visible always on mobile, hover on desktop) -->
          <div class="absolute inset-0 hidden md:flex items-center justify-between p-4 pointer-events-none" v-if="propertyImages.length > 1">
               <button @click.stop="prevImage" class="pointer-events-auto bg-white/80 backdrop-blur hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-transform hover:scale-110 opacity-0 group-hover:opacity-100 transition-opacity">
                   <ChevronLeft :size="24" />
               </button>
               <button @click.stop="nextImage" class="pointer-events-auto bg-white/80 backdrop-blur hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-transform hover:scale-110 opacity-0 group-hover:opacity-100 transition-opacity">
                   <ChevronRight :size="24" />
               </button>
          </div>
          
          <!-- Image Dots -->
          <div class="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10 px-4" v-if="propertyImages.length > 1">
              <span v-for="(img, idx) in propertyImages" :key="idx" 
                class="w-2 h-2 rounded-full transition-all shadow-sm cursor-pointer"
                @click.stop="currentImageIndex = idx"
                :class="idx === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50'">
              </span>
          </div>

          <div class="absolute top-4 right-4 hidden md:flex gap-2">
             <button @click="shareProperty" class="bg-white/90 backdrop-blur hover:bg-white text-gray-700 px-4 py-2 rounded-full text-sm font-semibold shadow-sm transition-all flex items-center gap-2">
                <Share2 :size="16" /> Compartir
             </button>
              <button v-if="isGuest || (!userProperties.some(p => String(p.id) === String(property.id)) && !(property.uploader?.name === currentUser?.name))" @click="toggleFavorite(property.id)" class="bg-white/90 backdrop-blur hover:bg-white text-gray-700 px-4 py-2 rounded-full text-sm font-semibold shadow-sm transition-all flex items-center gap-2" :class="{ 'text-red-500': isFavorite(property.id) }">
                <Heart :size="16" :class="{ 'fill-current': isFavorite(property.id) }" /> Guardar
              </button>
          </div>
        </div>
        
        <!-- Mobile Property Info (Moved out of image) -->
        <div class="px-5 md:hidden">
            <div class="flex justify-between items-start mb-2">
              <h1 class="text-gray-900 text-2xl font-bold leading-tight">{{ property.title }}</h1>
              <div class="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded mt-1 shrink-0">
                  <Star :size="14" class="text-orange-400 fill-orange-400" /> 
                  <span class="text-sm font-bold">4.88</span>
              </div>
            </div>
            <p class="text-gray-500 text-sm flex items-center gap-1">
              <MapPin :size="14"/> {{ property.location.city || property.address }}
            </p>
        </div>
        
        <!-- Mobile Action Buttons (Inline) -->
        <div class="flex gap-4 px-4 md:hidden">
            <button @click="shareProperty" class="flex-1 bg-white border border-gray-200 text-gray-700 py-2.5 rounded-xl font-medium shadow-sm flex items-center justify-center gap-2">
                <Share2 :size="18" /> Compartir
            </button>
            <button v-if="isGuest || (!userProperties.some(p => String(p.id) === String(property.id)) && !(property.uploader?.name === currentUser?.name))" @click="toggleFavorite(property.id)" class="flex-1 bg-white border border-gray-200 text-gray-700 py-2.5 rounded-xl font-medium shadow-sm flex items-center justify-center gap-2" :class="{ 'text-red-600 border-red-100 bg-red-50': isFavorite(property.id) }">
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
            <p class="text-gray-600 leading-relaxed text-sm md:text-base whitespace-pre-wrap">
                {{ property.description || 'Disfruta de una experiencia única en esta propiedad exclusiva. Perfectamente ubicada cerca de todo lo que necesitas, con acabados de primera y diseñada para el confort. Ideal para quienes buscan calidad de vida y tranquilidad en una zona privilegiada.' }}
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

            <router-link 
                :to="{ name: 'agent-profile', params: { name: property.uploader.name } }"
                class="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
                Ver perfil
            </router-link>
        </div>

        <!-- Rating Card -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
             <h3 class="text-lg font-bold text-gray-900 mb-1 text-center md:text-left">Puntúa esta propiedad</h3>
             <p class="text-sm text-gray-500 mb-4 text-center md:text-left">Tu opinión ayuda a otros usuarios.</p>
             
             <div class="flex justify-center md:justify-start gap-2 mb-4">
                 <button 
                    v-for="star in 5" 
                    :key="star"
                    @click="handleRate(star)"
                    @mouseenter="hoverRating = star"
                    @mouseleave="hoverRating = 0"
                    class="transition-all duration-200"
                    :class="{ 'scale-110': hoverRating >= star }"
                 >
                    <Star 
                        :size="32" 
                        :class="[
                            (hoverRating || userRating) >= star 
                            ? 'text-orange-400 fill-orange-400' 
                            : 'text-gray-200'
                        ]" 
                        stroke-width="1.5"
                    />
                 </button>
             </div>

             <div v-if="isGuest" class="bg-rose-50 border border-rose-100 rounded-xl p-4">
                 <p class="text-xs text-rose-700 font-medium">Debes iniciar sesión para poder puntuar esta propiedad.</p>
             </div>
             <div v-else class="text-center md:text-left">
                  <p class="text-sm font-medium text-green-600 flex items-center justify-center md:justify-start gap-2">
                      <CheckCircle2 :size="16" /> ¡Sesión iniciada como {{ currentUser.name }}!
                  </p>
                  <p v-if="userRating > 0" class="text-xs text-gray-500 mt-2">Gracias por puntuar con {{ userRating }} estrellas.</p>
             </div>
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

            <button disabled class="w-full bg-gray-200 text-gray-400 py-3.5 rounded-xl font-bold cursor-not-allowed flex items-center justify-center gap-2">
                Consultar Disponibilidad
            </button>
            
            <p class="text-center text-xs text-gray-400 mt-4">
                La funcionalidad de consulta estará disponible próximamente.
            </p>
        </div>

      </div>
    
    </div>

    <!-- Gallery Modal -->
    <div v-if="showGallery" class="fixed inset-0 z-50 bg-black flex items-center justify-center backdrop-blur-xl" @click="showGallery = false">
        <button @click="showGallery = false" class="absolute top-4 right-4 z-50 p-2 bg-black/50 text-white rounded-full hover:bg-white/20 transition-colors">
            <X :size="32" />
        </button>
        
        <div class="relative w-full h-full max-w-7xl mx-auto flex items-center justify-center p-4 overflow-hidden">
            <!-- Fullscreen Slider Container -->
            <div 
              class="flex h-full w-full cursor-pointer" 
              :class="{ 'transition-transform duration-500 ease-out': !isDragging }"
              :style="{ transform: `translateX(calc(-${currentImageIndex * 100}% + ${dragOffset}px))` }"
              @touchstart="handleTouchStart" 
              @touchmove="handleTouchMove"
              @touchend="handleTouchEnd"
              @click.stop
            >
              <div v-for="(img, idx) in propertyImages" :key="idx" class="w-full h-full flex-shrink-0 flex items-center justify-center p-4">
                <img :src="img" class="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl" @click.stop />
              </div>
            </div>
            
            <button @click.stop="prevImage" class="absolute left-4 p-3 bg-white/10 text-white rounded-full hover:bg-white/20 backdrop-blur-md transition-all">
                <ChevronLeft :size="32" />
            </button>
            
            <button @click.stop="nextImage" class="absolute right-4 p-3 bg-white/10 text-white rounded-full hover:bg-white/20 backdrop-blur-md transition-all">
                <ChevronRight :size="32" />
            </button>

            <div class="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
                 <span v-for="(img, idx) in propertyImages" :key="idx" 
                    class="w-2 h-2 rounded-full transition-all cursor-pointer"
                    @click.stop="currentImageIndex = idx"
                    :class="idx === currentImageIndex ? 'bg-white scale-125' : 'bg-white/30'">
                  </span>
            </div>
        </div>
    </div>
  </div>
</template>
