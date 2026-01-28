<script setup>
import { Home, Search, PlusCircle, Heart, User } from 'lucide-vue-next';
import { RouterLink } from 'vue-router';
</script>

<template>
  <nav class="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 pb-safe pt-2 px-6 flex justify-between items-center z-50">
    <RouterLink to="/" class="flex flex-col items-center gap-1 text-gray-400 hover:text-rose-500 transition-colors" active-class="text-rose-600 font-medium">
      <Home :size="24" stroke-width="2" />
      <span class="text-[10px]">Inicio</span>
    </RouterLink>

    <RouterLink to="/explore" class="flex flex-col items-center gap-1 text-gray-400 hover:text-rose-500 transition-colors" active-class="text-rose-600 font-medium">
      <Search :size="24" stroke-width="2" />
      <span class="text-[10px]">Explorar</span>
    </RouterLink>

    <RouterLink to="/add" class="flex flex-col items-center gap-1 text-gray-400 hover:text-rose-500 transition-colors" active-class="text-rose-600 font-medium">
      <div class="bg-rose-500 rounded-full p-2 -mt-6 shadow-lg border-4 border-white">
        <PlusCircle :size="28" stroke-width="2" class="text-white" />
      </div>
      <span class="text-[10px]">Publicar</span>
    </RouterLink>

    <RouterLink to="/favorites" class="flex flex-col items-center gap-1 text-gray-400 hover:text-rose-500 transition-colors" active-class="text-rose-600 font-medium">
      <Heart :size="24" stroke-width="2" />
      <span class="text-[10px]">Favoritos</span>
    </RouterLink>

    <RouterLink to="/profile" class="flex flex-col items-center gap-1 text-gray-400 hover:text-rose-500 transition-colors" active-class="text-rose-600 font-medium">
      <User :size="24" stroke-width="2" />
      <span class="text-[10px]">Perfil</span>
    </RouterLink>
  </nav>
</template>

<style scoped>
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 16px);
}
</style>
