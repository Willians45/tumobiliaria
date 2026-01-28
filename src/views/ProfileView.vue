<script setup>
import { ref } from 'vue';
import { User, Mail, Lock, LogIn } from 'lucide-vue-next';

const isLogin = ref(true);
</script>

<template>
  <div class="pt-20 pb-24 px-4 min-h-screen bg-gray-50">
    <!-- Profile Header -->
    <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6 text-center">
      <div class="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <User :size="40" class="text-rose-500" />
      </div>
      <h2 class="text-xl font-bold text-gray-900">Invitado</h2>
      <p class="text-gray-500 text-sm mb-4">Regístrate para publicar propiedades</p>
      
      <div class="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
        <div>
          <span class="block font-bold text-xl text-gray-900">0</span>
          <span class="text-xs text-gray-400 uppercase tracking-wide">Propiedades</span>
        </div>
        <div>
          <span class="block font-bold text-xl text-gray-900">0</span>
          <span class="text-xs text-gray-400 uppercase tracking-wide">Vistas</span>
        </div>
      </div>
    </div>

    <!-- Auth Forms -->
    <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
      <div class="flex mb-6 bg-gray-100 rounded-lg p-1">
        <button 
          @click="isLogin = true"
          class="flex-1 py-2 text-sm font-bold rounded-md transition-all"
          :class="isLogin ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'"
        >Inciar Sesión</button>
        <button 
          @click="isLogin = false"
          class="flex-1 py-2 text-sm font-bold rounded-md transition-all"
          :class="!isLogin ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'"
        >Registrarse</button>
      </div>

      <form @submit.prevent class="space-y-4">
        <div v-if="!isLogin">
          <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Nombre Completo</label>
          <div class="relative">
            <User :size="18" class="absolute left-3 top-3 text-gray-400" />
            <input type="text" class="w-full bg-gray-50 rounded-xl py-2.5 pl-10 pr-4 text-sm border-none focus:ring-2 focus:ring-rose-500" placeholder="Juan Pérez">
          </div>
        </div>
        
        <div>
          <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Correo Electrónico</label>
          <div class="relative">
            <Mail :size="18" class="absolute left-3 top-3 text-gray-400" />
            <input type="email" class="w-full bg-gray-50 rounded-xl py-2.5 pl-10 pr-4 text-sm border-none focus:ring-2 focus:ring-rose-500" placeholder="correo@ejemplo.com">
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Contraseña</label>
          <div class="relative">
            <Lock :size="18" class="absolute left-3 top-3 text-gray-400" />
            <input type="password" class="w-full bg-gray-50 rounded-xl py-2.5 pl-10 pr-4 text-sm border-none focus:ring-2 focus:ring-rose-500" placeholder="••••••••">
          </div>
        </div>

        <button class="w-full bg-rose-500 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-rose-600 transition-colors mt-2">
          {{ isLogin ? 'Ingresar' : 'Crear Cuenta' }}
        </button>
      </form>

      <div class="relative my-6">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-100"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-white text-gray-500 text-xs">O continúa con</span>
        </div>
      </div>

      <button class="w-full bg-white border border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
        <svg class="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
        Google
      </button>
    </div>
  </div>
</template>
