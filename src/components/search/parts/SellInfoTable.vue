<template>
  <v-container id="sell-info-table">
    <v-card style="background:#EEEEEC" elevation="5">
      <v-data-table
        style="background:#EEEEEC"
        elevation="5"
        :headers="headers"
        :items="sellhistory.table"
        :items-per-page="3"
      />
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "SellInfoTable",
  props: {
    sellhistory: Object
  },
  data() {
    return {
      headers: [
        {
          text: "Transaction Date",
          align: "start",
          sortable: false,
          value: "date"
        },
        { text: "Sale Type", value: "saletype" },
        { text: "Amount ($)", value: "price" }
      ]
    };
  }
};
</script>