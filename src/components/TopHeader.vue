<script setup>
import { Search } from 'lucide-vue-next';
</script>

<template>
  <header class="fixed top-0 left-0 w-full bg-white z-40 px-6 pt-4 pb-4 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] transition-all duration-300">
    <!-- Main Search Bar Area -->
    <div class="bg-white rounded-full shadow-[0_3px_12px_rgba(0,0,0,0.08)] border border-gray-100 py-2.5 px-4 flex items-center gap-4 active:scale-[0.98] transition-transform duration-100">
      <div class="flex-shrink-0 text-brand">
        <Search :size="20" stroke-width="2.5" class="text-rose-500" />
      </div>
      
      <div class="flex-1 flex flex-col justify-center">
        <span class="text-sm font-bold text-gray-900 leading-none">¿A dónde quieres ir?</span>
        <span class="text-[11px] text-gray-500 leading-none mt-1">Cualquier lugar · Cualquier semana</span>
      </div>

      <div class="p-2 bg-white rounded-full border border-gray-200">
         <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-gray-900"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
      </div>
    </div>
  </header>
</template>
