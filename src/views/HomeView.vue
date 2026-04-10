<template>
<!-- ======================================================================
// HEADER
// ==================================================================== -->
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Kalkulator Emerytalny</h1>
      <p class="text-gray-600 mt-2">Sprawdź, ile musisz odkładać, aby zrealizować swój plan emerytalny.</p>
    </div>
<!-- =======================================================================
// FORM
// ====================================================================== -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <div class="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
        <h2 class="text-xl font-semibold text-gray-800 mb-6">Parametry symulacji</h2>
        
        <form class="space-y-6" @submit.prevent>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Roczna wypłata emerytalna</label>
              <div class="relative">
                <input 
                  type="number" 
                  min="1"
                  v-model.number="pmtOut"
                  :class="[
                    isAmountInvalid 
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500 ring-1 ring-red-500' 
                      : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500',
                    'block w-full pl-3 pr-12 py-2.5 rounded-lg bg-gray-50 border transition-colors outline-none'
                  ]"
                  placeholder="np. 5000"
                >
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span :class="[isAmountInvalid ? 'text-red-500' : 'text-gray-500', 'sm:text-sm font-bold']">PLN</span>
                </div>
              </div>
              <p v-if="isAmountInvalid" class="mt-2 text-sm text-red-600 font-medium animate-pulse">
                Kwota wypłaty musi być większa od 0.
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Liczba lat pobierania emerytury</label>
              <div class="relative">
                <input 
                  type="number" 
                  min="1"
                  step="1"
                  v-model.number="nOut"
                  :class="[
                    isRetirementYearsInvalid 
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500 ring-1 ring-red-500' 
                      : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500',
                    'block w-full pl-3 pr-12 py-2.5 rounded-lg bg-gray-50 border transition-colors outline-none'
                  ]"
                  placeholder="np. 25"
                >
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span :class="[isRetirementYearsInvalid ? 'text-red-500' : 'text-gray-500', 'sm:text-sm font-bold']">lat</span>
                </div>
              </div>
              <p v-if="isRetirementYearsInvalid" class="mt-2 text-sm text-red-600 font-medium animate-pulse">
                Czas pobierania emerytury to minimum 1 rok.
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Liczba lat oszczędzania</label>
              <div class="relative">
                <input 
                  type="number" 
                  min="1"
                  step="1"
                  v-model.number="nIn"
                  :class="[
                    isSavingYearsInvalid 
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500 ring-1 ring-red-500' 
                      : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500',
                    'block w-full pl-3 pr-12 py-2.5 rounded-lg bg-gray-50 border transition-colors outline-none'
                  ]"
                  placeholder="np. 45"
                >
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span :class="[isSavingYearsInvalid ? 'text-red-500' : 'text-gray-500', 'sm:text-sm font-bold']">lat</span>
                </div>
              </div>
              <p v-if="isSavingYearsInvalid" class="mt-2 text-sm text-red-600 font-medium animate-pulse">
                Czas oszczędzania to minimum 1 rok.
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Stopa zwrotu z inwestycji</label>
              <div class="relative">
                <input 
                  type="number" 
                  step="0.1"
                  min="0"
                  max="100"
                  v-model.number="rate"
                  :class="[
                    isRateInvalid 
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500 ring-1 ring-red-500' 
                      : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500',
                    'block w-full pl-3 pr-12 py-2.5 rounded-lg bg-gray-50 border transition-colors outline-none'
                  ]"
                  placeholder="0"
                >
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span :class="[isRateInvalid ? 'text-red-500' : 'text-gray-500', 'sm:text-sm text-gray-500 font-bold']">%</span>
                </div>
              </div>
              <p v-if="isRateInvalid" class="mt-2 text-sm text-red-600 font-medium animate-pulse">
                Wartość musi być w przedziale 0 - 100%
              </p>
            </div>

          </div>

          <hr class="border-gray-200">

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">Dokonywanie wpłat (oszczędzanie)</label>
              <div class="space-y-3">
                <label class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors" :class="{'border-indigo-500 bg-indigo-50/50': saveMode === 'start'}">
                  <input type="radio" v-model="saveMode" value="start" class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300">
                  <span class="ml-3 block text-sm font-medium text-gray-900">Z góry (Początek roku)</span>
                </label>
                <label class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors" :class="{'border-indigo-500 bg-indigo-50/50': saveMode === 'end'}">
                  <input type="radio" v-model="saveMode" value="end" class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300">
                  <span class="ml-3 block text-sm font-medium text-gray-900">Z dołu (Koniec roku)</span>
                </label>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">Wypłacanie emerytury</label>
              <div class="space-y-3">
                <label class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors" :class="{'border-indigo-500 bg-indigo-50/50': payoutMode === 'start'}">
                  <input type="radio" v-model="payoutMode" value="start" class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300">
                  <span class="ml-3 block text-sm font-medium text-gray-900">Z góry (Początek roku)</span>
                </label>
                <label class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors" :class="{'border-indigo-500 bg-indigo-50/50': payoutMode === 'end'}">
                  <input type="radio" v-model="payoutMode" value="end" class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300">
                  <span class="ml-3 block text-sm font-medium text-gray-900">Z dołu (Koniec roku)</span>
                </label>
              </div>
            </div>

          </div>
        </form>
      </div>
