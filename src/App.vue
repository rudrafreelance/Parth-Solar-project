<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Footer from '@/components/layout/Footer.vue'
import Navbar from '@/components/layout/Navbar.vue'
import WhatsAppChat from '@/components/layout/WhatsAppChat.vue'

const route = useRoute()
const isAdmin = computed(() => route.path.startsWith('/admin'))
</script>

<template>
  <template v-if="isAdmin">
    <RouterView />
  </template>
  <template v-else>
    <Navbar />
    <RouterView />
    <Footer />
    <WhatsAppChat />
  </template>
</template>
