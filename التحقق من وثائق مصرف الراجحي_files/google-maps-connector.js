XA.connector.mapsConnector = (function ($, document) {

    "use strict";

    var api = {},
        maps = [],
        markers = [],
        map,
        getMapType,
        createMarker,
        /*Start: function and vraibales  added by ovrlod developer to add the style class to style  marker info window */
        addWindowClass,
        scrollPoiList,
        markerClusterer,
        mapMarkers,
        hideGeolocationWarning,
        getCurrentSite,
        //currentPoiDistance = '',
        /*End: function and vraibales  added by ovrlod developer to add the style class to style  marker info window */
        infoWindows = [],
        addMarker,
        callbacks = [],
        animationTimeout,

        loading = false;

    getMapType = function (options) {
        switch (options.mode) {
            case 'Roadmap': {
                return google.maps.MapTypeId.ROADMAP;
            }
            case 'Satellite': {
                return google.maps.MapTypeId.SATELLITE;
            }
            case 'Hybrid': {
                return google.maps.MapTypeId.HYBRID;
            }
            default: {
                return google.maps.MapTypeId.ROADMAP;
            }
        }
    };

    createMarker = function (mapId, data) {
        var marker;
        if (data.icon === null) {
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(data.latitude, data.longitude),
                map: maps[mapId],
                title: data.title
            });
        } else {
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(data.latitude, data.longitude),
                map: maps[mapId],
                title: data.title,
                icon: data.icon
            });
        }
        if (data.latitude === '' && data.longitude === '') {
            //if marker doesn't have coordinated then create it but doesn't show it on the map
            marker.setVisible(false);
        }
        marker.distance = data.distance;
		marker.latitude=data.latitude;
	    marker.longitude=data.longitude;
		marker.openinghtml=data.openinghtml;
        return marker;
    };

    addMarker = function (mapId, marker, data) {
        //save POI id - this will be used while removing dynamic POIs from the map
        marker.id = data.id;

        if (markers[mapId]) {
            markers[mapId].push({ marker: marker, type: data.type });

        } else {
            markers[mapId] = [];
            markers[mapId].push({ marker: marker, type: data.type });
        }
    };

    /*Start: function added by ovrlod developer to add the style class to style marker info window */
    addWindowClass = function (x) {
        if ($('.eh-map-info').length) {
            $('.eh-map-info').closest('.gm-style-iw').parent('div').addClass('map-popup');
        } else {
            setTimeout(function () {
                addWindowClass(x);
            }, x)
        }
    };
    /*End: function added by ovrlod developer to add the style class to style marker info window */

    /* Start: function added by ovrlod developer to scroll the POI List on marker click / poi list item click */
    scrollPoiList = function (id) {

        $(".search-result-list li").removeClass("active");
        $('.search-result-list li[data-id=' + id + ']').addClass("active");

        var $selectedLocation = $('.search-result-list li[data-id=' + id + ']');
        var $container = $('.pws-search-results-scroll-container');

        var scrollTop = $selectedLocation.offset().top - $container.offset().top + $container.scrollTop();
        //console.log(scrollTop);
        $container.animate({
            scrollTop: scrollTop
        });
    };
    /* End: function added by ovrlod developer to scroll the POI List on marker click / poi list item click */

    /* Start: function added by ovrlod developer to hide the Geo location service disable warning */
    hideGeolocationWarning = function () {
        var geolocationWarning = jQuery('.pws-geolocation-warning')
        if (geolocationWarning !== undefined) {
            geolocationWarning.hide();
        }
    };

    getCurrentSite = function () {
        var currentSite = Globalresources.currentSite;
        var region = 'SA';
        if (currentSite === 'AlRajhiPWSServerOnline') {
            region = 'SA';
        }
        else if (currentSite === 'AlRajhiJO') {
            region = 'JO';
        }
        else if (currentSite === 'AlRajhiKU') {
            region = 'KW';
        }
        return region;
    };

    /* End: function added by ovrlod developer to hide the Geo location service disable warning */

    api.loadScript = function (key, callback) {
        //save each callback and call them all when script will be loaded - protection for loading maps twice
        callbacks.push(callback);

        if (!loading) {
            loading = true;

            // adding map cluster script
            var clusterscript = document.createElement("script");
            clusterscript.src = "/-/media/Themes/BaseTheme-ARB-PWS/Scripts/marker-cluster/markerclusterer.js";
            clusterscript.onload = function () {
                console.log("Google loader has been loaded, waiting for cluster api");
            };
            document.body.appendChild(clusterscript);
            var currentSite = getCurrentSite();
            var currentCulture = Globalresources.currentCulture;
            if (currentCulture === undefined) {
                currentCulture = 'en';
            }
            console.log('load script ' + currentSite);
            var script = document.createElement("script"),
                src = "https://maps.googleapis.com/maps/api/js?v=3.exp";
            script.type = "text/javascript";
            if (typeof key !== "undefined" && key !== "") {
                src += "&key=" + key + "&v=3.exp&language=" + currentCulture + "&region=" + currentSite;
            } else {
                src += "&language=" + currentCulture + "&region=" + currentSite;
            }
            src += "&libraries=geometry,places&callback=XA.connector.mapsConnector.scriptsLoaded";
            script.src = src;
            script.onload = function () {
                console.log("Google loader has been loaded, waiting for maps api");
            };
            document.body.appendChild(script);
        }
    };

    api.scriptsLoaded = function () {
        var i, length = callbacks.length;
        for (i = 0; i < length; i++) {
            callbacks[i].call();
        }
        loading = false;
    };

    api.showMap = function (mapId, options, viewBounds) {
        var mapOptions,
            listener,
            scrollwheel = options.disableMapZoomOnScroll !== "1",
            mapDragging = options.disableMapScrolling !== "1";

        if (viewBounds instanceof Array) {
            mapOptions = {
                zoom: options.zoom,
                scrollwheel: scrollwheel,
                draggable: mapDragging,
                center: new google.maps.LatLng(viewBounds[0], viewBounds[1]),
                mapTypeId: getMapType(options),
                zoomControlOptions: {
                    position: google.maps.ControlPosition.RIGHT_TOP
                },
                mapTypeControlOptions: {
                    style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                    position: google.maps.ControlPosition.TOP_RIGHT
                },

                styles: options.styles
            };
            map = new google.maps.Map(document.getElementById(options.canvasId), mapOptions);
        } else {
            mapOptions = {
                scrollwheel: scrollwheel,
                draggable: mapDragging,
                mapTypeId: getMapType(options),
                styles: options.styles
            };
            map = new google.maps.Map(document.getElementById(options.canvasId), mapOptions);
            map.fitBounds(viewBounds);
            if (options.poiCount < 2) {
                listener = google.maps.event.addListener(map, "idle", function () {
                    if (markers.length > 0 && markers[mapId].length < 2) {
                        map.setZoom(options.zoom);
                        google.maps.event.removeListener(listener);
                    }
                });
            }
        }
        listener = google.maps.event.addListener(map, 'tilesloaded', function (e) {
            XA.connector.mapsConnector.MapLoaded += 1;
            // $('.search-area').hide();
        });
        listener = google.maps.event.addListener(map, "zoom_changed", function (a, b, c, d) {

            for (var key in infoWindows) {
                if (infoWindows.hasOwnProperty(key)) {
                    infoWindows[key].close();
                }
            }

            var zoom = map.getZoom();
            if (zoom < 1) {
                map.setZoom(1);
            }
            try {
                var latitude1 = map.getCenter().lat();
                var longitude1 = map.getCenter().lng();
                var latitude2 = map.getBounds().getNorthEast().lat();
                var longitude2 = map.getBounds().getNorthEast().lng();

                XA.connector.mapsConnector.CenterLatLng = latitude1 + "|" + longitude1;

                XA.connector.mapsConnector.Distance = (google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(latitude1, longitude1), new google.maps.LatLng(latitude2, longitude2)) / 1000).toFixed(0);
                if (XA.connector.mapsConnector.MapLoaded > 1 && XA.connector.mapsConnector.LocationShared) {
                    $('.search-area').show();
                }
            }
            catch (err) {
            }
        });
        listener = google.maps.event.addListener(map, 'bounds_changed', function () {

            try {
                XA.connector.mapsConnector.CenterLatLng = map.getCenter().lat() + "|" + map.getCenter().lng();
                var latitude1 = map.getCenter().lat();
                var longitude1 = map.getCenter().lng();

                var latitude2 = map.getBounds().getNorthEast().lat();
                var longitude2 = map.getBounds().getNorthEast().lng();

                XA.connector.mapsConnector.CenterLatLng = latitude1 + "|" + longitude1;

                XA.connector.mapsConnector.Distance = (google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(latitude1, longitude1), new google.maps.LatLng(latitude2, longitude2)) / 1000).toFixed(0);
                if (XA.connector.mapsConnector.MapLoaded > 1 && XA.connector.mapsConnector.LocationShared) {
                    $('.search-area').show();
                }
            }
            catch (err) {
            }
            //console.log(map.getCenter().lat());
            // console.log(map.getCenter().lng());
            //do whatever you want with those bounds
        });
        maps[mapId] = map;

        $('.map-canvas').append("<a class='search-area' href='javascript:void(0);'>"+Globalresources.searchthisarea+"</>");
        $('.search-area').click(function () {
            var vars = [], hash;
            var hashes = window.location.href.slice(window.location.href.indexOf('#') + 1).split('&');
            for (var i = 0; i < hashes.length; i++) {
                hash = hashes[i].split('=');
                if (hash[0] == "poisearch_g" && XA.connector.mapsConnector.CenterLatLng) {
                    vars.push(hash[0] + "=" + XA.connector.mapsConnector.CenterLatLng);
                }
                else if (hash[0] == "poisearch_distance" && XA.connector.mapsConnector.Distance) {
                    vars.push(hash[0] + "=" + XA.connector.mapsConnector.Distance);
                }
                else {
                    vars.push(hash[0] + "=" + hash[1]);
                }
            }
            $('.search-area').hide();
            XA.connector.mapsConnector.MapLoaded = 1;
            location.href = location.origin + location.pathname + "#" + vars.join('&');

        });

    };

    //Start: function added by Ovrlod developer to rendered the marker cluster
    api.renderMarkerCluster = function (mapId) {

        var clusterMarkers = [],
            maxZoom = 18,
            gridSize = 90;
        if (markers.hasOwnProperty(mapId)) {
            mapMarkers = markers[mapId];

            // Add a marker clusterer to manage the markers.

            jQuery.each(mapMarkers, function (i, item) {
                if (item.type !== "Static" && item.type !== "MyLocation") {
                    clusterMarkers.push(item.marker);
                }
            });
            if (getCurrentSite() == "KW") {
                maxZoom = 10;
                gridSize = 40;
            }
            if (!markerClusterer) {
                markerClusterer = new MarkerClusterer(maps[mapId], clusterMarkers,
                    { imagePath: '/-/media/Themes/BaseTheme-ARB-PWS/images/marker-cluster/m', minimumClusterSize: 3, maxZoom: maxZoom, gridSize: gridSize });

            }
            else {
                markerClusterer.clearMarkers();
                markerClusterer.addMarkers(clusterMarkers, false);

            }
			/*
			if(getCurrentSite() == "KW")
			{
				markerClusterer.fitMapToMarkers();
			}
            */
            markerClusterer.fitMapToMarkers();
            markerClusterer.setCurrentBounds();
            hideGeolocationWarning();
        }
    };
    //End: function added by Ovrlod developer to rendered the marker cluster

    //Start: function added by Ovrlod developer to redraw the clusters when user collaps the POI acccordian
    api.redrawClusters = function () {
        markerClusterer.redrawClusters();
    };
    //End: function added by Ovrlod developer to redraw the clusters when user collaps the POI acccordian


    api.renderPoi = function (mapId, data) {
        var marker = createMarker(mapId, data),
            key = mapId + "#" + data.id;

        addMarker(mapId, marker, data);
        if (data.html !== "" && data.html !== null) {
            infoWindows[key] = new google.maps.InfoWindow({
                maxWidth: 312,
                maxHeight: 80,
                content: data.html
            });
        }
        if (typeof infoWindows[key] !== "undefined") {
            (function (currentKey, marker) {
                google.maps.event.addListener(marker, "click", function () {
                    for (var key in infoWindows) {
                        if (infoWindows.hasOwnProperty(key)) {
                            infoWindows[key].close();
                        }
                    }
                    /*Start: code added by ovrlod developer */
                    addWindowClass(100);
                    infoWindows[currentKey].open(maps[mapId], marker);
                    scrollPoiList(marker.id);
                    /*End: code added by ovrlod developer */
                });
            })(key, marker);

            /*Start: code added by ovrlod developer */
            // Event that closes the Info Window with a click on the map
            google.maps.event.addListener(maps[mapId], 'click', function () {
                infoWindows[key].close();
            });
            /*End: code added by ovrlod developer */
        }
    };

    api.renderDynamicPoi = function (mapId, data, getPoiContent) {
        var marker = createMarker(mapId, data);
        addMarker(mapId, marker, data);
        $('.search-area').hide();
        google.maps.event.addListener(marker, "click", function () {
            if (typeof (getPoiContent) === "function") {
                var poiId = data.id,
                    poiTypeId = data.poiTypeId,
                    poiVariantId = data.poiVariantId;
					

                if (poiVariantId == null) {
                    return;
                }

                getPoiContent(poiId, poiTypeId, poiVariantId, function (result) {
                    if (infoWindows[mapId]) {
                        infoWindows[mapId].close();
                    }
					if(XA.connector.mapsConnector.LocationShared)
					{
                    /*Start: code added by ovrlod developer */
                    result.Html = result.Html.replace('<div class="eh-city-distance"><span></span></div>', '<div class="eh-city-distance"><span>' + (isLang=="ar"? 'على بُعد 0000 كيلو متر'.replace('0000',marker.distance): marker.distance+ ' KM AWAY' ) +  '</span></div>');
					}
					result.Html=result.Html.replace('<span class="show-direction"></span>','<a href="https://maps.google.com.sa/?q='+ (marker.latitude)+ ','+ (marker.longitude) +'" target="_blank"><i class="fa fa-direction"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="directions" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-directions fa-w-16 fa-lg"><path fill="currentColor" d="M502.61 233.32L278.68 9.39c-12.52-12.52-32.83-12.52-45.36 0L9.39 233.32c-12.52 12.53-12.52 32.83 0 45.36l223.93 223.93c12.52 12.53 32.83 12.53 45.36 0l223.93-223.93c12.52-12.53 12.52-32.83 0-45.36zm-100.98 12.56l-84.21 77.73c-5.12 4.73-13.43 1.1-13.43-5.88V264h-96v64c0 4.42-3.58 8-8 8h-32c-4.42 0-8-3.58-8-8v-80c0-17.67 14.33-32 32-32h112v-53.73c0-6.97 8.3-10.61 13.43-5.88l84.21 77.73c3.43 3.17 3.43 8.59 0 11.76z" class=""></path></svg></i></a>');
					result.Html = result.Html.replace('<div class="eh-open-state"></div>', '<div class="eh-open-state">'+marker.openinghtml +'</div>');
                    infoWindows[mapId] = new google.maps.InfoWindow({
                        maxWidth: 312,
                        maxHeight: 80,
                        content: result.Html
                    });

                    addWindowClass(100);
                    infoWindows[mapId].open(maps[mapId], marker);

                    scrollPoiList(marker.id);
                    /*End: code added by ovrlod developer */
                });
            }
        });
        /*Start: code added by ovrlod developer */
        // Event that closes the Info Window with a click on the map
        google.maps.event.addListener(maps[mapId], 'click', function () {
            if (typeof infoWindows[mapId] !== "undefined") {
                infoWindows[mapId].close();
            }
        });
        /*End: code added by ovrlod developer */
    };

    api.clearMarkers = function (mapId) {
        var mapMarkers;
        if (markers.hasOwnProperty(mapId)) {
            mapMarkers = markers[mapId];
            for (var i = 0; i < mapMarkers.length; i++) {
                if (mapMarkers[i].type === "Dynamic") {
                    mapMarkers[i].marker.setMap(null);
                }
            }
            markers[mapId] = mapMarkers.filter(function (markerData) {
                if (markerData.type === "Static" || markerData.type === "MyLocation") {
                    return true;
                } else {
                    return false;
                }
            });
        }
    };
    api.CenterLatLng = "";
    api.Distance = 10;
    api.MapLoaded = 0;
    api.FirstLoad = true;
	api.FacetFilter = "";
    api.LocationShared = false;
    api.updateMapPosition = function (mapId) {
        var map = maps[mapId],
            marker,
            mapMarkers = [],
            bounds = new google.maps.LatLngBounds(),
            i;

        if (markers.hasOwnProperty(mapId)) {
            mapMarkers = markers[mapId];
        }

        for (i = 0; i < mapMarkers.length; i++) {
            //if (mapMarkers[i].type !== "Static" && mapMarkers[i].type !== "MyLocation")
            {
                marker = mapMarkers[i].marker;
                bounds.extend(new google.maps.LatLng(marker.position.lat(), marker.position.lng()));
            }
        }

        map.fitBounds(bounds);
    };

    api.centerMap = function (mapId, data, centerMap, animate) {
        var map = maps[mapId],
            mapMarkers = [],
            animatedMarker;
        if (centerMap) {
            map.setCenter(new google.maps.LatLng(data.coordinates[0], data.coordinates[1]))
        }
        if (animate) {
            if (markers.hasOwnProperty(mapId)) {
                mapMarkers = markers[mapId];
            }
            for (var i = 0; i < mapMarkers.length; i++) {
                mapMarkers[i].marker.setAnimation(null);
                if (mapMarkers[i].type !== "Static" && mapMarkers[i].type !== "MyLocation" && mapMarkers[i].marker.icon !== undefined) {
                    var inactiveIcon = mapMarkers[i].marker.icon.replace("-current", "-active");
                    mapMarkers[i].marker.setIcon(inactiveIcon);
                }
                if (mapMarkers[i].marker.id === data.id) {
                    var activeIcon = mapMarkers[i].marker.icon.replace("-active", "-current");
                    mapMarkers[i].marker.setIcon(activeIcon);
                    animatedMarker = mapMarkers[i].marker;
                    mapMarkers[i].marker.setMap(null);
                }
            }
            if (typeof animatedMarker !== "undefined") {
                animatedMarker.setMap(map);
                /*	Start: Code commented by ovrlod developer*/
                animatedMarker.setAnimation(google.maps.Animation.BOUNCE);
                /*
                  animationTimeout = setTimeout(function () {
                      animatedMarker.setMap(map);
                  }, 2000);
                  */
                /*	End: Code commented by ovrlod developer*/

                /*Start: function called by Ovrlod developer to change the map bounds and display a specific marker also scroll poi list*/
                scrollPoiList(animatedMarker.id);
                markerClusterer.zoomClusterChanged(animatedMarker);
                /*End: function called by Ovrlod developer to change the map bounds and display a specific marker also scroll poi list*/
            }
        }
    };

    /*Start: function added by ovrlod developer to create and render marker for selected poi from global search */
    api.searchCenterMap = function (mapId, data, centerMap, animate) {
        var map = maps[mapId],
            marker,
            mapMarkers = [],
            bounds = new google.maps.LatLngBounds(),
            i;

        var marker = createMarker(mapId, data);

        addMarker(mapId, marker, data);

        bounds.extend(new google.maps.LatLng(marker.position.lat(), marker.position.lng()));

        map.fitBounds(bounds);
        map.setZoom(16);
        $('.eh-global-search-map').show();
    };
    /*End: function added by ovrlod developer to create and render marker for selected poi from global search */

    api.activatePOIsIcons = function (mapId) {
        console.log("activatePOIsIcons fire " + mapId);
        var map = maps[mapId],
            mapMarkers = [],
            animatedMarker;

        if (markers.hasOwnProperty(mapId)) {
            mapMarkers = markers[mapId];
        }
        for (var i = 0; i < mapMarkers.length; i++) {
            /*	Start: Code commented by ovrlod developer*/
            mapMarkers[i].marker.setAnimation(null);
            /*	End: Code commented by ovrlod developer*/
            if (mapMarkers[i].marker.icon !== undefined && mapMarkers[i].type !== "Static" && mapMarkers[i].type !== "MyLocation") {
                /*	Start: Code commented by ovrlod developer*/
                /*var activeIcon = mapMarkers[i].marker.icon.replace("-inactive", "-active");*/
                /*	End: Code commented by ovrlod developer*/
                var activeIcon = mapMarkers[i].marker.icon.replace("-current", "-active");
                mapMarkers[i].marker.setIcon(activeIcon);
            }
            //if (mapMarkers[i].marker.id === data.id) {
            //    var activeIcon = mapMarkers[i].marker.icon.replace("-inactive", "-active");
            //    mapMarkers[i].marker.icon = activeIcon;
            //    animatedMarker = mapMarkers[i].marker;
            //    mapMarkers[i].marker.setMap(null);
            //}
        }
    };

    api.getCentralPoint = function (poisCoords) {
        var i,
            poiCoords,
            count = poisCoords.length,
            bounds = new google.maps.LatLngBounds();

        for (i = 0; i < count; i++) {
            poiCoords = poisCoords[i];
            if (poiCoords.latitude !== "" && poiCoords.longitude !== "") {
                bounds.extend(new google.maps.LatLng(poiCoords.latitude, poiCoords.longitude));
            }
        }
        return bounds;
    };

    api.locationAutocomplete = function (queryParams, successCallback, failCallback) {
        var autocomplete = new google.maps.places.AutocompleteService(),
            maxResults = queryParams.maxResults <= 0 ? 1 : queryParams.maxResults,
            currentSite = getCurrentSite();
        console.log('location auto complete ' + currentSite);
        /*Service updated from getQueryPredictions to getPlacePredictions*/
        autocomplete.getPlacePredictions({ input: queryParams.text, componentRestrictions: { country: currentSite.toLowerCase() } },
            function (results) {
                var predictions = [], length, additionalHints;
                if (results != null && results.length) {
                    length = results.length >= maxResults ? maxResults : results.length;

                    var facetList = jQuery('.facet-single-selection-list.branchesoratm p');
                    for (var i = 0; i < length; i++) {
                        /*Start: code updated by ovrlod developer to test the modification in HTML for suggested list*/
                        if (i === 0) {
                            predictions.push(_.extend(results[i], { text: results[i].description }));
                            //let tempSuggestion = results[i];
                            for (var index = 0; index < facetList.length; index++) {
                                if (facetList !== undefined) {
                                    let branchSuggestion = Object.assign({}, results[i]);
                                    branchSuggestion.description = branchSuggestion.structured_formatting.main_text + " " + facetList[index].getAttribute('data-facetvalue');
                                    predictions.push(_.extend(branchSuggestion, { text: branchSuggestion.description, branchoratm: facetList[index].getAttribute('data-facetvalue') }));
                                }
                            }
                        }
                        else {
                            predictions.push(_.extend(results[i], { text: results[i].description }));
                        }
                        /*Start: code updated by ovrlod developer to test the modification in HTML for suggested list*/
                    }
                    successCallback(predictions);
                }
                else {
                    failCallback();
                }
            });
    };

    api.addressLookup = function (queryParams, successCallback, failCallback) {
        var search,
            query;

        if (queryParams.hasOwnProperty("place_id")) { //places lookup
            search = new google.maps.places.PlacesService(typeof map !== "undefined" ? map : new google.maps.Map(document.createElement("div")));
            search.getDetails({
                placeId: queryParams["place_id"]
            }, function (results, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    if (typeof (results) !== "undefined" && typeof (results.geometry.location) !== "undefined") {
                        successCallback([results.geometry.location.lat(), results.geometry.location.lng()]);
                        return;
                    }
                }
                failCallback();
            });
        }
        else { //standard lookup
            query = {
                address: queryParams.text
            };
            search = new google.maps.Geocoder();
            search.geocode(query, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (typeof (results[0]) !== "undefined" && typeof (results[0].geometry.location) !== "undefined") {
                        successCallback([results[0].geometry.location.lat(), results[0].geometry.location.lng()]);
                        return;
                    }
                }
                failCallback();
            });
        }
    };
    api.LanLonglookUp = function (queryParam, successCallback, failCallback) {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'location': queryParam }, function (results, status) {
            if (status === 'OK') {
                if (results[0]) {
                    successCallback(results[0].formatted_address);
                } else {
                    failCallback();
                }
            } else {
                failCallback();
            }
        });
    };
    api.updateMyPoiLocation = function (mapId, coordinates, zoom) {
        var map = maps[mapId],
            mapMarkers = [],
            myLocationMarker;

        if (markers.hasOwnProperty(mapId)) {
            mapMarkers = markers[mapId];
            myLocationMarker = mapMarkers.filter(function (marker) {
                if (marker.type === "MyLocation") {
                    return true;
                }
                return false;
            });
            if (myLocationMarker.length > 0) {
                myLocationMarker[0].marker.setPosition(new google.maps.LatLng(coordinates[0], coordinates[1]));
                myLocationMarker[0].marker.setVisible(true);
                this.updateMapPosition(mapId);
                map.setCenter(new google.maps.LatLng(coordinates[0], coordinates[1]));
                map.setZoom(zoom);
            }
        }
    };

    /*Start: function added by ovrlod developer to clear the marker and set the map to defualt state when no result found for search*/
    api.forceClearCluster = function () {
        if (markerClusterer) {
            markerClusterer.clearMarkers();
        }
    }
    /*End: function added by ovrlod developer to clear the marker and set the map to defualt state when no result found for search*/
    return api;

})(jQuery, document);
