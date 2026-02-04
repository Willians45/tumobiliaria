<script setup>
import { computed } from 'vue';
import { RouterView, useRoute } from 'vue-router'
import BottomNav from './components/BottomNav.vue'
import TopHeader from './components/TopHeader.vue'

const route = useRoute();
const hideTopHeader = computed(() => {
  return ['property-details', 'agent-profile'].includes(route.name);
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20">
    <TopHeader v-if="!hideTopHeader" />
    
    <main class="">
      <RouterView v-slot="{ Component }">
        <transition
          mode="out-in"
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 translate-y-4"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-4"
        >
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>

    <BottomNav />
  </div>
</template>

<style>
/* Global resets or specific app-wide styles */
body {
  -webkit-tap-highlight-color: transparent;
}
</style>
