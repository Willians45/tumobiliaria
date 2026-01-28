<script setup>
import { Check } from 'lucide-vue-next';

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
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Publica tu Propiedad</h1>
      <p class="text-gray-500 text-sm">Elige el plan que mejor se adapte a tus necesidades</p>
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
      <button class="text-rose-500 text-sm font-medium hover:underline">Iniciar Sesión para ver más</button>
    </div>
  </div>
</template>
