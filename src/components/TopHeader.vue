<script setup>
import { Bell, Search } from 'lucide-vue-next';
</script>

<template>
  <header class="fixed top-0 left-0 w-full bg-white z-40 px-4 py-3 shadow-sm flex items-center justify-between gap-4">
    <!-- Logo -->
    <div class="flex-shrink-0">
      <div class="h-8 w-8 bg-rose-500 rounded-lg flex items-center justify-center">
        <span class="text-white font-bold text-lg">T</span>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="flex-1 relative">
      <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <Search :size="16" class="text-gray-400" />
      </div>
      <input 
        type="text" 
        placeholder="Buscar propiedades..." 
        class="w-full bg-gray-100 text-sm rounded-full py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-rose-500/20 transition-all font-medium text-gray-700 placeholder-gray-400 shadow-sm"
      >
      <!-- Filters Mockup -->
      <div class="absolute inset-y-0 right-1 flex items-center">
        <button class="p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-50 border border-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-600"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
        </button>
      </div>
    </div>

    <!-- Notifications -->
    <button class="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
      <Bell :size="22" stroke-width="2" class="text-gray-600" />
      <span class="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
    </button>
  </header>
</template>
