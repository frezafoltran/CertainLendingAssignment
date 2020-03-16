var constants = require("./Constants.js");

export default class Property {
    /**
     * Property is the main clas to organize the data for the property 
     * the user is currenlty looking at. It contains the fields:
     * 
     * @param {String} id unique identifier for property (parcel id in Attom)
     * @param {Object} saleHistory json containing sale history for main property
     * @param {Object} expandedInfo json containing extra info for main property
     */

    constructor(id, saleHistory, expandedInfo) {

        this.id = id;
        this.address = capitalize(expandedInfo.address.oneLine);

        this.structureInfo = this.buildStructuralInfo(expandedInfo);
        this.saleHistory = this.buildSalesHistory(saleHistory);

        this.neighboorInfo = this.buildNeighboorInfo(expandedInfo);
        this.ownerInfo = this.buildOwnerInfo(expandedInfo);
    }

    buildSalesHistory(response) {
        /**
         * Build the data table and chart objects to be displayed in SellInfo and SellInfoTable
         * components.
         * 
         * @param {Array} response response from Attom containing the sales information
         * for property
         */

        var out = {
            "overallChange": 0, "recentChange": 0,
            "table": [],
            "chart": {
                "total": {
                    "datasets": [{ "label": "", "backgroundColor": "", "data": [] }], "labels": []
                },
                "perSqFoot": {
                    "datasets": [{ "label": "", "backgroundColor": "", "data": [] }], "labels": []
                }
            }
        };

        out["chart"]["total"]["datasets"][0]["label"] = "Price (in $1,000s)";
        out["chart"]["total"]["datasets"][0]["backgroundColor"] = constants.CHART_COLOR;

        out["chart"]["perSqFoot"]["datasets"][0]["label"] = "Price per Sq Foot (in $)";
        out["chart"]["perSqFoot"]["datasets"][0]["backgroundColor"] = constants.CHART_COLOR;

        for (var i = response.length - 1; i >= 0; i--) {

            var cur = response[i];

            if (cur.amount.saleAmt > 0) {


                out["chart"]["total"]["labels"].push(cur.amount.saleRecDate);
                out["chart"]["total"]["datasets"][0]["data"].push((cur.amount.saleAmt / 1000).toFixed(2));

                out["chart"]["perSqFoot"]["labels"].push(cur.amount.saleRecDate);

                var pricePerSq = cur.amount.saleAmt / this.structureInfo.livingAreaSqFeet;
                out["chart"]["perSqFoot"]["datasets"][0]["data"].push(pricePerSq.toFixed(2));
            }

            out.table.unshift({
                "date": cur.amount.saleRecDate,
                "saletype": cur.amount.saleTransType,
                "price": cur.amount.saleAmt
            });
        }

        var vals = out["chart"]["total"]["datasets"][0]["data"];
        if (vals.length >= 2) {

            out["overallChange"] = (
                (vals[vals.length - 1] - vals[0]) /
                vals[0]
            ).toFixed(2);

            out["recentChange"] = (
                (vals[vals.length - 1] - vals[vals.length - 2]) /
                vals[vals.length - 2]
            ).toFixed(2);
        }

        return out;
    }

    buildOwnerInfo(expandedResponse) {
        /**
         * Builds the object containing info displayed in OwnerInfo component
         * @param {Object} expandedResponse parsed Attom response
         */
        var out = { "name": "N/A", "type": "N/A" };

        out.type = expandedResponse.summary.absenteeInd;
        out.name = expandedResponse.assessment.owner.owner1.lastName;
        return out;

    }

    buildNeighboorInfo(expandedResponse) {
        /**
         * Builds the object containing info displayed in NeighboorInfo component
         * @param {Object} expandedResponse parsed Attom response
         */
        var out = {
            "zoningType": "N/A",
            "city": "N/A",
            "county": "N/A",
        };

        out.zoningType = expandedResponse.lot.zoningType;
        out.city = expandedResponse.address.locality;
        out.county = expandedResponse.area.munName;

        return out;

    }

    buildStructuralInfo(expandedResponse) {
        /**
         * Builds the object containing info displayed in StructuralInfo component
         * @param {Object} expandedResponse parsed Attom response
         */

        var out = {
            propertyType: "N/A",
            yearBuilt: "N/A",
            condition: "N/A",
            baths: "0",
            beds: "0",
            livingAreaSqFeet: "",
            extraInfo: { parkingSpots: "0", heating: "none", cooling: "none" }
        }

        out.propertyType = expandedResponse.summary.propSubType;
        out.yearBuilt = expandedResponse.summary.yearBuilt;
        out.condition = expandedResponse.building.construction.condition;

        out.baths = expandedResponse.building.rooms.bathsTotal;
        out.beds = expandedResponse.building.rooms.beds;
        out.livingAreaSqFeet = expandedResponse.building.size.livingSize;

        out.extraInfo.parkingSpots = expandedResponse.building.parking.prkgSpaces;

        if ("coolingType" in expandedResponse.utilities) {
            out.extraInfo.cooling = expandedResponse.utilities.coolingType;
        }
        if ("heatingType" in expandedResponse.utilities) {
            out.extraInfo.heating = expandedResponse.utilities.heatingType;
        }

        return out;

    }
}

function capitalize(str) {
    /**
     * Helper to capitalize first letter of each string (separated by space) in:
     * @param {String} str 
     */
    str = str.split(" ");

    for (var i = 0, x = str.length; i < x; i++) {
        str[i] = str[i][0].toUpperCase() + str[i].substr(1).toLowerCase();
    }

    return str.join(" ");
}
