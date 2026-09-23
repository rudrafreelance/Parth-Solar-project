<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ImagePlus, Trash2, Upload } from '@lucide/vue'
import { useProjects } from '@/composables/useProjects'
import { supabase } from '@/lib/supabase'

const { projects, fetchProjects } = useProjects()
const formLoading = ref(false)
const message = ref('')
const messageType = ref('info')
const previewUrl = ref('')

const form = reactive({
  title: '',
  location: '',
  output: '',
  type: 'Residential',
  description: '',
  featured: false,
  file: null,
})

const types = ['Residential', 'Commercial', 'Industrial', 'Hospitality', 'Government']

function setMessage(text, type = 'info') {
  message.value = text
  messageType.value = type
}

function onFileChange(event) {
  const file = event.target.files?.[0]
  form.file = file || null
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = file ? URL.createObjectURL(file) : ''
}

async function uploadProject() {
  if (!supabase) {
    setMessage('Supabase is not configured.', 'error')
    return
  }
  if (!form.file || !form.title.trim()) {
    setMessage('Title and image are required.', 'error')
    return
  }

  formLoading.value = true
  setMessage('')

  try {
    const extension = form.file.name.split('.').pop() || 'jpg'
    const path = `projects/${Date.now()}-${crypto.randomUUID()}.${extension}`

    const { error: uploadError } = await supabase.storage
      .from('project-images')
      .upload(path, form.file, { cacheControl: '3600', upsert: false })
    if (uploadError) throw uploadError

    const { data: publicData } = supabase.storage.from('project-images').getPublicUrl(path)

    const { error: insertError } = await supabase.from('projects').insert({
      title: form.title.trim(),
      location: form.location.trim(),
      output: form.output.trim(),
      type: form.type,
      description: form.description.trim(),
      featured: form.featured,
      image_url: publicData.publicUrl,
      image_path: path,
      sort_order: projects.value.length + 1,
    })
    if (insertError) throw insertError

    form.title = ''
    form.location = ''
    form.output = ''
    form.description = ''
    form.featured = false
    form.file = null
    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = ''

    await fetchProjects({ force: true })
    setMessage('Project uploaded successfully.', 'success')
  } catch (err) {
    setMessage(err.message || 'Upload failed', 'error')
  } finally {
    formLoading.value = false
  }
}

async function deleteProject(project) {
  if (!supabase) return
  if (String(project.id).startsWith('fallback-')) {
    setMessage('Cannot delete placeholder fallback projects.', 'error')
    return
  }
  if (!window.confirm(`Delete “${project.title}”?`)) return

  try {
    if (project.image_path) {
      await supabase.storage.from('project-images').remove([project.image_path])
    }
    const { error } = await supabase.from('projects').delete().eq('id', project.id)
    if (error) throw error
    await fetchProjects({ force: true })
    setMessage('Project deleted.', 'success')
  } catch (err) {
    setMessage(err.message || 'Delete failed', 'error')
  }
}

onMounted(() => fetchProjects({ force: true }))
</script>

<template>
  <div class="grid gap-8">
    <p
      v-if="message"
      class="rounded-2xl px-4 py-3 text-sm font-medium"
      :class="{
        'bg-emerald-100 text-emerald-900': messageType === 'success',
        'bg-amber-100 text-amber-900': messageType === 'info',
        'bg-red-100 text-red-800': messageType === 'error',
      }"
    >
      {{ message }}
    </p>

    <section class="rounded-[1.75rem] border border-emerald-950/10 bg-white p-6 sm:p-8">
      <h2 class="flex items-center gap-2 text-xl font-bold text-emerald-950">
        <Upload class="h-5 w-5" aria-hidden="true" />
        Upload project
      </h2>
      <p class="mt-2 text-sm text-slate-600">Photos are stored in Supabase Storage and shown on the public Projects page.</p>

      <form class="mt-6 grid gap-4 sm:grid-cols-2" @submit.prevent="uploadProject">
        <label class="block text-left sm:col-span-2">
          <span class="text-sm font-bold text-emerald-950">Project title</span>
          <input v-model="form.title" required class="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10" />
        </label>
        <label class="block text-left">
          <span class="text-sm font-bold text-emerald-950">Location</span>
          <input v-model="form.location" class="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10" />
        </label>
        <label class="block text-left">
          <span class="text-sm font-bold text-emerald-950">System size</span>
          <input v-model="form.output" placeholder="e.g. 12.4 kW" class="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10" />
        </label>
        <label class="block text-left">
          <span class="text-sm font-bold text-emerald-950">Type</span>
          <select v-model="form.type" class="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10">
            <option v-for="type in types" :key="type" :value="type">{{ type }}</option>
          </select>
        </label>
        <label class="flex items-center gap-3 pt-8 text-left text-sm font-bold text-emerald-950">
          <input v-model="form.featured" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-emerald-700" />
          Show on Home featured section
        </label>
        <label class="block text-left sm:col-span-2">
          <span class="text-sm font-bold text-emerald-950">Description</span>
          <textarea v-model="form.description" rows="3" class="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"></textarea>
        </label>
        <label class="block text-left sm:col-span-2">
          <span class="text-sm font-bold text-emerald-950">Project photo</span>
          <input
            type="file"
            accept="image/*"
            required
            class="mt-2 block w-full rounded-xl border border-dashed border-emerald-950/20 bg-slate-50 px-4 py-4 text-sm file:mr-4 file:rounded-full file:border-0 file:bg-lime-300 file:px-4 file:py-2 file:font-bold file:text-emerald-950"
            @change="onFileChange"
          />
        </label>
        <div v-if="previewUrl" class="overflow-hidden rounded-2xl sm:col-span-2">
          <img :src="previewUrl" alt="Upload preview" class="aspect-[16/9] w-full object-cover" />
        </div>
        <button
          type="submit"
          class="inline-flex items-center justify-center gap-2 rounded-full bg-lime-300 px-6 py-3.5 font-bold text-emerald-950 transition hover:bg-lime-200 disabled:opacity-60 sm:col-span-2"
          :disabled="formLoading"
        >
          <ImagePlus class="h-5 w-5" aria-hidden="true" />
          {{ formLoading ? 'Uploading…' : 'Upload project' }}
        </button>
      </form>
    </section>

    <section class="rounded-[1.75rem] border border-emerald-950/10 bg-white p-6 sm:p-8">
      <h2 class="text-xl font-bold text-emerald-950">Uploaded projects ({{ projects.length }})</h2>
      <ul class="mt-6 space-y-4">
        <li
          v-for="project in projects"
          :key="project.id"
          class="flex flex-col gap-4 rounded-2xl border border-emerald-950/10 p-4 sm:flex-row sm:items-center"
        >
          <img :src="project.image_url" :alt="project.title" class="h-24 w-full rounded-xl object-cover sm:h-20 sm:w-28" />
          <div class="flex-1 text-left">
            <p class="font-bold text-emerald-950">{{ project.title }}</p>
            <p class="mt-1 text-sm text-slate-500">{{ project.type }} · {{ project.location }} · {{ project.output }}</p>
          </div>
          <button
            type="button"
            class="inline-flex items-center justify-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-700 transition hover:bg-red-100"
            @click="deleteProject(project)"
          >
            <Trash2 class="h-4 w-4" aria-hidden="true" />
            Delete
          </button>
        </li>
      </ul>
    </section>
  </div>
</template>
