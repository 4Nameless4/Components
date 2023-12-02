<script lang="ts">
export default {
  name: "Test",
  beforeRouteEnter(to, from) {
    console.log(to);
    console.log(from);
    // setTimeout(() => {
    //   next((vm) => {
    //       console.log(vm);
    //   });
    // }, 5000);
    // return false
  },
  data: () => {
    return {
      at: 1,
    };
  },
  expose: ["at"],
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
    {{ "Test" }}
  </div>
</template>
