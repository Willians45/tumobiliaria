<script setup>
import { ref, reactive, computed } from 'vue';
import { Check, LayoutDashboard, PlusCircle, Sparkles, TrendingUp, User, ArrowRight, X, ArrowLeft, Trash2, ExternalLink, Image as LucideImage } from 'lucide-vue-next';
import { useAuth } from '../composables/useAuth';
import { useRouter } from 'vue-router';
import { usePropertyStorage } from '../composables/usePropertyStorage';

// Step Components
import Step1Basic from '../components/PropertyUpload/Step1Basic.vue';
import Step2Location from '../components/PropertyUpload/Step2Location.vue';
import Step3Details from '../components/PropertyUpload/Step3Details.vue';
import Step4Multimedia from '../components/PropertyUpload/Step4Multimedia.vue';

const { isGuest, currentUser } = useAuth();
const router = useRouter();
const { userProperties, saveProperty, isLoading: isSaving } = usePropertyStorage();
const deleteProperty = async (id) => {
  if (window.confirm('¿Estás seguro de que quieres eliminar esta propiedad? Esta acción no se puede deshacer.')) {
     await usePropertyStorage().deleteProperty(id);
  }
};
const isPublishing = ref(false);
const currentStep = ref(1);

const initialFormData = {
  title: '',
  price: 0,
  type: 'sale',
  category: '',
  description: '',
  address: '',
  location: null,
  features: {
    bedrooms: 0,
    bathrooms: 0,
    area: 0,
    parking: false,
    amenities: []
  },
  images: []
};

const newPropertyData = ref({ ...JSON.parse(JSON.stringify(initialFormData)) });

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const scrollToProperties = () => {
  const el = document.getElementById('my-properties');
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const startPublishing = () => {
  isPublishing.value = true;
  currentStep.value = 1;
  newPropertyData.value = JSON.parse(JSON.stringify(initialFormData));
  scrollToTop();
};

const cancelPublishing = () => {
  if (window.confirm('¿Estás seguro de que quieres cancelar? Perderás todo el progreso de este anuncio.')) {
    isPublishing.value = false;
    scrollToTop();
  }
};

const nextStep = () => {
  if (currentStep.value < 4) {
    currentStep.value++;
    scrollToTop();
  }
};

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
    scrollToTop();
  }
};

const handleFinishPublishing = async () => {
  try {
    await saveProperty({
      ...newPropertyData.value,
      uploader: {
        name: currentUser.value ? currentUser.value.name : "Invitado",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200", // Placeholder
        type: currentUser.value ? "Agente Certificado" : "Invitado"
      }
    });
    isPublishing.value = false;
  } catch (error) {
    console.error('Error publishing property:', error);
  }
};

const goToProfile = () => {
  router.push('/profile');
};

const plans = [
  {
    name: "Invitado / Gratis",
    price: "0",
    features: [
      "Publicar hasta 2 propiedades",
      "Mensajes directos con clientes",
      "Perfil básico sin marca personal",
      "Soporte vía correo"
    ],
    buttonText: "Continuar Gratis",
    popular: false,
    color: "bg-gray-100 text-gray-900"
  },
  {
    name: "Agente",
    price: "9.99",
    features: [
      "Publicar hasta 10 propiedades",
      "Perfil profesional + Logo",
      "5 videos por propiedad",
      "Estadísticas básicas",
      "Soporte prioritario"
    ],
    buttonText: "Suscribirse",
    popular: true,
    color: "bg-rose-500 text-white"
  },
  {
    name: "Agencia",
    price: "19.99",
    features: [
      "Publicar hasta 25 propiedades",
      "Estadísticas avanzadas",
      "Perfil de Agencia destacado",
      "Todo lo anterior"
    ],
    buttonText: "Suscribirse",
    popular: false,
    color: "bg-slate-800 text-white"
  },
  {
    name: "Enterprise",
    price: "50",
    features: [
      "Publicar hasta 40 propiedades",
      "4 Subcuentas para agentes",
      "20 videos por propiedad",
      "Gestor de cuenta dedicado"
    ],
    buttonText: "Contactar Ventas",
    popular: false,
    color: "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
  }
];
</script>

