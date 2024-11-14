<template>
  <v-card class="pa-3" min-width="280">
    <div class="d-flex justify-space-between">
      <v-card-title>{{ name }}</v-card-title>
      <v-icon
        class="pe-6 pt-6"
        :color="'primary'"
        :icon="icon"
        size="20"
      ></v-icon>
    </div>

    <v-card-text class="py-0">
      <v-row align="center" no-gutters>
        <v-col class="text-h5" cols="6">{{ aggregate }}</v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
const { name, aggregate, icon } = defineProps(["name", "aggregate", "icon"]);
</script>
