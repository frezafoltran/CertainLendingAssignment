export function getSalesComparableURL(addressObj, radius) {

    var apikey = "";
    var base = "https://api.attomdata.com/property/v2/salescomparables/address";

    base += "/" + addressObj.address.split(" ").join("%20");

    base += "/" + addressObj.city.split(" ").join("%20");
    base += "/" + addressObj.country;
    base += "/" + addressObj.state;
    base += "/" + addressObj.zip;

    base += "?searchType=Radius&minComps=1&maxComps=10&";

    var tail = "&bedroomsRange=2&bathroomRange=2&sqFeetRange=600&lotSizeRange=2000&saleDateRange=6&yearBuiltRange=10&ownerOccupied=Both&distressed=IncludeDistressed";

    var r1 = base + "miles=" + "1" + tail;
    var r5 = base + "miles=" + "5" + tail;
    var r10 = base + "miles=" + "10" + tail;

    return {
        "1": { "url": r1, "key": apikey },
        "5": { "url": r5, "key": apikey },
        "10": { "url": r10, "key": apikey }
    }

}


export function getSaleHistoryURL(addressObj) {

    var apikey = "";
    var base = "https://api.gateway.attomdata.com/propertyapi/v1.0.0/saleshistory/basichistory?";

    base += "address1=" + addressObj.address.split(" ").join("%20");
    base += "&address2=" + addressObj.city.split(" ").join("%20") + "%2C%20" + addressObj.state;

    return { "url": base, "key": apikey };

}


export function getExpandedInfoURL(addressObj) {

    var apikey = "";
    var base = "https://api.gateway.attomdata.com/propertyapi/v1.0.0/property/expandedprofile?";

    base += "address1=" + addressObj.address;
    base += "&address2=" + addressObj.city.split(" ").join("%20") + "%2C%20" + addressObj.state;

    return { "url": base, "key": apikey };
}