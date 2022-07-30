<template>
  <div>
    <h3>Store:</h3>
    <div>{{ store.getField }}</div>
  </div>
</template>

<script setup type="ts">
import { useStore } from '@/store'
const store = useStore()
store.init()
</script>
