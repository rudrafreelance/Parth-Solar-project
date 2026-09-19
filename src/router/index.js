import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import { useAdminAuth } from '@/composables/useAdminAuth'
import { applySeo, organizationJsonLd, faqJsonLd, serviceJsonLd } from '@/composables/useSeo'
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
          title: 'Ideal Energy | Solar Panels in Gujarat | Rooftop Solar Ahmedabad',
          description:
            'Ideal Energy installs rooftop solar panels for homes and businesses across Gujarat. Save up to 90% on electricity bills. PM Surya Ghar Yojana subsidy support. Free site assessment — call 63558 59771.',
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
          title: 'About Ideal Energy | Ahmedabad Solar Company | Our Story',
          description:
            'Ideal Energy is a trusted solar energy company in Ahmedabad, Gujarat with 8+ years of experience installing residential, commercial, and industrial solar systems. Meet our certified team.',
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
          title: 'Solar Services Gujarat | Residential, Commercial & Industrial Solar | Ideal Energy',
          description:
            'Ideal Energy offers complete solar solutions in Gujarat — residential rooftop solar with PM Surya Ghar Yojana subsidy, commercial & industrial solar, battery storage, solar pumps, and AMC maintenance.',
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
          title: 'Solar Projects in Gujarat | Ideal Energy Installation Gallery',
          description:
            'View completed solar installations by Ideal Energy across Gujarat — residential homes in Ahmedabad, commercial factories, and industrial sites with real photos and system details.',
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
          title: 'Solar Savings Calculator Gujarat | How Much Can You Save? | Ideal Energy',
          description:
            'Estimate your rooftop solar system size, monthly savings, and payback with Ideal Energy’s free solar calculator.',
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

  const seo = [...to.matched].reverse().find((record) => record.meta?.seo)?.meta?.seo
  if (!seo) return

  applySeo({
    ...seo,
    // Home page: LocalBusiness schema + FAQ schema (two rich result opportunities)
    jsonLd: to.name === 'home' ? organizationJsonLd() : null,
    jsonLd2: to.name === 'home' ? faqJsonLd() : to.name === 'services' ? serviceJsonLd() : null,
  })
})

export default router
