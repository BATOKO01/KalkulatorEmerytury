<template>
  <Disclosure as="nav" class="relative bg-indigo-900 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10" v-slot="{ open }">
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="relative flex h-16 items-center justify-between">
        <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
          
          <DisclosureButton class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500">
            <span class="absolute -inset-0.5"></span>
            <span class="sr-only">Otwórz główne menu</span>
            <Bars3Icon v-if="!open" class="block size-6" aria-hidden="true" />
            <XMarkIcon v-else class="block size-6" aria-hidden="true" />
          </DisclosureButton>
        </div>
        
        <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
          <div class="flex shrink-0 items-center">
            <img class="h-8 w-auto" src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500" alt="Kalkulator" />
            <span class="ml-3 text-white font-bold hidden sm:block">Moja Emerytura</span>
          </div>
          
          <div class="hidden sm:ml-6 sm:block">
            <div class="flex space-x-4">
              <RouterLink 
                v-for="item in navigation" 
                :key="item.name" 
                :to="item.to" 
                :class="[route.path === item.to ? 'bg-gray-950/50 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white', 'rounded-md px-3 py-2 text-sm font-medium transition-colors']" 
                :aria-current="route.path === item.to ? 'page' : undefined"
              >
                {{ item.name }}
              </RouterLink>
            </div>
          </div>
        </div>
        
      </div>
    </div>

    <DisclosurePanel class="sm:hidden">
      <div class="space-y-1 px-2 pt-2 pb-3">
        <DisclosureButton 
          v-for="item in navigation" 
          :key="item.name" 
          as="template"
        >
          <RouterLink
            :to="item.to"
            :class="[route.path === item.to ? 'bg-gray-950/50 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white', 'block rounded-md px-3 py-2 text-base font-medium transition-colors']"
          >
            {{ item.name }}
          </RouterLink>
        </DisclosureButton>
      </div>
    </DisclosurePanel>
  </Disclosure>
</template>

<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { RouterLink, useRoute } from 'vue-router'

// Pobieramy informacje o aktualnej ścieżce z Vue Routera
const route = useRoute()

// Definiujemy nasze zakładki (zamiast href jest 'to', brak twardego 'current')
const navigation = [
  { name: 'Home', to: '/' },
  { name: 'Autorzy', to: '/authors' },
]
</script>