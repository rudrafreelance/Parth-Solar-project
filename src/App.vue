<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Footer from '@/components/layout/Footer.vue'
import Navbar from '@/components/layout/Navbar.vue'
import WhatsAppChat from '@/components/layout/WhatsAppChat.vue'
import { useAosRefresh } from '@/composables/useAosRefresh'

const route = useRoute()
const isPrivateApp = computed(
  () => route.path.startsWith('/admin') || route.path.startsWith('/billing'),
)

useAosRefresh()
</script>

<template>
  <template v-if="isPrivateApp">
    <RouterView />
  </template>
  <template v-else>
    <Navbar />
    <RouterView v-slot="{ Component, route: currentRoute }">
      <Transition name="page" mode="out-in">
        <component :is="Component" :key="currentRoute.path" />
      </Transition>
    </RouterView>
    <Footer />
    <WhatsAppChat />
  </template>
</template>
