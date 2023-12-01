<script lang="ts">
export default {
  name: "Test",
};
</script>
<script setup lang="ts">
import { defineProps } from "vue";

console.log("Test script setup");

defineProps({
  id: String,
  q: Boolean,
  aa: Boolean,
  bb: Boolean,
});
</script>
<template>
  <div>
    {{ id || "null" }}
  </div>
</template>
