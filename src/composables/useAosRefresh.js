import { nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import AOS from 'aos'

/** Re-scan AOS targets after SPA navigation / content changes. */
export function useAosRefresh() {
  const route = useRoute()

  watch(
    () => route.fullPath,
    async () => {
      await nextTick()
      // Let the new page paint, then refresh observers
      window.requestAnimationFrame(() => {
        AOS.refreshHard()
      })
    },
  )
}
