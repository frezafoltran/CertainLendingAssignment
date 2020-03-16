<template>
  <VContainer id="structure-info">
    <v-card style="background:#EEEEEC" elevation="5">
      <v-card-title>
        <span>Property Details</span>
      </v-card-title>
      <v-col class="label-wrapper">
        <v-card class="pa-2" tile>
          <span class="label">Type:</span>
          {{ structure.propertyType }}
        </v-card>
        <v-card class="pa-2" tile>
          <span class="label">Built in:</span>
          {{ structure.yearBuilt }}
        </v-card>
        <v-card class="pa-2" tile>
          <span class="label">Condition:</span>
          {{ structure.condition }}
        </v-card>

        <v-card class="pa-2" tile>
          <v-icon>mdi-bed</v-icon>
          {{ structure.beds }}
        </v-card>

        <v-card class="pa-2" tile>
          <v-icon>mdi-toilet</v-icon>
          {{ structure.baths }}
        </v-card>

        <v-card class="pa-2" tile>
          <v-icon>mdi-home-circle</v-icon>
          {{ structure.livingAreaSqFeet }}
          sq ft
        </v-card>

        <v-card class="pa-2" tile>
          <v-icon>mdi-parking</v-icon>
          {{ structure.extraInfo.parkingSpots }}
        </v-card>

        <v-card class="pa-2" tile>
          <v-icon>mdi-hvac</v-icon>
          {{ structure.extraInfo.heating }}
        </v-card>

        <v-card class="pa-2" tile>
          <v-icon>mdi-coolant-temperature</v-icon>
          {{ structure.extraInfo.cooling }}
        </v-card>
      </v-col>
    </v-card>
  </VContainer>
</template>

<script>
import { mdiBedOutline } from "@mdi/js";

export default {
  name: "StructureInfo",
  props: {
    structure: Object
  },
  data() {
    return {};
  },
  methods: {}
};
</script>
