<script setup>
import { ref } from 'vue';
import { Check, LayoutDashboard, PlusCircle, Sparkles, TrendingUp, User, ArrowRight } from 'lucide-vue-next';
import { useAuth } from '../composables/useAuth';
import { useRouter } from 'vue-router';

const { isGuest, currentUser } = useAuth();
const router = useRouter();

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
  <div class="pt-20 pb-24 px-4 min-h-screen bg-gray-50">
    <div v-if="isGuest">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Publica tu Propiedad</h1>
        <p class="text-gray-500 text-sm">Elige el plan que mejor se adapte a tus necesidades</p>
      </div>

      <!-- Login Warning for Guests -->
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
        <button @click="goToProfile" class="px-4 py-2 bg-rose-500 text-white rounded-xl text-sm font-bold shadow-sm shadow-rose-200">
          Perfil
        </button>
      </div>

      <div class="space-y-6">
        <div v-for="plan in plans" :key="plan.name" 
          class="rounded-3xl p-6 shadow-sm border border-gray-100 relative overflow-hidden transition-transform hover:scale-[1.02]"
          :class="[plan.popular ? 'ring-2 ring-rose-500' : 'bg-white']"
        >
          <div v-if="plan.popular" class="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
            Más Popular
          </div>

          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="font-bold text-lg text-gray-900">{{ plan.name }}</h3>
              <div class="flex items-baseline mt-1">
                <span class="text-3xl font-extrabold tracking-tight" :class="plan.name === 'Enterprise' ? 'text-amber-500' : 'text-gray-900'">${{ plan.price }}</span>
                <span class="text-sm font-medium text-gray-500 ml-1">/mes</span>
              </div>
            </div>
          </div>

          <ul class="space-y-3 mb-6">
            <li v-for="feature in plan.features" :key="feature" class="flex items-start">
              <Check :size="18" class="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span class="text-sm text-gray-600">{{ feature }}</span>
            </li>
          </ul>

          <button 
            @click="goToProfile"
            class="w-full py-3 px-4 rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-xl hover:opacity-90 active:scale-95"
            :class="plan.color"
          >
            {{ plan.buttonText }}
          </button>
        </div>
      </div>
      
      <div class="mt-8 text-center bg-white p-6 rounded-2xl shadow-sm">
        <h3 class="font-bold text-gray-900 mb-2">Mis Propiedades</h3>
        <p class="text-gray-500 text-sm mb-4">Has publicado 0 propiedades</p>
        <button @click="goToProfile" class="text-rose-500 text-sm font-medium hover:underline">Iniciar Sesión para ver más</button>
      </div>
    </div>

    <!-- Logged In Dashboard -->
    <div v-else class="space-y-6">
      <div class="flex justify-between items-end mb-2">
         <div>
            <h1 class="text-3xl font-bold text-gray-900">Hola, {{ currentUser.name.split(' ')[0] }}</h1>
            <p class="text-sm text-gray-500">Gestiona tu presencia inmobiliaria</p>
         </div>
         <button class="p-2 bg-gray-100 rounded-full text-gray-600">
            <LayoutDashboard :size="20" />
         </button>
      </div>

      <!-- Current Plan Card -->
      <div class="bg-gradient-to-br from-gray-900 to-slate-800 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
         <div class="absolute -right-6 -bottom-6 opacity-10">
            <Sparkles :size="120" />
         </div>
         
         <div class="flex justify-between items-start mb-8">
            <div>
               <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Plan Actual</p>
               <h3 class="text-2xl font-bold tracking-tight">Gratuito / Básico</h3>
            </div>
            <div class="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-white/20">
               Activo
            </div>
         </div>

         <div class="space-y-4">
            <div>
               <div class="flex justify-between text-xs font-bold mb-2">
                  <span class="text-slate-400 uppercase">Cupos de Propiedades</span>
                  <span class="text-white">1 / 2</span>
               </div>
               <div class="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div class="w-1/2 h-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]"></div>
               </div>
            </div>

            <div class="pt-4 flex gap-4">
               <div class="flex-1 bg-white/5 rounded-2xl p-3 border border-white/5">
                  <p class="text-xs text-slate-400 mb-1">Visitas</p>
                  <p class="text-lg font-bold">124</p>
               </div>
               <div class="flex-1 bg-white/5 rounded-2xl p-3 border border-white/5">
                  <p class="text-xs text-slate-400 mb-1">Favoritos</p>
                  <p class="text-lg font-bold">12</p>
               </div>
            </div>
         </div>
      </div>

      <!-- Professional Features Section -->
      <div class="grid grid-cols-2 gap-4">
         <div class="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-3">
            <div class="w-10 h-10 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
               <TrendingUp :size="20" />
            </div>
            <p class="text-xs font-bold text-gray-900 leading-tight">Estadísticas Detalladas</p>
            <p class="text-[10px] text-gray-400">Próximamente disponible</p>
         </div>
         <div class="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-3">
            <div class="w-10 h-10 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center">
               <PlusCircle :size="20" />
            </div>
            <p class="text-xs font-bold text-gray-900 leading-tight">Publicar Nueva</p>
            <p class="text-[10px] text-gray-400">Usa tus cupos restantes</p>
         </div>
      </div>

      <!-- Upgrade Banner -->
      <div class="bg-white p-6 rounded-3xl border-2 border-dashed border-rose-200 flex flex-col items-center text-center">
         <div class="w-12 h-12 bg-rose-100 text-rose-500 rounded-2xl flex items-center justify-center mb-4">
            <Sparkles :size="24" />
         </div>
         <h4 class="font-bold text-gray-900 mb-2">Sube al nivel Profesional</h4>
         <p class="text-xs text-gray-500 mb-4 px-4">
            Desbloquea hasta 10 propiedades, estadísticas avanzadas y perfil verificado.
         </p>
         <button @click="router.push('/membership')" class="w-full bg-rose-500 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-rose-100 flex items-center justify-center gap-2 group">
            Mejorar Plan <ArrowRight :size="16" class="transition-transform group-hover:translate-x-1" />
         </button>
      </div>

    </div>
  </div>
</template>
