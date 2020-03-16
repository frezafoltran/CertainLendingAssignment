<template>
  <VContainer id="owner-info">
    <v-card style="background:#EEEEEC" elevation="5">
      <v-card-title>Owner Info</v-card-title>
      <v-col class="label-wrapper">
        <v-card class="pa-2" tile>
          <span class="label">Owner Type:</span>
          {{ owner.type }}
        </v-card>

        <v-card class="pa-2" tile>
          <span class="label">Owner Name:</span>
          {{ owner.name }}
        </v-card>
      </v-col>
    </v-card>
  </VContainer>
</template>

<script>
import { mdiBedOutline } from "@mdi/js";

export default {
  name: "OwnerInfo",
  props: {
    owner: Object
  },
  data() {
    return {};
  },
  methods: {}
};
</script>
