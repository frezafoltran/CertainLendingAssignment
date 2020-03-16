<template id="app">
  <VContainer>
    <v-row class="text-center">
      <v-row
        class="label"
        no-gutters
        align="center"
        justify="center"
      >Select an address below to see information about the property</v-row>
      <VCol cols="12">
        <VForm ref="form">
          <v-select
            ref="propertyselect"
            v-model="defaultProperty"
            :items="properties"
            menu-props="auto"
            label="Select a Property"
            hide-details
            single-line
            @input="changeVal"
          />
        </VForm>

        <result :comparablesales="comparableSales" :result="curProperty" :loadflag="startedSearch" />
      </VCol>
    </v-row>
  </VContainer>
</template>

<script>
import axios from "axios";
import Result from "@/components/search/Result.vue";
import {
  getSalesComparableURL,
  getExpandedInfoURL,
  getSaleHistoryURL
} from "../utils/AttomUtil.js";

import {
  parsePropertyData,
  parseComparableData
} from "../utils/ParsingHelpers.js";

import Vue from "vue";

var constants = require("./../utils/Constants.js");

export default {
  name: "Main",
  components: {
    Result
  },
  data() {
    return {
      // URL and apikey values for GET calls to Attom
      attomRequests: {
        salesComparableReq: { "1": {}, "5": {}, "10": {} },
        expendedInfoReq: {},
        saleHistoryByIdReq: {}
      },
      //Stores data from primary property user requests
      curProperty: {},

      //Stores data for comparable properties to curProperty
      comparableSales: { "1": {}, "5": {}, "10": {} },
      expandedInfo: {},

      //Selector variables
      properties: constants.ALL_PROPERTIES,
      defaultProperty: {},
      mainProperty: constants.ALL_PROPERTIES[0],
      startedSearch: false
    };
  },
  methods: {
    changeVal(defaultProperty) {
      /**
       * This function hanldes chnages in the selector automatically and requests the newly
       * selected property from Attom.
       *
       * @param {Object} defaultProperty is the currently seletced property.
       */

      //Refresh property data (also makes sure loading message is shown as user waits for new data)
      this.startedSearch = true;
      this.curProperty = {};
      this.comparableSales = { "1": {}, "5": {}, "10": {} };
      this.expandedInfo = {};

      //Get needed URL and apikey
      this.attomRequests.salesComparableReq = getSalesComparableURL(
        defaultProperty
      );
      this.attomRequests.expendedInfoReq = getExpandedInfoURL(defaultProperty);
      this.attomRequests.saleHistoryByIdReq = getSaleHistoryURL(
        defaultProperty
      );

      this.requestAttom("1");
    },
    requestSalesInfo() {
      /**
       * Requests sale history data from Attom and parses info into Property object
       */

      axios
        .get(this.attomRequests.saleHistoryByIdReq.url, {
          headers: {
            accept: "application/json",
            apikey: this.attomRequests.saleHistoryByIdReq.key
          }
        })
        .then(response => {
          this.curProperty = parsePropertyData(
            response.data,
            this.expandedInfo
          );
          this.startedSearch = false; //indicates search is done
        })
        .catch(e => {
          //console.log(e);
        });
    },
    requestExpandedInfo() {
      /**
       * Requests property info data from Attom and saves into prop for later use.
       * Calls back axios to request sales info.
       */
      axios
        .get(this.attomRequests.expendedInfoReq.url, {
          headers: {
            accept: "application/json",
            apikey: this.attomRequests.expendedInfoReq.key
          }
        })
        .then(response => {
          this.expandedInfo = response.data;
          this.requestSalesInfo();
        })
        .catch(e => {
          //console.log(e);
        });
    },
    requestAttom(curRadius) {
      /**
       * This function requests comparable sales data from Attom. It does so
       * for radius 1, 5 and 10. Then it call axios to request remaining info.
       *
       * @param {String} curRadius is the parameter for the GET call that
       * indicates the current radius range for comparable properties
       */
      axios
        .get(this.attomRequests.salesComparableReq[curRadius].url, {
          headers: {
            accept: "application/json",
            apikey: this.attomRequests.salesComparableReq[curRadius].key
          }
        })
        .then(response => {
          this.comparableSales[curRadius] = parseComparableData(response.data);

          //make sure to call all desired radius values
          if (curRadius.localeCompare("1") == 0) {
            this.requestAttom("5");
          } else if (curRadius.localeCompare("5") == 0) {
            this.requestAttom("10");
          } else {
            this.requestExpandedInfo();
          }
        })
        .catch(e => {
          //console.log(e);
        });
    }
  }
};
</script>
