<script setup>
/**
 * Home view
 * Composes the full landing page from independent section components.
 * Each section is self-contained (own data import, own markup) so this
 * file stays a pure composition layer — no logic lives here.
 */
import HeroSection from '@components/home/HeroSection.vue'
import TrustSection from '@components/home/TrustSection.vue'
import AboutPreview from '@components/home/AboutPreview.vue'
import WhyChoose from '@components/home/WhyChoose.vue'
import ServicesSection from '@components/home/ServicesSection.vue'
import ProcessTimeline from '@components/home/ProcessTimeline.vue'
import ProjectsSection from '@components/home/ProjectsSection.vue'
import TestimonialsSection from '@components/home/TestimonialsSection.vue'
import FaqSection from '@components/home/FaqSection.vue'
import CTASection from '@components/home/CTASection.vue'
import ContactPreview from '@components/home/ContactPreview.vue'
</script>

<template>
  <main class="overflow-x-hidden">
    <HeroSection />
    <TrustSection />
    <AboutPreview />
    <WhyChoose />
    <ServicesSection />
    <ProcessTimeline />
    <ProjectsSection />
    <TestimonialsSection />
    <FaqSection />
    <CTASection />
    <ContactPreview />
  </main>
</template>