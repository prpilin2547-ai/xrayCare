import { ref } from 'vue'

/**
 * Bumped when SuperAdmin switches hospital from the header dropdown so
 * router-view remounts and pages refetch with the new X-Hospital-Id header.
 */
export const hospitalScopeVersion = ref(0)

export function bumpHospitalScope() {
  hospitalScopeVersion.value += 1
}
