import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: "#432B59",
        secondary: "#F2F2F2",
        accent: "#EC9E92",
        error: "#D1001A",
        success: "#23947A",
        info: "#2196F3",
        warning: "#FFC107"
      },
    },
  },
});
