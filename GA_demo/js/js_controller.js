dojo.require("esri.map");

var map;

function init() {
    var initExtent = new esri.geometry.Extent({
        "xmin": -16918000,
        "ymin": 1551000,
        "xmax": 5936000,
        "ymax": 11217000,
        "spatialReference": {
            "wkid": 102100
        }
    });
    map = new esri.Map("map", {
        //extent: initExtent,
        basemap: "osm",
        center: [103.95,22.5],
        zoom: 4,
        showAttribution:false,
        showLabels : true,
        logo:false,
        scale:true,
        slider:false
    });

}

dojo.ready(init);