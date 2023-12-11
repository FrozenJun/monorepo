<template>
  <div class="about">
    <h1 @click="getRole">This is an about page</h1>
  </div>
</template>

<script setup lang="ts">
import { roleApiService } from '@/api/role'

console.log(111)
async function getRole() {
  const res = await roleApiService.get()
  console.log(res)
}

getRole()
</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
