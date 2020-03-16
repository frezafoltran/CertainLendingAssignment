import {
    Line,
    mixins
} from "vue-chartjs"

export default {
    extends: Line,
    mixins: [mixins.reactiveProp],
    props: ["chartData", "options"],
    data() {
        return {
            chartoptions: {
                scales: {
                    yAxes: [{

                        gridLines: {
                            display: false,

                        }
                    }],
                    xAxes: [{
                        gridLines: {
                            display: false,

                        }
                    }]
                },
                legend: {
                    display: true
                },
                responsive: true,
                maintainAspectRatio: false
            }
        }
    },
    mounted() {
        this.renderChart(this.chartdata, this.options)
    }
}