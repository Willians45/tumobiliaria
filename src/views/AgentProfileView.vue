<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowLeft, Star, MapPin, CreditCard, CheckCircle2, User } from 'lucide-vue-next';
import propertiesData from '../assets/properties.json';
import PropertyCardList from '../components/PropertyCardList.vue';
import { useAuth } from '../composables/useAuth';

const route = useRoute();
const useRouterInstance = useRouter();
const agentName = ref(route.params.name);
const agentInfo = ref(null);
const agentProperties = computed(() => {
    return propertiesData.filter(p => p.uploader.name === agentName.value);
});

const { isGuest } = useAuth();
const userRating = ref(0);
const hoverRating = ref(0);

const handleRate = (rating) => {
  if (isGuest.value) {
    alert('Debes iniciar sesión para puntuar a este agente.');
    return;
  }
  userRating.value = rating;
};

onMounted(() => {
    window.scrollTo(0, 0);
    // Find proper uploader info from any of their properties
    const prop = propertiesData.find(p => p.uploader.name === agentName.value);
    if (prop) {
        agentInfo.value = prop.uploader;
    }
});

const goBack = () => {
    useRouterInstance.back();
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 pb-20 pt-4" v-if="agentInfo">
    <!-- Header Navigation -->
    <div class="px-4 py-4 flex items-center gap-4 sticky top-0 bg-gray-50/80 backdrop-blur-md z-30">
        <button @click="goBack" class="bg-white p-2 rounded-full shadow-md text-gray-700 hover:scale-110 transition-all flex items-center justify-center">
            <ArrowLeft :size="24" />
        </button>
        <h1 class="text-xl font-bold text-[#1e293b]">Perfil de Usuario</h1>
    </div>

    <div class="max-w-4xl mx-auto px-4 space-y-6">
        <!-- Agent Card -->
        <div class="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
            <div class="flex items-center gap-5 mb-8">
                <div class="w-24 h-24 bg-gray-100 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
                    <img v-if="agentInfo.image" :src="agentInfo.image" class="w-full h-full object-cover" />
                    <div v-else class="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                        <User :size="40" />
                    </div>
                </div>
                <div>
                    <h2 class="text-2xl font-bold text-[#1e293b]">{{ agentInfo.name }}</h2>
                    <p class="text-gray-500 capitalize">{{ agentInfo.type === 'agency' ? 'Broker' : 'Agente Inmobiliario' }}</p>
                    <div class="flex items-center gap-1 mt-1">
                        <Star :size="16" class="text-orange-400 fill-orange-400" />
                        <span class="font-bold text-gray-800">4.8</span>
                        <span class="text-gray-400 text-sm">(0 reseñas)</span>
                    </div>
                </div>
            </div>

            <!-- Stats Grid -->
            <div class="grid grid-cols-3 gap-2 mb-8 bg-gray-50/50 p-4 rounded-2xl">
                <div class="text-center">
                    <span class="block text-2xl font-bold text-orange-500">{{ agentProperties.length }}</span>
                    <span class="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Propiedades</span>
                </div>
                <div class="text-center border-x border-gray-100 px-2">
                    <span class="block text-2xl font-bold text-orange-500">4.8</span>
                    <span class="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Calificación</span>
                </div>
                <div class="text-center">
                    <span class="block text-2xl font-bold text-orange-500">0</span>
                    <span class="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Reseñas</span>
                </div>
            </div>

            <!-- Simple Info -->
            <div class="space-y-3">
                <div class="flex items-center gap-3 text-gray-500">
                    <MapPin :size="18" />
                    <span class="text-sm font-medium">Caracas</span>
                </div>
                <div class="flex items-center gap-3 text-gray-500">
                    <CreditCard :size="18" />
                    <span class="text-sm font-medium">Código Agencia: 1234</span>
                </div>
            </div>
        </div>

        <!-- Properties Section -->
        <div>
            <h3 class="text-xl font-bold text-[#1e293b] mb-4">Propiedades de {{ agentInfo.name }}</h3>
            <div class="space-y-4">
                <PropertyCardList v-for="prop in agentProperties" :key="prop.id" :property="prop" />
            </div>
        </div>

        <!-- Rating Section -->
        <div class="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 text-center">
            <h3 class="text-lg font-bold text-[#1e293b] mb-1">¡Califícanos!</h3>
            <p class="text-sm text-gray-500 mb-6">¿Cómo fue tu experiencia con {{ agentInfo.name }}?</p>
            
            <div class="flex justify-center gap-3 mb-6">
                <button 
                  v-for="star in 5" 
                  :key="star"
                  @click="handleRate(star)"
                  @mouseenter="hoverRating = star"
                  @mouseleave="hoverRating = 0"
                  class="transition-transform active:scale-90"
                >
                  <Star 
                    :size="36" 
                    :stroke-width="1.5"
                    :class="[(hoverRating || userRating) >= star ? 'text-orange-400 fill-orange-400' : 'text-gray-200']"
                  />
                </button>
            </div>

            <div v-if="userRating > 0" class="flex items-center justify-center gap-2 text-green-600 font-bold animate-in fade-in zoom-in duration-300">
                <CheckCircle2 :size="20" />
                <span>Gracias por tu calificación de {{ userRating }} estrellas</span>
            </div>
        </div>
    </div>
  </div>
</template>

<style scoped>
/* Mocking the user's specific text color from screenshot */
h1, h2, h3 {
    color: #1e293b;
}
</style>
