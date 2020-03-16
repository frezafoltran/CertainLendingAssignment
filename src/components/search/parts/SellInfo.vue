<template>
  <v-container id="sell-info">
    <v-card style="background:#EEEEEC" elevation="5">
      <v-card-title>
        <div>Resale Price History</div>

        <v-spacer />
      </v-card-title>
      <v-row no-gutters>
        <v-col cols="6">
          <chart :chart-data="datacollection" />
        </v-col>
        <v-col cols="5">
          <div>
            <v-card align="center" justify="center" class="pa-2" tile>
              <v-row
                class="label"
                style="padding-left:3px;padding-right:3px"
              >Price Change Over all Recorded Resales</v-row>
              <v-row no-gutters align="center" justify="center">
                <p>{{ 100*overallPriceChange }}%</p>
              </v-row>
            </v-card>
            <v-card align="center" justify="center" class="pa-2" tile>
              <v-row
                class="label"
                style="padding-left:3px;padding-right:3px"
              >Price Change over last Two Resales</v-row>
              <v-row no-gutters align="center" justify="center">
                <p>{{ 100*recentPriceChange }}%</p>
              </v-row>
            </v-card>
          </div>
        </v-col>
      </v-row>
      <v-row align="center" justify="center" style="padding-bottom:10px">
        <VBtn
          v-if="sq_visible"
          text
          class="success mx-0 mt-3"
          @click="switchDisplay"
        >Show price per square foot</VBtn>
        <VBtn v-else text class="success mx-0 mt-3" @click="switchDisplay">Show total price</VBtn>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import Chart from "./../../../utils/LineChart.js";

export default {
  name: "SellInfo",
  components: {
    Chart
  },
  props: {
    sellhistory: Object
  },
  data() {
    return {
      datacollection: null,
      sq_visible: true,
      overallPriceChange: this.sellhistory.overallChange,
      recentPriceChange: this.sellhistory.recentChange
    };
  },
  mounted() {
    this.fillData(this.sellhistory.chart.total);
  },
  methods: {
    fillData(chartData) {
      this.datacollection = chartData;
    },
    switchDisplay() {
      if (this.sq_visible) {
        this.sq_visible = false;
        this.fillData(this.sellhistory.chart.perSqFoot);
      } else {
        this.sq_visible = true;
        this.fillData(this.sellhistory.chart.total);
      }
    }
  }
};
</script>