<script setup>
import { onMounted, reactive, ref } from 'vue'
import { Pencil, Plus, Trash2 } from '@lucide/vue'
import { useAdminAuth } from '@/composables/useAdminAuth'
import { supabase } from '@/lib/supabase'

const blank = {
  name: '',
  hsn: '',
  unit: 'NOS',
  default_rate: 0,
  default_gst_rate: 18,
}

const { session } = useAdminAuth()
const rows = ref([])
const loading = ref(true)
const error = ref('')
const form = reactive({ ...blank })
const editingId = ref(null)
const saving = ref(false)

async function load() {
  const userId = session.value?.user?.id
  if (!userId || !supabase) {
    loading.value = false
    return
  }
  loading.value = true
  const { data, error: qErr } = await supabase.from('items').select('*').eq('user_id', userId).order('name')
  if (qErr) error.value = qErr.message
  else rows.value = data || []
  loading.value = false
}

onMounted(load)

function startEdit(row) {
  editingId.value = row.id
  Object.assign(form, {
    name: row.name,
    hsn: row.hsn,
    unit: row.unit,
    default_rate: row.default_rate,
    default_gst_rate: row.default_gst_rate,
  })
}

function resetForm() {
  editingId.value = null
  Object.assign(form, blank)
}

async function onSubmit() {
  const userId = session.value?.user?.id
  if (!form.name.trim()) {
    error.value = 'Name is required'
    return
  }
  saving.value = true
  error.value = ''
  const payload = {
    ...form,
    name: form.name.trim(),
    default_rate: Number(form.default_rate) || 0,
    default_gst_rate: Number(form.default_gst_rate) || 0,
    user_id: userId,
  }
  const query = editingId.value
    ? supabase.from('items').update(payload).eq('id', editingId.value).eq('user_id', userId)
    : supabase.from('items').insert(payload)
  const { error: saveErr } = await query
  saving.value = false
  if (saveErr) {
    error.value = saveErr.message
    return
  }
  resetForm()
  load()
}

async function onDelete(row) {
  if (!window.confirm(`Delete item “${row.name}”?`)) return
  const userId = session.value?.user?.id
  const { error: delErr } = await supabase.from('items').delete().eq('id', row.id).eq('user_id', userId)
  if (delErr) error.value = delErr.message
  else load()
}
</script>

<template>
  <div class="mx-auto max-w-6xl space-y-5">
    <div>
      <p class="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Master data</p>
      <h2 class="mt-1 text-3xl font-bold text-emerald-950">Items</h2>
    </div>

    <p v-if="error" class="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{{ error }}</p>

    <form
      class="grid gap-3 rounded-3xl border border-emerald-950/10 bg-white p-5 sm:grid-cols-2 lg:grid-cols-3"
      @submit.prevent="onSubmit"
    >
      <h3 class="text-lg font-bold text-emerald-950 sm:col-span-2 lg:col-span-3">
        {{ editingId ? 'Edit item' : 'Add item' }}
      </h3>
      <label class="text-sm font-bold text-emerald-950 sm:col-span-2">
        Name
        <input v-model="form.name" required class="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" />
      </label>
      <label class="text-sm font-bold text-emerald-950">
        HSN
        <input v-model="form.hsn" class="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" />
      </label>
      <label class="text-sm font-bold text-emerald-950">
        Unit
        <input v-model="form.unit" class="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" />
      </label>
      <label class="text-sm font-bold text-emerald-950">
        Default rate
        <input
          v-model="form.default_rate"
          type="number"
          min="0"
          step="0.01"
          class="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5"
        />
      </label>
      <label class="text-sm font-bold text-emerald-950">
        Default GST %
        <select v-model.number="form.default_gst_rate" class="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
          <option :value="5">5%</option>
          <option :value="12">12%</option>
          <option :value="18">18%</option>
          <option :value="24">24%</option>
          <option :value="28">28%</option>
        </select>
      </label>
      <div class="flex gap-2 sm:col-span-2 lg:col-span-3">
        <button
          type="submit"
          class="inline-flex items-center gap-2 rounded-full bg-emerald-950 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"
          :disabled="saving"
        >
          <Plus class="h-4 w-4" />
          {{ editingId ? 'Update' : 'Add' }}
        </button>
        <button
          v-if="editingId"
          type="button"
          class="rounded-full border border-emerald-950/15 px-4 py-2.5 text-sm font-bold text-emerald-950"
          @click="resetForm"
        >
          Cancel
        </button>
      </div>
    </form>

    <div class="overflow-hidden rounded-3xl border border-emerald-950/10 bg-white">
      <div v-if="loading" class="space-y-3 p-5">
        <div v-for="n in 4" :key="n" class="h-10 animate-pulse rounded-xl bg-emerald-950/5" />
      </div>
      <p v-else-if="rows.length === 0" class="p-8 text-center text-sm text-slate-600">No items yet.</p>
      <div v-else class="overflow-x-auto">
        <table class="min-w-full text-left text-sm">
          <thead class="bg-emerald-950/5">
            <tr>
              <th class="px-4 py-3 font-bold">Name</th>
              <th class="px-4 py-3 font-bold">HSN</th>
              <th class="px-4 py-3 font-bold">Unit</th>
              <th class="px-4 py-3 font-bold">Rate</th>
              <th class="px-4 py-3 font-bold">GST</th>
              <th class="px-4 py-3 font-bold" />
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in rows"
              :key="row.id"
              class="cursor-pointer border-t border-emerald-950/8 hover:bg-emerald-50/50"
              @click="startEdit(row)"
            >
              <td class="px-4 py-3 font-semibold">{{ row.name }}</td>
              <td class="px-4 py-3">{{ row.hsn || '—' }}</td>
              <td class="px-4 py-3">{{ row.unit }}</td>
              <td class="px-4 py-3">{{ Number(row.default_rate).toFixed(2) }}</td>
              <td class="px-4 py-3">{{ row.default_gst_rate }}%</td>
              <td class="px-4 py-3">
                <div class="flex gap-2" @click.stop>
                  <button type="button" class="rounded-lg border p-2" @click="startEdit(row)">
                    <Pencil class="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    class="rounded-lg border border-red-200 p-2 text-red-600"
                    @click="onDelete(row)"
                  >
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
