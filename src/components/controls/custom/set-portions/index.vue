<script lang="ts">
import CButton from "@/components/controls/buttons/button/index.vue";
import CInput from "@/components/controls/inputs/input/index.vue";

export default {
  name: "CSetPortions",
  components: { CButton, CInput },
};
</script>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  modelValue: {
    type: Number,
    default: 2,
  },
  enableInput: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: "medium",
    validator: (value: string) => {
      return ["small", "medium", "large"].indexOf(value) !== -1;
    },
  },
  variant: {
    type: String,
    default: "text",
    validator: (value: string) => {
      return ["contained", "outlined", "text"].indexOf(value) !== -1;
    },
  },
});

const emit = defineEmits<{
  (e: "update:modelValue", portions: number): void;
}>();

const portions = computed({
  get(): number {
    return props.modelValue;
  },
  set(portions: number) {
    if (!portions || portions < 1) {
      return emit("update:modelValue", 1);
    }
    emit("update:modelValue", portions);
  },
});
</script>

<template src="./template.html"></template>
<style src="./style.scss" lang="scss" scoped></style>