<template>
  <div class="pt-24 pb-24 px-4 min-h-screen bg-gray-50">
    <!-- View for Guests -->
    <div v-if="isGuest">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Publica tu Propiedad</h1>
        <p class="text-gray-500 text-sm">Elige el plan que mejor se adapte a tus necesidades</p>
      </div>

      <div class="bg-rose-50 border border-rose-100 p-4 rounded-2xl mb-8 flex items-center justify-between">
        <div class="flex items-center gap-3">
           <div class="p-2 bg-rose-500 text-white rounded-full">
              <User :size="18" />
           </div>
           <div>
              <p class="text-sm font-bold text-gray-900">Debes iniciar sesión</p>
              <p class="text-xs text-rose-600">Para poder publicar propiedades Reales</p>
           </div>
        </div>
        <button @click="goToProfile" class="px-4 py-2 bg-rose-500 text-white rounded-xl text-sm font-bold">Perfil</button>
      </div>

      <div class="space-y-6">
        <div v-for="plan in plans" :key="plan.name" 
          class="rounded-3xl p-6 shadow-sm border border-gray-100 relative overflow-hidden bg-white"
          :class="{'ring-2 ring-rose-500': plan.popular}"
        >
          <div v-if="plan.popular" class="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase">Más Popular</div>
          <div class="mb-4">
            <h3 class="font-bold text-lg text-gray-900">{{ plan.name }}</h3>
            <div class="flex items-baseline mt-1">
              <span class="text-3xl font-extrabold tracking-tight">${{ plan.price }}</span>
              <span class="text-sm font-medium text-gray-500 ml-1">/mes</span>
            </div>
          </div>
          <ul class="space-y-3 mb-6">
            <li v-for="feature in plan.features" :key="feature" class="flex items-start">
              <Check :size="18" class="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span class="text-sm text-gray-600">{{ feature }}</span>
            </li>
          </ul>
          <button @click="goToProfile" class="w-full py-3 px-4 rounded-xl font-bold text-sm transition-all shadow-lg" :class="plan.color">{{ plan.buttonText }}</button>
        </div>
      </div>
    </div>

    <!-- Logged In Content -->
    <div v-else class="space-y-6">
      <Transition name="fade-slide" mode="out-in">
        <!-- Publishing Flow -->
        <div v-if="isPublishing" key="publishing" class="space-y-6">
          <div class="flex items-center justify-between mb-8">
            <button @click="cancelPublishing" class="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-all">
              <X :size="20" />
            </button>
            <div class="flex gap-2">
              <div v-for="step in 4" :key="step" class="w-8 h-1.5 rounded-full transition-all duration-300" :class="currentStep >= step ? 'bg-rose-500' : 'bg-gray-200'"></div>
            </div>
            <div class="w-10"></div>
          </div>
          <Step1Basic v-if="currentStep === 1" v-model:formData="newPropertyData" @next="nextStep" />
          <Step2Location v-if="currentStep === 2" v-model:formData="newPropertyData" @next="nextStep" @back="prevStep" />
          <Step3Details v-if="currentStep === 3" v-model:formData="newPropertyData" @next="nextStep" @back="prevStep" />
          <Step4Multimedia v-if="currentStep === 4" v-model:formData="newPropertyData" @finish="handleFinishPublishing" @back="prevStep" />
        </div>

        <!-- Dashboard View -->
        <div v-else key="dashboard" class="space-y-6">
          <div class="flex justify-between items-end mb-2">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">Hola, {{ currentUser?.name?.split(' ')[0] || 'Usuario' }}</h1>
              <p class="text-sm text-gray-500">Gestiona tu presencia inmobiliaria</p>
            </div>
            <button class="p-2 bg-gray-100 rounded-full text-gray-600"><LayoutDashboard :size="20" /></button>
          </div>

          <!-- Current Plan Card -->
          <div class="bg-gradient-to-br from-rose-500 to-purple-600 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div class="absolute -right-6 -bottom-6 opacity-20"><Sparkles :size="120" /></div>
            <div class="flex justify-between items-start mb-8">
              <div>
                <p class="text-xs font-bold text-rose-100 uppercase tracking-widest mb-1">Plan Actual</p>
                <h3 class="text-2xl font-bold tracking-tight">Gratuito / Básico</h3>
              </div>
              <div class="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-white/30">Activo</div>
            </div>
            <div class="space-y-4">
              <div>
                <div class="flex justify-between text-xs font-bold mb-2">
                  <span class="text-rose-100 uppercase">Cupos de Propiedades</span>
                  <span class="text-white">{{ userProperties.length }} / 2</span>
                </div>
                <div class="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                  <div class="h-full bg-white transition-all duration-500" :style="{ width: `${(userProperties.length / 2) * 100}%` }"></div>
                </div>
              </div>
              <div class="pt-4 flex gap-4">
                <div class="flex-1 bg-white/10 rounded-2xl p-3 border border-white/10">
                  <p class="text-xs text-rose-100 mb-1">Visitas Totales</p>
                  <p class="text-lg font-bold">{{ userProperties.length * 12 }}</p>
                </div>
                <div class="flex-1 bg-white/10 rounded-2xl p-3 border border-white/10">
                  <p class="text-xs text-rose-100 mb-1">Favoritos</p>
                  <p class="text-lg font-bold">{{ userProperties.length * 3 }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <button @click="scrollToProperties" class="w-full bg-white border border-gray-200 text-gray-700 font-bold py-3.5 rounded-2xl shadow-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-2 mb-4">
              Gestionar mis propiedades
          </button>

          <!-- My Properties Section -->
          <div id="my-properties" class="space-y-4">
            <div class="flex items-center justify-between px-1">
              <h3 class="text-lg font-bold text-gray-900">Mis Publicaciones</h3>
              <span class="text-xs font-bold text-rose-500 bg-rose-50 px-2 py-1 rounded-lg">{{ userProperties.length }} anuncios</span>
            </div>
            <div v-if="userProperties.length > 0" class="space-y-3">
              <div v-for="prop in userProperties" :key="prop.id" class="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 group cursor-pointer hover:border-rose-100 transition-all" @click="router.push({ name: 'property-details', params: { id: prop.id } })">
                <div class="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                  <img v-if="prop.images?.length" :src="prop.images[0]" class="w-full h-full object-cover" />
                  <div v-else class="w-full h-full flex items-center justify-center text-gray-300"><LucideImage :size="20" /></div>
                </div>
                <div class="flex-1 min-w-0">
                  <h4 class="text-sm font-bold text-gray-900 truncate">{{ prop.title }}</h4>
                  <p class="text-xs font-bold text-rose-500">${{ prop?.price?.toLocaleString() }}</p>
                  <div class="flex items-center gap-2 mt-1">
                    <span class="text-[9px] font-bold uppercase py-0.5 px-1.5 rounded bg-green-50 text-green-600">Publicado</span>
                    <span class="text-[9px] text-gray-400 font-medium">{{ new Date(prop.createdAt).toLocaleDateString() }}</span>
                  </div>
                </div>
                <div class="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button @click.stop="deleteProperty(prop.id)" class="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all" title="Eliminar"><Trash2 :size="18" /></button>
                  <button @click.stop="router.push({ name: 'property-details', params: { id: prop.id } })" class="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all" title="Ver detalles"><ExternalLink :size="18" /></button>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-12 bg-white rounded-3xl border-2 border-dashed border-gray-100">
              <div class="w-12 h-12 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-3"><LucideImage :size="24" /></div>
              <p class="text-sm font-bold text-gray-400">Aún no tienes publicaciones</p>
              <p class="text-xs text-gray-400 mt-1">¡Sube tu primera propiedad hoy!</p>
            </div>
          </div>

          <!-- Professional Features Section -->
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-3">
              <div class="w-10 h-10 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center"><TrendingUp :size="20" /></div>
              <p class="text-xs font-bold text-gray-900 leading-tight">Estadísticas Detalladas</p>
              <p class="text-[10px] text-gray-400">Próximamente disponible</p>
            </div>
            <button @click="startPublishing" :disabled="userProperties.length >= 2" class="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-3 text-left hover:border-rose-200 transition-all active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed">
              <div class="w-10 h-10 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-all"><PlusCircle :size="20" /></div>
              <p class="text-xs font-bold text-gray-900 leading-tight">Publicar Nueva</p>
              <p v-if="userProperties.length < 2" class="text-[10px] text-gray-400">Usa tus cupos restantes</p>
              <p v-else class="text-[10px] text-rose-500 font-bold tracking-tight">Límite alcanzado</p>
            </button>
          </div>

          <!-- Upgrade Banner -->
          <div class="bg-white p-6 rounded-3xl border-2 border-dashed border-rose-200 flex flex-col items-center text-center">
            <div class="w-12 h-12 bg-rose-100 text-rose-500 rounded-2xl flex items-center justify-center mb-4"><Sparkles :size="24" /></div>
            <h4 class="font-bold text-gray-900 mb-2">Sube al nivel Profesional</h4>
            <p class="text-xs text-gray-500 mb-4 px-4">Desbloquea hasta 10 propiedades, estadísticas avanzadas y perfil verificado.</p>
            <button @click="router.push('/membership')" class="w-full bg-rose-500 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-rose-100 flex items-center justify-center gap-2 group">
              Mejorar Plan <ArrowRight :size="16" class="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
