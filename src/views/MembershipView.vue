<script setup>
import { useRouter } from 'vue-router';
import { ArrowLeft, Check, Sparkles, ShieldCheck, Zap, Globe } from 'lucide-vue-next';

const router = useRouter();

const goBack = () => {
  router.back();
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
    buttonText: "Plan Actual",
    popular: false,
    color: "bg-gray-100 text-gray-500 cursor-default",
    disabled: true
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
    buttonText: "Mejorar a Agente",
    popular: true,
    color: "bg-rose-500 text-white shadow-lg shadow-rose-200"
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
    buttonText: "Mejorar a Agencia",
    popular: false,
    color: "bg-slate-800 text-white shadow-lg shadow-slate-200"
  },
  {
    name: "Enterprise",
    price: "50+",
    features: [
      "Publicar hasta 40 propiedades",
      "4 Subcuentas para agentes",
      "20 videos por propiedad",
      "Gestor de cuenta dedicado"
    ],
    buttonText: "Contactar Ventas",
    popular: false,
    color: "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-200"
  }
];
</script>

<template>
  <div class="pt-6 pb-24 px-4 min-h-screen bg-white">
    <!-- Header -->
    <div class="flex items-center gap-4 mb-10">
      <button @click="goBack" class="p-2 bg-gray-50 rounded-full text-gray-700 hover:bg-gray-100 transition-all">
        <ArrowLeft :size="24" />
      </button>
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Membresías</h1>
        <p class="text-sm text-gray-500 italic">Impulsa tu negocio inmobiliario</p>
      </div>
    </div>

    <!-- Intro Card -->
    <div class="bg-rose-50 rounded-3xl p-6 mb-10 relative overflow-hidden">
        <div class="absolute -right-4 -top-4 opacity-10">
            <Zap :size="100" />
        </div>
        <div class="relative z-10">
            <h2 class="text-xl font-bold text-rose-900 mb-2 flex items-center gap-2">
                <Sparkles :size="20" /> Planes de Impacto
            </h2>
            <p class="text-sm text-rose-700 leading-relaxed">
                Obtén más visibilidad, sube más propiedades y profesionaliza tu perfil para cerrar ventas más rápido.
            </p>
        </div>
    </div>

    <!-- Plans Section -->
    <div class="space-y-6">
      <div v-for="plan in plans" :key="plan.name" 
        class="rounded-3xl p-7 shadow-sm border border-gray-100 relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-rose-100"
        :class="[plan.popular ? 'ring-2 ring-rose-500 bg-white' : 'bg-white']"
      >
        <div v-if="plan.popular" class="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-bold px-4 py-1.5 rounded-bl-2xl uppercase tracking-widest animate-pulse">
          Sugerido
        </div>

        <div class="flex justify-between items-start mb-6">
          <div>
            <h3 class="font-bold text-xl text-gray-900 tracking-tight">{{ plan.name }}</h3>
            <div class="flex items-baseline mt-2">
              <span class="text-4xl font-black tracking-tighter text-gray-900">${{ plan.price }}</span>
              <span class="text-sm font-bold text-gray-400 ml-1.5 uppercase tracking-widest">/mes</span>
            </div>
          </div>
          <div v-if="plan.name === 'Agente'" class="text-rose-500">
             <ShieldCheck :size="32" stroke-width="1.5" />
          </div>
          <div v-if="plan.name === 'Agencia'" class="text-slate-800">
             <Globe :size="32" stroke-width="1.5" />
          </div>
        </div>

        <div class="w-full h-px bg-gray-50 mb-6"></div>

        <ul class="space-y-4 mb-8">
          <li v-for="feature in plan.features" :key="feature" class="flex items-start gap-3">
            <div class="mt-0.5 p-0.5 bg-green-50 text-green-600 rounded-full">
                <Check :size="14" stroke-width="3" />
            </div>
            <span class="text-sm font-medium text-gray-600">{{ feature }}</span>
          </li>
        </ul>

        <button 
          :disabled="plan.disabled"
          class="w-full py-4 px-6 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95"
          :class="plan.color"
        >
          {{ plan.buttonText }}
        </button>
      </div>

      <!-- Trust Badge -->
      <div class="mt-12 py-8 bg-gray-50 rounded-3xl flex flex-col items-center text-center px-6">
          <ShieldCheck :size="40" class="text-gray-400 mb-4" />
          <p class="text-sm font-bold text-gray-900 mb-1">Pagos 100% Seguros</p>
          <p class="text-xs text-gray-500">Cancela o cambia de plan en cualquier momento desde tu panel.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .8; }
}
</style>
