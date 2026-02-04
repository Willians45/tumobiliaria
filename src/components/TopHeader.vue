<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Search, Bell, SlidersHorizontal } from 'lucide-vue-next';
import { useAuth } from '../composables/useAuth';

const router = useRouter();
const searchQuery = ref('');
const { currentUser, isGuest, loginAsTestUser, logout } = useAuth();

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ name: 'explore', query: { q: searchQuery.value } });
  }
};

const goToFilters = () => {
  router.push({ name: 'explore', query: { openFilters: 'true' } });
};
</script>

<template>
  <header class="fixed top-0 left-0 w-full bg-white z-40 px-4 md:px-6 pt-4 pb-4 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] transition-all duration-300">
    <div class="flex items-center gap-3">
      <!-- Main Search Bar Area -->
      <div class="flex-1 bg-white rounded-full shadow-[0_3px_12px_rgba(0,0,0,0.08)] border border-gray-100 py-2.5 px-4 flex items-center gap-4 transition-transform duration-100">
        <div class="flex-shrink-0 text-brand">
          <Search :size="20" stroke-width="2.5" class="text-rose-500" />
        </div>
        
        <input 
          v-model="searchQuery"
          @keydown.enter="handleSearch"
          type="text"
          placeholder="Buscar propiedad"
          class="flex-1 bg-transparent border-none text-sm font-bold text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 px-0 truncate"
        />

        <button @click="goToFilters" class="p-2 bg-white rounded-full border border-gray-200 hover:bg-gray-50 transition-colors">
           <SlidersHorizontal :size="14" class="text-gray-900" />
        </button>
      </div>

      <!-- Notification Button -->
      <button class="p-3 bg-white rounded-full border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors text-gray-700 relative">
        <Bell :size="20" />
        <span class="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
      </button>
    </div>
  </header>
</template>
