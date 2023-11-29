<script lang="ts">
import { defineProps } from "vue";
import { useRouter, useRoute } from "vue-router";
export default {
  name: "Test",
};
</script>
<script setup lang="ts">
const props = defineProps({
  id: String,
  q: Boolean,
  aa: Boolean,
  bb: Boolean,
});
const router = useRouter();
const route = useRoute();
console.log(props);
console.log(router);
console.log(route.params);
</script>
<template>
  <div>
    {{ id || "null" }}
  </div>
</template>
