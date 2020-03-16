<template>
  <VContainer id="comparable-info">
    <v-card style="background:#EEEEEC" elevation="5">
      <v-card-title>
        <span>Price Distribution for Comparable Houses</span>

        <v-spacer />
      </v-card-title>
      <v-row no-gutters>
        <v-col cols="5">
          <chart :chart-data="datacollection" />
        </v-col>
        <v-col cols="5">
          <div class="graph-settings">
            <v-card align="center" justify="center" class="pa-2" tile>
              <v-row align="center" justify="center" class="label">Adjust Price Bin Size</v-row>
              <v-row no-gutters align="center" justify="center" style="padding-bottom:20px">
                <VBtn text class="success mx-0 mt-3" @click="decreaseIncrement">-</VBtn>

                <span
                  v-if="curIncrement > 1000"
                  style="padding-left:6px;padding-right:6px;"
                >${{ curIncrement/1000 }}K</span>
                <span v-else style="padding-left:6px;padding-right:6px;">${{ curIncrement }}</span>
                <VBtn text class="success mx-0 mt-3" @click="increaseIncrement">+</VBtn>
              </v-row>

              <v-row align="center" justify="center" class="label">Adjust Comparison Radius</v-row>
              <v-row no-gutters align="center" justify="center">
                <span id="r1">
                  <VBtn text class="success mx-0 mt-3" @click="setRadius(1)">1 mile</VBtn>
                </span>
                <span id="r5" style="opacity:0.5;">
                  <VBtn text class="success mx-0 mt-3" @click="setRadius(5)">5 miles</VBtn>
                </span>
                <span id="r10">
                  <VBtn text class="success mx-0 mt-3" @click="setRadius(10)">10 miles</VBtn>
                </span>
              </v-row>

              <v-row no-gutters align="center" justify="center" style="padding-top:20px">
                <v-col cols="12">
                  <span class="label">Price Range:</span>
                  {{ min }} - {{ max }}
                </v-col>
              </v-row>

              <v-row no-gutters align="center" justify="center" style="padding-top:20px;">
                <v-col cols="12">
                  <span class="label">Average Price:</span>
                  {{ avg }}
                </v-col>
              </v-row>
              <v-row
                no-gutters
                align="center"
                justify="center"
                style="padding-top:20px;padding-bottom:20px"
              >
                <v-col cols="12">
                  <span class="label">Total Count of Properties:</span>
                  {{ count }}
                </v-col>
              </v-row>

              <VBtn
                v-if="sq_visible"
                text
                class="success mx-0 mt-3"
                @click="switchDisplay"
              >Show price per square foot</VBtn>
              <VBtn v-else text class="success mx-0 mt-3" @click="switchDisplay">Show total price</VBtn>

              <v-row />
            </v-card>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </VContainer>
</template>
<script>
import Chart from "./../../../utils/BarChart.js";
import { buildChartData } from "./../../../utils/ParsingHelpers.js";

var constants = require("./../../../utils/Constants.js");

export default {
  components: {
    Chart
  },
  props: {
    comparablesales: Object
  },
  data() {
    return {
      radius: "5",
      datacollection: null,
      sq_visible: true,
      curIncrement: constants.INCREMENT_TOTAL,
      curIncrementStep: constants.INCREMENT_STEP_TOTAL,
      displayData: "total",
      min: this.comparablesales["5"].chartData.stats.min,
      max: this.comparablesales["5"].chartData.stats.max,
      avg: this.comparablesales["5"].chartData.stats.avg,
      count: this.comparablesales["5"].chartData.stats.count
    };
  },
  mounted() {
    this.fillData(this.comparablesales[this.radius].chartData);
  },
  methods: {
    fillData(chartData) {
      this.datacollection = chartData;
    },
    increaseIncrement() {
      /**
       * Handles user request to increase the bin size. newIncrement is
       * capped to avoid graph displaying not useful info/incorreclty parse.
       */
      var newIncrement = Math.min(
        constants.MAX_INCREMENT,
        this.curIncrement + this.curIncrementStep
      );
      this.curIncrement = newIncrement;
      this.updateStats(true);
    },

    decreaseIncrement() {
      /**
       * Handles user request to decrease the bin size. newIncrement is
       * capped to avoid graph displaying not useful info/incorreclty parse.
       */
      var newIncrement = Math.max(
        this.curIncrementStep,
        this.curIncrement - this.curIncrementStep
      );
      this.curIncrement = newIncrement;
      this.updateStats(true);
    },
    setRadius(newRadius) {
      /**
       * Sets new radius range for comparable houses and updates Chart
       */
      this.radius = newRadius.toString();
      document.getElementById("r1").style.opacity =
        newRadius == 1 ? "0.5" : "1";

      document.getElementById("r5").style.opacity =
        newRadius == 5 ? "0.5" : "1";

      document.getElementById("r10").style.opacity =
        newRadius == 10 ? "0.5" : "1";

      this.updateStats(true);
    },
    switchDisplay() {
      /**
       * Switched display between total price and price pre sq foot
       */
      if (this.displayData.localeCompare("total") == 0) {
        this.sq_visible = false;
        this.displayData = "perSquareFoot";
        this.curIncrementStep = constants.INCREMENT_STEP_PER_SQ;
        this.curIncrement = constants.INCREMENT_PER_SQ;
      } else {
        this.sq_visible = true;
        this.displayData = "total";
        this.curIncrementStep = constants.INCREMENT_STEP_TOTAL;
        this.curIncrement = constants.INCREMENT_TOTAL;
      }

      this.updateStats(true);
    },
    updateStats(updateDataCollection) {
      if (updateDataCollection) {
        this.datacollection = buildChartData(
          this.comparablesales[this.radius].prices[this.displayData],
          this.curIncrement
        );
      }
      this.min = this.datacollection.stats.min;
      this.max = this.datacollection.stats.max;
      this.avg = this.datacollection.stats.avg;
      this.count = this.datacollection.stats.count;
    }
  }
};
</script>

<style scoped>
.graph-settings {
  padding-left: 30px;
}
</style>