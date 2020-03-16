<template>
  <VContainer id="neighboor-info">
    <v-card style="background:#EEEEEC" elevation="5">
      <v-card-title>Neighboorhood Info</v-card-title>
      <v-col class="label-wrapper">
        <v-card class="pa-2" tile>
          <span class="label">Zoning Type:</span>
          {{ neighboor.zoningType }}
        </v-card>

        <v-card class="pa-2" tile>
          <span class="label">City:</span>
          {{ neighboor.city }}
        </v-card>

        <v-card class="pa-2" tile>
          <span class="label">County:</span>
          {{ neighboor.county }}
        </v-card>
      </v-col>
    </v-card>
  </VContainer>
</template>

<script>
import { mdiBedOutline } from "@mdi/js";

export default {
  name: "NeighboorInfo",
  props: {
    neighboor: Object
  },
  data() {
    return {};
  },
  methods: {}
};
</script>
