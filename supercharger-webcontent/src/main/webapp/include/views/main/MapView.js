//======================================================================================================================
//
//
//
//======================================================================================================================


/**
 * Constructor.
 */
redshiftsoft.MapView = function (initialRangeMiles, initialFillColor) {
    this.radiusMeters = redshiftsoft.MapView.milesToMeters(initialRangeMiles);
    this.fillOpacity = .15;
    this.fillColor = initialFillColor;
};

/**
 * Constants
 */
redshiftsoft.MapView.METERS_PER_MILE = 1609.34;
redshiftsoft.MapView.INITIAL_LAT = 38.0;
redshiftsoft.MapView.INITIAL_LNG = -90.644;
redshiftsoft.MapView.INITIAL_ZOOM = 5;


/**
 * Status function to convert miles to meters.
 */
redshiftsoft.MapView.milesToMeters = function (miles) {
    return redshiftsoft.MapView.METERS_PER_MILE * miles;
};

/**
 * Initialize map
 */
redshiftsoft.MapView.prototype.initMap = function () {

    var mapOptions = {
        center: new google.maps.LatLng(redshiftsoft.MapView.INITIAL_LAT, redshiftsoft.MapView.INITIAL_LNG),
        zoom: redshiftsoft.MapView.INITIAL_ZOOM,
        mapTypeControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.googleMap = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    this.drawMarkers();
    this.drawCircles();
};

/**
 * Initialize map
 */
redshiftsoft.MapView.prototype.drawMarkers = function () {

    for (var i in superchargers) {

        var marker = new google.maps.Marker({
            position: superchargers[i].location,
            map: this.googleMap,
            title: superchargers[i].displayName
        });
        var infoWindow = new google.maps.InfoWindow({
            content: "<div id='content'>" + superchargers[i].streetAddress + "</div>"
        });
        google.maps.event.addListener(marker, 'click', function () {
            infoWindow.open(this.googleMap, marker);
        });
    }

};

/**
 *
 */
redshiftsoft.MapView.prototype.drawCircles = function () {

    for (var i = 0; i < superchargers.length; i++) {
        var supercharger = superchargers[i];
        var rangeCircleOptions = {
            strokeColor: this.fillColor,
            strokeOpacity: 1.0,
            strokeWeight: 2,
            fillColor: this.fillColor,
            fillOpacity: this.fillOpacity,
            map: this.googleMap,
            center: supercharger.location,
            radius: this.radiusMeters
        };
        if (supercharger.circle == null) {
            supercharger.circle = new google.maps.Circle(rangeCircleOptions);
        }
        else {
            supercharger.circle.setOptions(rangeCircleOptions);
        }
    }
};


/**
 *
 */
redshiftsoft.MapView.prototype.setRadiusMiles = function (radiusMilesIn) {
    this.radiusMeters = redshiftsoft.MapView.milesToMeters(radiusMilesIn);
    this.drawCircles();
};


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// getters/setters
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
redshiftsoft.MapView.prototype.getFillColor = function () {
    return this.fillColor;
};
redshiftsoft.MapView.prototype.setFillColor = function (colorVal) {
    this.fillColor = colorVal;
};