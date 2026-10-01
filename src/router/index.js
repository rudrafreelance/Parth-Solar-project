import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import { useAdminAuth } from '@/composables/useAdminAuth'
import { applySeo, homeJsonLd, pageJsonLd, serviceJsonLd } from '@/composables/useSeo'
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, getServiceSeo } from '@/data/localSeo'
import { getServiceById } from '@/components/services/servicesData'
import { captureLeadAttribution } from '@/composables/useLeadAttribution'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        seo: {
          title: DEFAULT_TITLE,
          description: DEFAULT_DESCRIPTION,
          path: '/',
        },
      },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/About.vue'),
      meta: {
        seo: {
          title: 'About Ideal Energy | Solar Company in Ahmedabad',
          description:
            'Ideal Energy is an Ahmedabad solar company installing rooftop systems for homes and businesses across Gujarat, with subsidy help and after-sales support.',
          path: '/about',
        },
      },
    },
    {
      path: '/services',
      name: 'services',
      component: () => import('@/views/Services.vue'),
      meta: {
        seo: {
          title: 'Solar Services in Ahmedabad | Rooftop, Commercial & Subsidy',
          description:
            'Residential, commercial, and industrial solar in Ahmedabad, plus batteries, maintenance, AMC, and PM Surya Ghar subsidy support from Ideal Energy.',
          path: '/services',
        },
      },
    },
    {
      path: '/services/:slug',
      name: 'service-detail',
      component: () => import('@/views/ServicePage.vue'),
      meta: {
        seo: {
          title: 'Solar Service | Ideal Energy',
          description: 'Explore Ideal Energy solar service details, features, and next steps.',
          path: '/services',
        },
      },
    },
    {
      path: '/projects',
      name: 'projects',
      component: () => import('@/views/Projects.vue'),
      meta: {
        seo: {
          title: 'Solar Projects in Ahmedabad | Ideal Energy Installations',
          description:
            'See Ideal Energy rooftop and commercial solar projects in Ahmedabad and Gujarat, with real installation photos.',
          path: '/projects',
        },
      },
    },
    {
      path: '/calculator',
      name: 'calculator',
      component: () => import('@/views/Calculator.vue'),
      meta: {
        seo: {
          title: 'Solar Savings Calculator for Ahmedabad | Ideal Energy',
          description:
            'Estimate rooftop solar size, monthly savings, and payback from your Ahmedabad or Gujarat electricity bill. Free Ideal Energy calculator.',
          path: '/calculator',
        },
      },
    },
    {
      path: '/go/solar',
      name: 'ads-solar',
      component: () => import('@/views/AdsSolarLanding.vue'),
      meta: {
        seo: {
          title: 'Free Solar Estimate | Ideal Energy',
          description:
            'Get a free Ideal Energy rooftop solar savings estimate. Clear pricing and same-day advisor follow-up.',
          path: '/go/solar',
          robots: 'noindex,nofollow',
        },
      },
    },
    {
      path: '/thank-you',
      name: 'thank-you',
      component: () => import('@/views/ThankYou.vue'),
      meta: {
        seo: {
          title: 'Thank You | Ideal Energy',
          description: 'Thanks for contacting Ideal Energy. Our solar advisors will reach out shortly.',
          path: '/thank-you',
          robots: 'noindex,nofollow',
        },
      },
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: () => import('@/views/LegalPage.vue'),
      meta: {
        seo: {
          title: 'Privacy Policy | Ideal Energy',
          description: 'How Ideal Energy collects and uses contact and lead information.',
          path: '/privacy',
        },
      },
    },
    {
      path: '/terms',
      name: 'terms',
      component: () => import('@/views/LegalPage.vue'),
      meta: {
        seo: {
          title: 'Terms & Conditions | Ideal Energy',
          description: 'Terms for using the Ideal Energy website and solar services.',
          path: '/terms',
        },
      },
    },
    {
      path: '/admin',
      component: () => import('@/layouts/AdminLayout.vue'),
      meta: {
        isAdmin: true,
        seo: {
          title: 'Admin | Ideal Energy',
          description: 'Ideal Energy private admin panel.',
          path: '/admin',
          robots: 'noindex,nofollow',
        },
      },
      children: [
        {
          path: 'login',
          name: 'admin-login',
          component: () => import('@/views/admin/AdminLogin.vue'),
          meta: {
            isAdmin: true,
            publicAdmin: true,
            seo: {
              title: 'Admin Login | Ideal Energy',
              description: 'Secure login for Ideal Energy administrators.',
              path: '/admin/login',
              robots: 'noindex,nofollow',
            },
          },
        },
        {
          path: '',
          name: 'admin-dashboard',
          component: () => import('@/views/admin/AdminDashboard.vue'),
          meta: {
            isAdmin: true,
            requiresAuth: true,
            seo: {
              title: 'Admin Dashboard | Ideal Energy',
              description: 'Ideal Energy admin dashboard.',
              path: '/admin',
              robots: 'noindex,nofollow',
            },
          },
        },
        {
          path: 'projects',
          name: 'admin-projects',
          component: () => import('@/views/admin/AdminProjects.vue'),
          meta: {
            isAdmin: true,
            requiresAuth: true,
            seo: {
              title: 'Manage Projects | Ideal Energy Admin',
              description: 'Upload and manage Ideal Energy project photos.',
              path: '/admin/projects',
              robots: 'noindex,nofollow',
            },
          },
        },
        {
          path: 'leads',
          name: 'admin-leads',
          component: () => import('@/views/admin/AdminLeads.vue'),
          meta: {
            isAdmin: true,
            requiresAuth: true,
            seo: {
              title: 'Leads | Ideal Energy Admin',
              description: 'Review Ideal Energy website enquiries.',
              path: '/admin/leads',
              robots: 'noindex,nofollow',
            },
          },
        },
        {
          path: 'settings',
          name: 'admin-settings',
          component: () => import('@/views/admin/AdminSettings.vue'),
          meta: {
            isAdmin: true,
            requiresAuth: true,
            seo: {
              title: 'Settings | Ideal Energy Admin',
              description: 'Ideal Energy admin settings.',
              path: '/admin/settings',
              robots: 'noindex,nofollow',
            },
          },
        },
      ],
    },
    {
      path: '/billing',
      component: () => import('@/layouts/BillingLayout.vue'),
      meta: {
        isBilling: true,
        seo: {
          title: 'Billing | Ideal Energy',
          description: 'Ideal Energy private billing portal.',
          path: '/billing',
          robots: 'noindex,nofollow',
        },
      },
      children: [
        {
          path: 'login',
          name: 'billing-login',
          component: () => import('@/views/billing/BillingLogin.vue'),
          meta: {
            isBilling: true,
            publicBilling: true,
            seo: {
              title: 'Billing Login | Ideal Energy',
              description: 'Secure login for Ideal Energy billing.',
              path: '/billing/login',
              robots: 'noindex,nofollow',
            },
          },
        },
        {
          path: '',
          name: 'billing-dashboard',
          component: () => import('@/views/billing/BillingDashboard.vue'),
          meta: {
            isBilling: true,
            requiresAuth: true,
            seo: {
              title: 'Billing Dashboard | Ideal Energy',
              description: 'Ideal Energy billing dashboard.',
              path: '/billing',
              robots: 'noindex,nofollow',
            },
          },
        },
        {
          path: 'bills',
          name: 'billing-bills',
          component: () => import('@/views/billing/BillingBills.vue'),
          meta: {
            isBilling: true,
            requiresAuth: true,
            seo: {
              title: 'Bills | Ideal Energy Billing',
              description: 'Sale and purchase invoices.',
              path: '/billing/bills',
              robots: 'noindex,nofollow',
            },
          },
        },
        {
          path: 'bills/new/:type',
          name: 'billing-bill-new',
          component: () => import('@/views/billing/BillingBillForm.vue'),
          meta: {
            isBilling: true,
            requiresAuth: true,
            seo: {
              title: 'New Bill | Ideal Energy Billing',
              description: 'Create a sale or purchase invoice.',
              path: '/billing/bills',
              robots: 'noindex,nofollow',
            },
          },
        },
        {
          path: 'bills/:id/edit',
          name: 'billing-bill-edit',
          component: () => import('@/views/billing/BillingBillForm.vue'),
          meta: {
            isBilling: true,
            requiresAuth: true,
            seo: {
              title: 'Edit Bill | Ideal Energy Billing',
              description: 'Edit an Ideal Energy invoice.',
              path: '/billing/bills',
              robots: 'noindex,nofollow',
            },
          },
        },
        {
          path: 'parties',
          name: 'billing-parties',
          component: () => import('@/views/billing/BillingParties.vue'),
          meta: {
            isBilling: true,
            requiresAuth: true,
            seo: {
              title: 'Parties | Ideal Energy Billing',
              description: 'Customers and suppliers.',
              path: '/billing/parties',
              robots: 'noindex,nofollow',
            },
          },
        },
        {
          path: 'items',
          name: 'billing-items',
          component: () => import('@/views/billing/BillingItems.vue'),
          meta: {
            isBilling: true,
            requiresAuth: true,
            seo: {
              title: 'Items | Ideal Energy Billing',
              description: 'Invoice catalog items.',
              path: '/billing/items',
              robots: 'noindex,nofollow',
            },
          },
        },
        {
          path: 'settings',
          name: 'billing-settings',
          component: () => import('@/views/billing/BillingSettings.vue'),
          meta: {
            isBilling: true,
            requiresAuth: true,
            seo: {
              title: 'Billing Settings | Ideal Energy',
              description: 'Company profile for invoices.',
              path: '/billing/settings',
              robots: 'noindex,nofollow',
            },
          },
        },
      ],
    },
{
  path: '/solar-panels-gujarat',
  name: 'solar-panels-gujarat',
  component: () => import('@/views/SolarPanelsGujarat.vue'),
  meta: {
    seo: {
      title: 'Solar Panels Gujarat – Ideal Energy | Premium Solar Solutions',
      description: 'Ideal Energy provides high‑quality solar panel installations across Gujarat. Get a free quote now.',
      path: '/solar-panels-gujarat',
    },
  },
},
  ],
})

