import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import { useAdminAuth } from '@/composables/useAdminAuth'
import { applySeo, organizationJsonLd } from '@/composables/useSeo'
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
          title: 'Ideal Energy | Premium Solar Solutions',
          description:
            'Ideal Energy designs and installs premium residential, commercial, and industrial solar systems with clear pricing and expert support.',
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
          title: 'About Ideal Energy | Our Story, Team & Mission',
          description:
            'Learn how Ideal Energy delivers trusted solar engineering, certified installation, and long-term support for cleaner energy.',
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
          title: 'Solar Services | Residential, Commercial & Industrial',
          description:
            'Explore Ideal Energy solar services including rooftop solar, battery storage, solar pumps, maintenance, and AMC support.',
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
          title: 'Solar Projects Gallery | Ideal Energy Installations',
          description:
            'Browse real Ideal Energy solar projects across homes, businesses, and industrial sites with verified installation photography.',
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
          title: 'Solar Savings Calculator | Ideal Energy',
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
  ],
})

router.beforeEach(async (to) => {
  if (!to.path.startsWith('/admin')) return true

  const { initAuth, isAuthenticated, authReady } = useAdminAuth()
  if (!authReady.value) await initAuth()

  if (to.meta.publicAdmin) {
    if (isAuthenticated.value) return { name: 'admin-dashboard' }
    return true
  }

  if (to.meta.requiresAuth && !isAuthenticated.value) {
    return { name: 'admin-login', query: { redirect: to.fullPath } }
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
    jsonLd: to.name === 'home' ? organizationJsonLd() : null,
  })
})

export default router