<!--=========================================================================
// RESULTS
// ====================================================================== -->
      <div class="bg-indigo-900 rounded-xl shadow-lg p-6 md:p-8 text-white h-full sticky top-8">
        <!-- <h2 class="text-lg font-medium text-indigo-100 mb-6">Podsumowanie</h2> -->
        <div class="flex items-center justify-center mt-6 mb-8">
          <span class="material-symbols-outlined 
                      text-indigo-600 
                      text-6xl!
                      align-middle
                      [font-variation-settings:'FILL'_0,'wght'_400,'GRAD'_0,'opsz'_24]">
            account_balance_wallet
          </span>
        </div>
        
        <div class="space-y-8">
          <div>
            <p class="text-sm text-indigo-200 mb-1">Kapitał docelowy (PV)</p>
            <p class="text-4xl font-bold">{{ formattedPV }} <span class="text-xl font-normal opacity-75">PLN</span></p>
            <p class="text-xs text-indigo-200 mt-2">Tyle musisz zgromadzić do pierwszego dnia emerytury.</p>
          </div>

          <div class="border-t border-indigo-400/30"></div>

          <div>
            <p class="text-sm text-indigo-200 mb-1">Roczna składka (PMT)</p>
            <p class="text-4xl font-bold text-green-300">{{ formattedPMT }} <span class="text-xl font-normal opacity-75 text-white">PLN</span></p>
            <p class="text-xs text-indigo-200 mt-2">Tyle musisz odkładać co roku, aby zrealizować cel.</p>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { useCalculatorStore } from '@/stores/calculatorStore'
import { storeToRefs } from 'pinia'
import { computed } from 'vue' // usunąłem ref, bo nie będzie już potrzebny dla wyników

// 1. Podpięcie Pinii
const store = useCalculatorStore()
const { 
  pmtOut, nOut, nIn, rate, saveMode, payoutMode, 
  targetPV, yearlyContribution 
} = storeToRefs(store)

// 2. Formatowanie wyników
// To narzędzie zamieni liczbę na tekst z przecinkami i spacjami
const formatter = new Intl.NumberFormat('pl-PL', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})

const formattedPV = computed(() => formatter.format(targetPV.value))
const formattedPMT = computed(() => formatter.format(yearlyContribution.value))

// #region WALIDACJA (LOGIKA)
const isRateInvalid = computed(() =>  rate.value < 0 || rate.value > 100);
const isAmountInvalid = computed(() => pmtOut.value <= 0);
const isRetirementYearsInvalid = computed(() => nOut.value < 1);
const isSavingYearsInvalid = computed(() => nIn.value < 1);
// #endregion
</script>


