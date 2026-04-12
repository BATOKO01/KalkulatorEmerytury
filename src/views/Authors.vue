<template>
  <div class="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200">
    <h1 class="text-2xl font-bold text-gray-800 mb-4">Autorzy</h1>
    <p class="text-gray-600 mb-6">Projekt wykonali:</p>
    <ul class="list-disc list-inside space-y-2 text-gray-700">
      <li v-for="name in authors" :key="name">{{ name }}</li>
    </ul>
  </div>
</template>

<script setup>
const authors = [
  'Kinga Kulesza',
  'Bartosz Olejnik',
  'Szymon Pączyński',
  'Kuba Majka',
]
</script>
