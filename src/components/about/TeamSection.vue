<script setup>
import SectionHeading from './SectionHeading.vue'

const team = [
  {
    name: 'Adrian Cole',
    role: 'Founder & Energy Strategist',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=85',
    bio: 'Leading Ideal Energy with a focus on transparent energy planning and enduring customer value.',
  },
  {
    name: 'Maya Patel',
    role: 'Director of Engineering',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=85',
    bio: 'Guiding our engineering team to create safe, elegant, and exceptionally productive systems.',
  },
  {
    name: 'Jordan Lee',
    role: 'Customer Experience Lead',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=85',
    bio: 'Making every step clear and ensuring customers feel supported throughout system ownership.',
  },
]
</script>

<template>
  <section class="bg-white py-20 sm:py-24 lg:py-32">
    <div class="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
      <SectionHeading
        eyebrow="Meet our team"
        title="Expertise with a human touch."
        description="Engineers, installers, and energy advisors united by the belief that excellent work begins with listening."
      />
      <div class="mt-14 grid gap-6 md:grid-cols-3 lg:mt-16">
        <article
          v-for="(member, index) in team"
          :key="member.name"
          data-aos="fade-up"
          :data-aos-delay="index * 100"
          class="group overflow-hidden rounded-[2rem] bg-[#f8faf5] text-left"
        >
          <div class="relative overflow-hidden">
            <img
              :src="member.image"
              :alt="member.name"
              class="aspect-[4/4.5] w-full object-cover object-top transition duration-700 group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              class="absolute bottom-5 right-5 grid h-11 w-11 place-items-center rounded-full bg-white text-emerald-950 shadow-lg transition hover:-translate-y-1 hover:bg-lime-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300"
              :aria-label="`View ${member.name} on LinkedIn`"
            >
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M6.5 8.25H3V21h3.5V8.25ZM4.75 3A2.05 2.05 0 1 0 4.75 7.1 2.05 2.05 0 0 0 4.75 3ZM21 13.7c0-3.84-2.05-5.63-4.78-5.63-2.2 0-3.19 1.21-3.74 2.06V8.25H9V21h3.48v-6.32c0-1.67.32-3.3 2.4-3.3 2.05 0 2.08 1.92 2.08 3.41V21H21v-7.3Z"></path>
              </svg>
            </a>
          </div>
          <div class="p-6 sm:p-7">
            <h3 class="text-xl font-bold text-emerald-950">{{ member.name }}</h3>
            <p class="mt-1 text-sm font-bold text-emerald-600">{{ member.role }}</p>
            <p class="mt-4 text-sm leading-6 text-slate-600">{{ member.bio }}</p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
