<template>
  <div class="small">
    <router-view :key="viewKey" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { hospitalScopeVersion } from './hospitalScope'

const route = useRoute()
const viewKey = computed(() => `${route.path}-${hospitalScopeVersion.value}`)
</script>