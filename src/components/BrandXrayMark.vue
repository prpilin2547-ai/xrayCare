<template>
  <!-- Custom mark: protective shield + subtle thorax (no beam) -->
  <svg
    class="brand-xray-mark"
    :width="size"
    :height="size"
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
    :aria-hidden="decorative ? 'true' : undefined"
    :role="decorative ? undefined : 'img'"
    :aria-label="decorative ? undefined : ariaLabel"
  >
    <defs>
      <linearGradient :id="shieldGradId" x1="16" y1="4" x2="16" y2="30" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="rgba(240,249,255,0.95)" />
        <stop offset="45%" stop-color="rgba(125,211,252,0.55)" />
        <stop offset="100%" stop-color="rgba(14,165,233,0.35)" />
      </linearGradient>
      <linearGradient :id="rimGradId" x1="4" y1="6" x2="28" y2="26" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="rgba(255,255,255,0.5)" />
        <stop offset="100%" stop-color="rgba(255,255,255,0.08)" />
      </linearGradient>
    </defs>
    <!-- Shield: protection / safety -->
    <path
      d="M16 3.5 L27.2 7.5 L26.3 19.2 C26 24 21 28.2 16 30.2 C11 28.2 6 24 5.7 19.2 L4.8 7.5 L16 3.5 Z"
      :fill="'url(#' + shieldGradId + ')'"
      stroke="rgba(255,255,255,0.42)"
      stroke-width="1.05"
      stroke-linejoin="round"
    />
    <path
      d="M16 6 L24.2 9.1 L23.5 18.5 C23.2 22 19.5 25.5 16 27.2 C12.5 25.5 8.8 22 8.5 18.5 L7.8 9.1 L16 6 Z"
      :fill="'url(#' + rimGradId + ')'"
      opacity="0.82"
    />
    <!-- Thorax hint (imaging context) — no radiation beam -->
    <path
      d="M12.5 13.5 Q16 14.2 19.5 13.5"
      fill="none"
      stroke="#e0f2fe"
      stroke-width="1.05"
      stroke-linecap="round"
      opacity="0.92"
    />
    <path
      d="M12.2 16.2 Q16.2 17.2 19.8 16"
      fill="none"
      stroke="#bae6fd"
      stroke-width="0.95"
      stroke-linecap="round"
      opacity="0.85"
    />
    <path
      d="M12 18.8 Q16.5 20.2 20 18.5"
      fill="none"
      stroke="#7dd3fc"
      stroke-width="0.9"
      stroke-linecap="round"
      opacity="0.72"
    />
    <line
      x1="16"
      y1="13.2"
      x2="16"
      y2="22.5"
      stroke="rgba(255,255,255,0.4)"
      stroke-width="0.75"
      stroke-linecap="round"
    />
  </svg>
</template>

<script setup>
defineProps({
  size: {
    type: [Number, String],
    default: 24
  },
  ariaLabel: {
    type: String,
    default: 'X-RayCare'
  },
  decorative: {
    type: Boolean,
    default: false
  }
})

const uid = `b${Math.random().toString(36).slice(2, 10)}`
const shieldGradId = `brandShield-${uid}`
const rimGradId = `brandShieldRim-${uid}`
</script>

<style scoped>
.brand-xray-mark {
  display: block;
  flex-shrink: 0;
}
</style>
