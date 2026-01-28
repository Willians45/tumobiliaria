<script setup>
import { RouterView } from 'vue-router'
import BottomNav from './components/BottomNav.vue'
import TopHeader from './components/TopHeader.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20">
    <TopHeader />
    
    <main class="">
      <RouterView />
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
