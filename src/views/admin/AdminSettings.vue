<script setup>
import { isSupabaseConfigured } from '@/lib/supabase'
import { isAnalyticsConfigured } from '@/composables/useAnalytics'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'Not set'
const siteUrl = (import.meta.env.VITE_SITE_URL || '').replace(/\/$/, '') || 'https://your-domain.vercel.app'
const adsFinalUrl = `${siteUrl}/go/solar?utm_source=google&utm_medium=cpc&utm_campaign=rooftop_gujarat`
</script>

<template>
  <div class="max-w-3xl space-y-6">
    <section class="rounded-[1.75rem] border border-emerald-950/10 bg-white p-6 sm:p-8">
      <h2 class="text-xl font-bold text-emerald-950">Backend connection</h2>
      <dl class="mt-6 space-y-4 text-sm">
        <div class="flex flex-col gap-1 sm:flex-row sm:justify-between">
          <dt class="font-bold text-slate-500">Supabase status</dt>
          <dd class="font-semibold" :class="isSupabaseConfigured ? 'text-emerald-700' : 'text-red-600'">
            {{ isSupabaseConfigured ? 'Connected' : 'Not configured' }}
          </dd>
        </div>
        <div class="flex flex-col gap-1 sm:flex-row sm:justify-between">
          <dt class="font-bold text-slate-500">Project URL</dt>
          <dd class="break-all font-semibold text-emerald-950">{{ supabaseUrl }}</dd>
        </div>
        <div class="flex flex-col gap-1 sm:flex-row sm:justify-between">
          <dt class="font-bold text-slate-500">Analytics / Ads tags</dt>
          <dd class="font-semibold" :class="isAnalyticsConfigured ? 'text-emerald-700' : 'text-amber-700'">
            {{ isAnalyticsConfigured ? 'Configured' : 'Not set (optional for Ads)' }}
          </dd>
        </div>
        <div class="flex flex-col gap-1 sm:flex-row sm:justify-between">
          <dt class="font-bold text-slate-500">Deploy target</dt>
          <dd class="font-semibold text-emerald-950">Vercel (frontend) + Supabase (backend)</dd>
        </div>
      </dl>
    </section>

    <section class="rounded-[1.75rem] border border-emerald-950/10 bg-white p-6 sm:p-8">
      <h2 class="text-xl font-bold text-emerald-950">Google Ads final URL</h2>
      <p class="mt-3 text-sm leading-6 text-slate-600">
        Use this as the campaign landing page. Leads will be tagged <span class="font-semibold text-emerald-800">google_ads</span> in Admin → Leads.
      </p>
      <p class="mt-4 break-all rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium text-emerald-950">
        {{ adsFinalUrl }}
      </p>
      <p class="mt-3 text-xs text-slate-500">See docs/google-ads-lead-automation.md for keywords, budget, and conversion setup.</p>
    </section>

    <section class="rounded-[1.75rem] border border-emerald-950/10 bg-white p-6 sm:p-8">
      <h2 class="text-xl font-bold text-emerald-950">Checklist</h2>
      <ol class="mt-5 list-decimal space-y-3 pl-5 text-sm leading-6 text-slate-600">
        <li>Root <code>.env</code> has <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code></li>
        <li>Run <code>supabase/schema.sql</code> in Supabase SQL Editor</li>
        <li>Create an admin user under Authentication → Users</li>
        <li>Configure Resend + WhatsApp before spending on ads</li>
        <li>Add <code>VITE_GA_MEASUREMENT_ID</code> / Ads conversion env vars for tracking</li>
        <li>Add the same env vars in Vercel before deploy</li>
      </ol>
    </section>
  </div>
</template>
