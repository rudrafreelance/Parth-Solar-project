<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { CheckCircle2, LoaderCircle, MessageCircle, Send, X } from '@lucide/vue'

defineProps({
  businessName: {
    type: String,
    default: 'Ideal Energy',
  },
})

const open = ref(false)
const message = ref('')
const name = ref('')
const phone = ref('')
const input = ref(null)
const sending = ref(false)
const sent = ref(false)
const error = ref('')

async function sendToAdmin() {
  if (!message.value.trim() || sending.value) return

  sending.value = true
  error.value = ''
  sent.value = false

  try {
    const response = await fetch('/api/whatsapp-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.value.trim(),
        phone: phone.value.trim(),
        message: message.value.trim(),
      }),
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      throw new Error(data.error || 'Could not send message. Please try again.')
    }

    sent.value = true
    message.value = ''
    name.value = ''
    phone.value = ''
  } catch (err) {
    error.value = err?.message || 'Could not send message. Please try again.'
  } finally {
    sending.value = false
  }
}

async function openChat() {
  open.value = true
  sent.value = false
  error.value = ''
  await nextTick()
  input.value?.focus()
}

function onKeydown(event) {
  if (event.key === 'Escape') open.value = false
}

watch(open, (isOpen) => {
  document.body.style.overflow = isOpen && window.innerWidth < 640 ? 'hidden' : ''
})

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <div class="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 sm:bottom-7 sm:right-7">
    <Transition
      enter-active-class="transition duration-250 ease-out"
      enter-from-class="translate-y-3 scale-95 opacity-0"
      enter-to-class="translate-y-0 scale-100 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 scale-100 opacity-100"
      leave-to-class="translate-y-3 scale-95 opacity-0"
    >
      <div
        v-if="open"
        class="w-[min(100vw-2.5rem,22rem)] overflow-hidden rounded-[1.75rem] border border-emerald-950/10 bg-white shadow-2xl shadow-emerald-950/20"
        role="dialog"
        aria-label="Chat with Ideal Energy"
      >
        <div class="flex items-center justify-between bg-[#075e54] px-4 py-3.5 text-white">
          <div class="flex items-center gap-3">
            <span class="grid h-10 w-10 place-items-center rounded-full bg-white/15">
              <MessageCircle class="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p class="text-sm font-bold">{{ businessName }}</p>
              <p class="text-xs text-white/75">Message goes to our team</p>
            </div>
          </div>
          <button
            type="button"
            class="grid h-9 w-9 place-items-center rounded-full bg-white/10 transition hover:bg-white/20"
            aria-label="Close chat"
            @click="open = false"
          >
            <X class="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div class="space-y-3 bg-[#ece5dd] px-4 py-4">
          <div class="max-w-[90%] rounded-2xl rounded-tl-sm bg-white px-3.5 py-2.5 text-sm leading-6 text-emerald-950 shadow-sm">
            Hi! Ask us anything about solar. Your message is sent to our admin — WhatsApp will not open on your device.
          </div>

          <div
            v-if="sent"
            class="flex max-w-[95%] items-start gap-2 rounded-2xl rounded-tl-sm bg-emerald-50 px-3.5 py-2.5 text-sm leading-6 text-emerald-900 shadow-sm"
          >
            <CheckCircle2 class="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
            <span>Sent. Our team will get back to you shortly.</span>
          </div>

          <div
            v-if="error"
            class="max-w-[95%] rounded-2xl rounded-tl-sm bg-red-50 px-3.5 py-2.5 text-sm leading-6 text-red-800 shadow-sm"
            role="alert"
          >
            {{ error }}
          </div>
        </div>

        <form class="space-y-3 border-t border-emerald-950/10 bg-white p-4" @submit.prevent="sendToAdmin">
          <label class="block">
            <span class="sr-only">Your name</span>
            <input
              v-model="name"
              type="text"
              autocomplete="name"
              placeholder="Your name (optional)"
              class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-emerald-950 outline-none placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15"
            />
          </label>
          <label class="block">
            <span class="sr-only">Your phone</span>
            <input
              v-model="phone"
              type="tel"
              inputmode="numeric"
              autocomplete="tel"
              placeholder="Phone (optional, for callback)"
              class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-emerald-950 outline-none placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15"
            />
          </label>
          <label class="block">
            <span class="sr-only">Your message</span>
            <textarea
              ref="input"
              v-model="message"
              rows="3"
              required
              maxlength="2000"
              placeholder="Type your message…"
              class="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-emerald-950 outline-none placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15"
            ></textarea>
          </label>
          <button
            type="submit"
            class="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25d366] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#1ebe57] disabled:opacity-50"
            :disabled="!message.trim() || sending"
          >
            <LoaderCircle v-if="sending" class="h-4 w-4 animate-spin" aria-hidden="true" />
            <Send v-else class="h-4 w-4" aria-hidden="true" />
            {{ sending ? 'Sending…' : 'Send message' }}
          </button>
          <p class="text-center text-[11px] leading-4 text-slate-500">
            Delivered to our team via WhatsApp Business API. Your WhatsApp stays closed.
          </p>
        </form>
      </div>
    </Transition>

    <button
      type="button"
      class="group flex items-center gap-3 rounded-full bg-[#25d366] p-1 pr-5 text-white shadow-xl shadow-emerald-950/20 transition hover:-translate-y-0.5 hover:bg-[#1ebe57] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25d366]"
      :aria-expanded="open"
      aria-label="Chat with Ideal Energy"
      @click="open ? (open = false) : openChat()"
    >
      <span class="grid h-14 w-14 place-items-center rounded-full bg-white/15">
        <X v-if="open" class="h-6 w-6" aria-hidden="true" />
        <MessageCircle v-else class="h-7 w-7" aria-hidden="true" />
      </span>
      <span class="hidden text-sm font-bold sm:inline">{{ open ? 'Close' : 'Chat with us' }}</span>
    </button>
  </div>
</template>
