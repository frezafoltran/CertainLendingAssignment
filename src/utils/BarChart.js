import {
    Bar,
    mixins
} from "vue-chartjs"

export default {
    extends: Bar,
    mixins: [mixins.reactiveProp],
    props: ["chartData", "options"],
    data() {
        return {
            chartoptions: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: false
                        },
                        gridLines: {
                            display: false
                        }
                    }],
                    xAxes: [{
                        gridLines: {
                            display: false
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