define(
    [
        'lib/bootstrap',
        'page/map/SuperchargerCarousel', 'page/map/action/WayBackAction',
        'nav/NavBarDropdown', 'page/map/Routing',
        'page/map/ControlState', 'page/map/MapView', 'page/map/ControlView', 'lib/jquery.doTimeout'
    ],
    function (bootstrap, SuperchargerCarousel, WayBackAction, NavBarDropDown, Routing, ControlState, MapView, ControlView) {

        /**
         *
         * @constructor
         */
        var MapPage = function () {
            this.page = $("#page-map");
        };

        MapPage.INIT_PROP = "page-initialized";

        MapPage.prototype.onPageShow = function () {
            if (!this.page.data(MapPage.INIT_PROP)) {
                this.initialize();
                this.page.data(MapPage.INIT_PROP, true);
            }
            $("#navbar-map-dropdown").show();
            $("#navbar-map-search").show();
            $("#carousel-container").show();
        };

        MapPage.prototype.onPageHide = function () {
            $("#navbar-map-dropdown").hide();
            $("#navbar-map-search").hide();
            $("#carousel-container").hide();
        };

        MapPage.prototype.initialize = function () {
            var controlState = new ControlState();

            this.navBarDropDown = new NavBarDropDown();

            this.superChargerCarousel = new SuperchargerCarousel();
            this.mapView = new MapView(controlState);
            this.controlView = new ControlView(controlState);
            this.routing = new Routing(this.mapView.googleMap);

            this.wayBackAction = new WayBackAction(this.mapView.googleMap);

            this.initMapViewListeners();
            this.initControlViewListeners();
            this.initNavBarListeners();
        };

        MapPage.prototype.initNavBarListeners = function () {
            var mapView = this.mapView;
            var controlView = this.controlView;

            this.navBarDropDown.on("nav-dropdown-circles-on-event", function () {
                if (controlView.controlState.range.getCurrent() === 0) {
                    controlView.getRangeSlider().setValue(50);
                    mapView.redraw(false);
                }
                mapView.setAllRangeCircleVisibility(true);
            });

            this.navBarDropDown.on("nav-dropdown-circles-off-event", function () {
                mapView.setAllRangeCircleVisibility(false);
            });

            this.navBarDropDown.on("nav-dropdown-toggle-range-control-event", function () {
                controlView.toggleRangeControlVisibility();
            });

            this.navBarDropDown.on("nav-dropdown-toggle-status-control-event", function () {
                controlView.toggleStatusControlVisibility();
            });

            this.navBarDropDown.on("nav-dropdown-toggle-rendering-control-event", function () {
                controlView.toggleRenderingControlVisibility();
            });

        };

        /**
         * INIT: MapView
         */
        MapPage.prototype.initMapViewListeners = function () {
            this.mapView.on("map-event-route-added", jQuery.proxy(this.routing.handleAddRouteEvent, this.routing));
        };


        /**
         * INIT: ControlView
         */
        MapPage.prototype.initControlViewListeners = function () {

            var mapView = this.mapView;
            var controlView = this.controlView;

            // Callback: range change
            //
            controlView.getRangeSlider().on("range-change-event", function (event, newRange) {
                jQuery.doTimeout("rangeTimerId", 200, function () {
                    controlView.controlState.range.setCurrent(newRange);
                    mapView.redraw(false);
                });
            });

            // Callback: fill-opacity change
            //
            controlView.getFillOpacitySlider().on("range-change-event", function (event, newFillOpacity) {
                jQuery.doTimeout("fillOpacityTimerId", 400, function () {
                    controlView.controlState.fillOpacity = newFillOpacity;
                    mapView.redraw(false);
                });

            });

            // Callback: fill color change
            //
            controlView.on("fill-color-change-event", function (event, controlState) {
                mapView.setControlState(controlState);
                mapView.redraw(false);
            });

            // Callback: fill-opacity change
            //
            controlView.getBorderOpacitySlider().on("range-change-event", function (event, newBorderOpacity) {
                jQuery.doTimeout("borderOpacityTimerId", 400, function () {
                    controlView.controlState.borderOpacity = newBorderOpacity;
                    mapView.redraw(false);
                });
            });

            // Callback: fill color change
            //
            controlView.on("border-color-change-event", function (event, controlState) {
                mapView.setControlState(controlState);
                mapView.redraw(false);
            });

            // Callback: station status change
            //
            controlView.on("station-status-change-event", function (event, controlState) {
                mapView.setControlState(controlState);
                mapView.redraw(true);
            });

            // Callback: zoom to location
            //
            controlView.on("control-event-zoom-location", function (event, locationText) {
                mapView.zoomToLocation(locationText);
            });

        };

        return MapPage;

    });