router.beforeEach(async (to) => {
  const isAdminArea = to.path.startsWith('/admin')
  const isBillingArea = to.path.startsWith('/billing')
  if (!isAdminArea && !isBillingArea) return true

  const { initAuth, isAuthenticated, authReady } = useAdminAuth()
  if (!authReady.value) await initAuth()

  if (to.meta.publicAdmin || to.meta.publicBilling) {
    if (isAuthenticated.value) {
      return { name: isBillingArea ? 'billing-dashboard' : 'admin-dashboard' }
    }
    return true
  }

  if (to.meta.requiresAuth && !isAuthenticated.value) {
    return {
      name: isBillingArea ? 'billing-login' : 'admin-login',
      query: { redirect: to.fullPath },
    }
  }

  return true
})

router.afterEach((to) => {
  const queryString = to.fullPath.includes('?') ? `?${to.fullPath.split('?')[1]}` : ''
  captureLeadAttribution(queryString)

  if (to.name === 'service-detail') {
    const service = getServiceById(String(to.params.slug || ''))
    const serviceSeo = service ? getServiceSeo(service.id) : null
    if (service && serviceSeo) {
      applySeo({
        title: serviceSeo.title,
        description: serviceSeo.description,
        path: `/services/${service.id}`,
        jsonLd: serviceJsonLd(service),
      })
      return
    }
  }

  const seo = [...to.matched].reverse().find((record) => record.meta?.seo)?.meta?.seo
  if (!seo) return

  const crumbs = {
    about: [
      { name: 'Home', path: '/' },
      { name: 'About', path: '/about' },
    ],
    services: [
      { name: 'Home', path: '/' },
      { name: 'Solar services', path: '/services' },
    ],
    projects: [
      { name: 'Home', path: '/' },
      { name: 'Projects', path: '/projects' },
    ],
    calculator: [
      { name: 'Home', path: '/' },
      { name: 'Solar calculator', path: '/calculator' },
    ],
  }

  applySeo({
    ...seo,
    jsonLd: to.name === 'home' ? homeJsonLd() : crumbs[to.name] ? pageJsonLd(crumbs[to.name]) : null,
  })
})

export default router
