import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCalculatorStore = defineStore('calculator', () => {
  // #region STATE (Dane z formularza)
  const pmtOut = ref(5000)      // Ile chcę wypłacać rocznie
  const nOut = ref(25)          // Ile lat na emeryturze
  const nIn = ref(45)           // Ile lat oszczędzania
  const rate = ref(5)           // Stopa zwrotu w %
  const saveMode = ref('end')   // 'start' (z góry) lub 'end' (z dołu)
  const payoutMode = ref('end') // 'start' (z góry) lub 'end' (z dołu)
  // #endregion

  // #region WALIDACJA ZBIORCZA
    const isFormValid = computed(() => {
    return (
        pmtOut.value > 0 &&          // Wypłata musi być dodatnia
        nOut.value >= 1 &&           // Min. 1 rok emerytury
        nIn.value >= 1 &&            // Min. 1 rok oszczędzania
        rate.value >= 0 &&           // Stopa nie może być ujemna
        rate.value <= 100            // Stopa nie może być kosmiczna
    );
    });
// #endregion

  // #region GETTERS (Obliczenia matematyczne)
  
  // Pomocnicza: r jako ułamek (np. 0.05 zamiast 5%)
  const r = computed(() => rate.value / 100)

  // 1. Obliczanie Kapitału Docelowego (PV)
  const targetPV = computed(() => {
    if (!isFormValid.value) return 0; //alidacja zbiorcza
    if (r.value === 0) return pmtOut.value * nOut.value
    
    // Wzór na wartość bieżącą zwykłego annuity:
    // $$PV = P \times \frac{1 - (1 + r)^{-n}}{r}$$
    let pv = pmtOut.value * ((1 - Math.pow(1 + r.value, -nOut.value)) / r.value)
    
    // Jeśli wypłaty z góry, mnożymy przez (1 + r)
    if (payoutMode.value === 'start') {
      pv *= (1 + r.value)
    }
    
    return pv
  })

  // 2. Obliczanie Rocznej Składki (PMT)
  const yearlyContribution = computed(() => {
    if (!isFormValid.value || targetPV.value === 0) return 0; // Walidacja zbiorcza
    const fv = targetPV.value // Nasz kapitał docelowy to FV dla okresu oszczędzania
    if (r.value === 0) return fv / nIn.value

    // Wzór na roczną wpłatę (z dołu):
    // $$P = FV \times \frac{r}{(1 + r)^n - 1}$$
    let pmt = fv * (r.value / (Math.pow(1 + r.value, nIn.value) - 1))

    // Jeśli wpłaty z góry, dzielimy przez (1 + r)
    if (saveMode.value === 'start') {
      pmt /= (1 + r.value)
    }

    return pmt
  })
  // #endregion

  return {
    pmtOut, nOut, nIn, rate, saveMode, payoutMode,
    targetPV, yearlyContribution
  }
})