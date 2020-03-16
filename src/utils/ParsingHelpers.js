/**
 * This file contains methods to help build the Property object and the data structures needed for
 * plotting the charts. It also contains other general parsing helper methods
 */

import Property from "./Property.js";
var constants = require("./Constants.js");

export function parsePropertyData(saleHistoryById, expandedInfo) {
    /**
     * Parses the response from ATTOM to simplify response object 
     * and parse fields for display 
     * 
     * @param {Object} expandedvancedInfo advanced info on main property
     * 
     * @param {Object} saleHistoryById Contains properties that are comparable 
     * sales to current property
     */
    var saleHistoryUnwrap = unwrapJson(saleHistoryById, "saleHistoryById");
    var expandedInfoUnwrap = unwrapJson(expandedInfo, "expandedInfo");

    var id = expandedInfoUnwrap.identifier.obPropId;

    var mainProperty = new Property(id, saleHistoryUnwrap, expandedInfoUnwrap);

    return mainProperty;
}


export function buildChartData(prices, increment) {
    /**
     * @param {Object} prices Contains prices (and prices per square foot)
     *  of the comparable properties along with the maximum price found. 
     * 
     * @param {int} increment Value of the bins to be displayed
     */

    var out = {
        "datasets": [{ "label": "", "backgroundColor": "", "data": [] }],
        "labels": [],
        "stats": {
            "avg": 0, "max": -1, "min": Number.MAX_SAFE_INTEGER, "count": 0
        }
    };

    out["datasets"][0]["backgroundColor"] = constants.CHART_COLOR;
    out["datasets"][0]["label"] = "Property Count";

    //starts from lowest price
    var dif = prices["max"] - prices["min"];
    var numBins = Math.ceil(dif / increment);

    //i-th bin will hold values (i - 1) * increment through i * increment
    for (var i = 1; i < numBins + 1; i++) {
        out["labels"].push(parsePrice((i - 1) * increment + prices["min"]) + "-" + parsePrice(i * increment + prices["min"]));
        out["datasets"][0]["data"].push(0);
    }

    //counts number of properties in each slot
    for (var i = 0; i < prices["vals"].length; i++) {

        var index = Math.min(Math.floor((prices["vals"][i] - prices["min"]) / increment), numBins);
        out["datasets"][0]["data"][index]++;

        //collect general stats to present user
        out["stats"]["max"] = parseInt(Math.max(out["stats"]["max"], prices["vals"][i]));
        out["stats"]["min"] = parseInt(Math.min(out["stats"]["min"], prices["vals"][i]));
        out["stats"]["avg"] += parseInt(prices["vals"][i]);
        out["stats"]["count"]++;
    }

    out["stats"]["max"] = parsePrice(out["stats"]["max"]);
    out["stats"]["min"] = parsePrice(out["stats"]["min"]);

    if (prices["vals"].length > 0) {
        out["stats"]["avg"] = parsePrice(out["stats"]["avg"] / prices["vals"].length);
    }

    return out;

}

function getSales(comparableSales) {
    /**
     *  Extract information on comparable properties and output 
     * a data structure used by Charts.js to plot info on comparable properties
     * 
     * @param {Array} comparableSales contains information on comparable properties. 
     * Each entry of list contains info for a different radius
     */

    var out = [];

    var prices = {
        "total": { "vals": [], "max": -1, "min": Number.MAX_SAFE_INTEGER },
        "perSquareFoot": { "vals": [], "max": -1, "min": Number.MAX_SAFE_INTEGER }
    };

    for (var i = 1; i < comparableSales.length; i++) {
        var curSale = comparableSales[i]["COMPARABLE_PROPERTY_ext"]["SALES_HISTORY"];

        prices["total"]["vals"].push(curSale["@PropertySalesAmount"]);
        prices["perSquareFoot"]["vals"].push(curSale["@PricePerSquareFootAmount"]);

        prices["total"]["max"] = Math.max(prices["total"]["max"], curSale["@PropertySalesAmount"]);
        prices["perSquareFoot"]["max"] = Math.max(prices["perSquareFoot"]["max"], curSale["@PricePerSquareFootAmount"]);

        prices["total"]["min"] = Math.min(prices["total"]["min"], curSale["@PropertySalesAmount"]);
        prices["perSquareFoot"]["min"] = Math.min(prices["perSquareFoot"]["min"], curSale["@PricePerSquareFootAmount"]);
    }

    var comparableRadius = { "prices": prices, "chartData": buildChartData(prices["total"], constants.INCREMENT_TOTAL) };

    return comparableRadius;
}


export function parseComparableData(comparableSales) {
    /**
     *  Unwraps json and extract information on comparable properties and output 
     * a data structure used by Charts.js to plot info on comparable properties
     * 
     * @param {Array} comparableSales contains unwrapped information on comparable properties. 
     * Each entry of list contains info for a different radius
     */
    return getSales(unwrapJson(comparableSales, "comparableSales"));
}


function unwrapJson(json, responseType) {
    /**
     * Unwraps json object to only keep data that will be used.
     * 
     * @param {Object} json unwrapped json
     * @param {String} type of object
     */

    if (responseType.localeCompare("comparableSales") == 0) {
        return json.RESPONSE_GROUP.RESPONSE.RESPONSE_DATA
            .PROPERTY_INFORMATION_RESPONSE_ext.SUBJECT_PROPERTY_ext.PROPERTY;
    }
    else if (responseType.localeCompare("saleHistoryById") == 0) {
        if (json.property[0].length == 0) return [];

        return json.property[0].salehistory;
    }
    else if (responseType.localeCompare("expandedInfo") == 0) {
        return json.property[0];
    }
}

export function parsePrice(price) {
    /**
     * This method parses the price for display on the charts
     * 
     * @param {int} price unparsed price
     */

    var out = price >= 1000 ? (price / 1000) : price;
    if (out % 1 == 0) {
        return "$" + out.toFixed(0) + "K";
    }
    return "$" + out.toFixed(2) + "K";
}

