<template>
  <VContainer id="result">
    <p v-if="loadflag" class="empty-table">Loading...</p>

    <v-card
      v-else-if="!(Object.keys(result).length === 0 && result.constructor === Object)"
      id="card-result"
      :elevation="params.elevation"
      :color="params.color"
    >
      <v-card-title class="headline" v-text="result.address" />
      <v-row class="mb-6" no-gutters cols="12">
        <v-col cols="3" class="property-col">
          <structure-info :structure="result.structureInfo" />
        </v-col>
        <v-col cols="3">
          <neighboor-info :neighboor="result.neighboorInfo" />
          <owner-info :owner="result.ownerInfo" />
        </v-col>
        <v-col cols="6'">
          <sell-info :sellhistory="result.saleHistory" />
          <sell-info-table :sellhistory="result.saleHistory" />
        </v-col>
      </v-row>

      <v-row class="mb-6" no-gutters>
        <comparable-info :comparablesales="comparablesales" />
      </v-row>
    </v-card>
  </VContainer>
</template>

<script>
import StructureInfo from "./parts/StructureInfo.vue";
import SellInfo from "./parts/SellInfo.vue";
import SellInfoTable from "./parts/SellInfoTable.vue";
import NeighboorInfo from "./parts/NeighboorInfo.vue";
import OwnerInfo from "./parts/OwnerInfo.vue";
import ComparableInfo from "./parts/ComparableInfo.vue";

var constants = require("./../../utils/Constants.js");

export default {
  name: "Result",
  components: {
    StructureInfo,
    SellInfo,
    SellInfoTable,
    NeighboorInfo,
    ComparableInfo,
    OwnerInfo
  },
  props: {
    result: Object,
    comparablesales: Object,
    loadflag: Boolean
  },
  data() {
    return {
      params: { elevation: "4", color: constants.CARD_BACKGROUND_COLOR }
    };
  },
  methods: {}
};
</script>

<style>
.property-wrapper {
  padding-right: 20px;
  padding-left: 20px;
}
.label {
  font-weight: bold;
}
.label-wrapper {
  text-align: left;
}
.card-wrapper {
  background: "#ECFAC9";
}
</style>