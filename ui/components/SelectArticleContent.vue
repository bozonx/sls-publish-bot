<script setup>
import { resolveSocialMediaId } from "../lib/helpers.js";

const userConfig = useState("userConfig");
const props = defineProps(["blogId", "nextStepUrl"]);

const value = ref("");
</script>

<template>
  <div>
    <InputText type="text" v-model="value" />
  </div>

  <div>
    <SmartButton :to="`${props.nextStepUrl}&article=${encodeURIComponent(value)}`" :label="$t('doSelect')" />
  </div>
</template>
