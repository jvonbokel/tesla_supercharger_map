define(['site/SiteIterator', 'site/SiteSorting', 'site/SitePredicates'],
    function (SiteIterator, SiteSorting, SitePredicates) {

        /**
         *
         * @constructor
         */
        var WayBack = function (googleMap) {
            this.googleMap = googleMap;

            $(".layout-header")
                .append("<div style='height: 3em; background: black; width: 100%; vertical-align: middle'>" +
                    "<div id='way-back-date' style='font-weight: bold; color: white; text-align: center; vertical-align: middle'>" +
                    "</div>" +
                    "</div>"
            );

            this.dateDiv = $("#way-back-date");
            this.lastInfoWindow = null;
            this.index = 0;

            this.superchargers = new SiteIterator()
                .withSort(SiteSorting.BY_OPENED_DATE)
                .withPredicate(SitePredicates.IS_OPEN_AND_COUNTED)
                .toArray();

        };

        var MONTH_NAMES = [ "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December" ];

        /**
         *
         */
        WayBack.prototype.go = function () {
            $.each(this.superchargers, function (index, site) {
                site.marker.setVisible(false);
            });
            this.doNext();
        };

        WayBack.prototype.showNextDate = function () {
            var supercharger = this.superchargers[this.index];
            var dateOpened = supercharger.dateOpened;
            this.dateDiv.html(
                    dateOpened.getFullYear() + "&nbsp;" + MONTH_NAMES[dateOpened.getMonth()]
            );
        };

        WayBack.prototype.showNextMarker = function () {
            var supercharger = this.superchargers[this.index];
            supercharger.marker.setVisible(true);
        };

        WayBack.prototype.showNextInfoWindow = function () {
            var supercharger = this.superchargers[this.index];
            if (this.lastInfoWindow != null) {
                this.lastInfoWindow.close();
            }

            var infoWindow = new google.maps.InfoWindow({
                content: supercharger.displayName
            });
            infoWindow.open(this.googleMap, supercharger.marker);

            this.lastInfoWindow = infoWindow;

        };


        WayBack.prototype.doNext = function () {
            var targetFunction = jQuery.proxy(this.doNext, this);
            if (this.superchargers.length > 0) {
                this.showNextDate();
                this.showNextInfoWindow();
                this.showNextMarker();
                setTimeout(targetFunction, 1000);
            }
            this.index++;
        };

        return WayBack;


    });