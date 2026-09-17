<script setup>
import { ref, watch } from 'vue'
import { formatIndianNumber, parseIndianNumber } from '@/lib/billingMath'

const props = defineProps({
  modelValue: {
    type: [Number, String],
    default: '',
  },
  placeholder: {
    type: String,
    default: '0.00',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'change', 'blur', 'focus'])

const inputRef = ref(null)
const displayValue = ref('')
const isFocused = ref(false)

function syncFromProps(val) {
  if (val === '' || val === null || val === undefined) {
    displayValue.value = ''
    return
  }
  const parsed = parseIndianNumber(val)
  // If the parsed numeric value equals current display's parsed value, don't overwrite while focused
  if (isFocused.value && parseIndianNumber(displayValue.value) === parsed) {
    return
  }
  displayValue.value = formatIndianNumber(val)
}

watch(
  () => props.modelValue,
  (newVal) => syncFromProps(newVal),
  { immediate: true },
)

function handleInput(e) {
  const input = e.target
  const rawVal = input.value
  const cursor = input.selectionStart || 0

  // Count non-comma characters before the cursor
  const nonCommasBefore = rawVal.slice(0, cursor).replace(/,/g, '').length

  const formatted = formatIndianNumber(rawVal)
  displayValue.value = formatted
  input.value = formatted

  // Restore cursor position matching nonCommasBefore
  let newCursor = 0
  let count = 0
  for (let i = 0; i < formatted.length; i++) {
    if (count === nonCommasBefore) {
      newCursor = i
      break
    }
    if (formatted[i] !== ',') {
      count++
    }
    newCursor = i + 1
  }
  input.setSelectionRange(newCursor, newCursor)

  const num = parseIndianNumber(formatted)
  emit('update:modelValue', num)
}

function handleKeydown(e) {
  const input = e.target
  const start = input.selectionStart
  const end = input.selectionEnd

  // If user presses backspace immediately after a comma, delete the digit before the comma
  if (e.key === 'Backspace' && start === end && start > 1 && input.value[start - 1] === ',') {
    e.preventDefault()
    const before = input.value.slice(0, start - 2)
    const after = input.value.slice(start)
    const combined = before + after
    input.value = combined
    input.setSelectionRange(start - 2, start - 2)
    handleInput({ target: input })
  } else if (e.key === 'Delete' && start === end && input.value[start] === ',') {
    e.preventDefault()
    const before = input.value.slice(0, start)
    const after = input.value.slice(start + 2)
    const combined = before + after
    input.value = combined
    input.setSelectionRange(start, start)
    handleInput({ target: input })
  }
}

function onFocus(e) {
  isFocused.value = true
  emit('focus', e)
}

function onBlur(e) {
  isFocused.value = false
  if (displayValue.value.endsWith('.')) {
    displayValue.value = displayValue.value.slice(0, -1)
  }
  emit('blur', e)
  emit('change', parseIndianNumber(displayValue.value))
}
</script>

<template>
  <input
    ref="inputRef"
    type="text"
    inputmode="decimal"
    :value="displayValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :required="required"
    @input="handleInput"
    @keydown="handleKeydown"
    @focus="onFocus"
    @blur="onBlur"
  />
</template>
