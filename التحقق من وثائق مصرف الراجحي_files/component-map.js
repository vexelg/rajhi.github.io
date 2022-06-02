XA.component.map = (function ($, document) {
    "use strict";
    var api = {},
        maps = [],
        searchEndpoint,
        searchResultsSignatures = [],
        key,
        urlHelperModel,
        apiModel,
        queryModel,
		locationFilter,
        searchBox,
        mapsConnector,
        scriptsLoaded = false,
        initialize,
        searchResults,
        pushMapData,
        resultsLoaded,
        myLocationChanged,
        myLocationData,
        mapViews = [],
        MapModel,
        MapView,
        userViewBounds;
    resultsLoaded = function (data) {
        searchResults = data;
    };
    myLocationChanged = function (data) {
        myLocationData = data;
    };
    initialize = function () {
        var i, mapsCount = maps.length;
        for (i = 0; i < mapsCount; i++) {
            //crate Backbone.js views - one view per component on the page
            mapViews.push(new MapView({el: maps[i], model: new MapModel()}));
        }
        if (typeof (XA.component.search) !== "undefined") {
            pushMapData();
        }
    };
    pushMapData = function () {
        var notInitializedMaps,
            resultsExists = typeof searchResults !== "undefined",
            myLocationExists = typeof myLocationData !== "undefined";
        if (resultsExists || myLocationExists) {
            //in case that results were loaded before initialization of view and model, trigger another event with
            //previously loaded results
            //this will happen just once - while initialization
            //remember about checking if all maps are already rendered
            notInitializedMaps = mapViews.filter(function (view) {
                if (view.model.get("showed") === false) {
                    return true;
                }
                return false;
            });
            if (notInitializedMaps.length > 0) {
                setTimeout(pushMapData, 1000);
            } else {
                if (resultsExists) {
                    XA.component.search.vent.trigger("internal-results-loaded", searchResults);
                }
                if (myLocationExists) {
                    XA.component.search.vent.trigger("internal-my-location-coordinates-changed", myLocationData);
                }
            }
        }
    };
    MapModel = Backbone.Model.extend({
        defaults: {
            dataProperties: {},
            dynamicPoiList: [],
            showed: false,
            myLocation: ["", ""],
            id: null,
            loadMore: false
        },
        initialize: function () {
            var sig = this.get("dataProperties").searchResultsSignature,
                hash = queryModel.parseHashParameters(window.location.hash),
                param = typeof (sig) !== "undefined" && sig !== "" ? sig + "_g" : "g";
            if (typeof (XA.component.search) !== "undefined") {
                XA.component.search.vent.on("results-loaded", this.updateDynamicPoiList.bind(this));
                XA.component.search.vent.on("internal-results-loaded", this.updateDynamicPoiList.bind(this));
                XA.component.search.vent.on("my-location-coordinates-changed", this.changeMyLocation.bind(this));
                XA.component.search.vent.on("internal-my-location-coordinates-changed", this.changeMyLocation.bind(this));
            }
            if (hash.hasOwnProperty(param) && hash[param] !== "") {
                //if Location Filter component is on the page it could already fill "g" hash parameter
                this.set("myLocation", hash[param].split("|"));
            }
        },
        getPoiVariant: function (poiTypeId, poiVariantId) {
            var mapping = this.get("dataProperties").typeToVariantMapping,
                typeId;
            if (typeof poiTypeId !== "undefined" && poiTypeId != null) {
                typeId = "{" + poiTypeId.toUpperCase() + "}";
                if (mapping.hasOwnProperty(typeId)) {
                    return mapping[typeId];
                } else {
                    return poiVariantId;
                }
            }
            return poiVariantId;
        },
        updateDynamicPoiList: function (searchResults) {
            var dynamicPoiList = [],
                signature = this.get("dataProperties").searchResultsSignature,
                geolocationData = searchResults.data.filter(function (result) {
                    if (result.hasOwnProperty("Geospatial")) {
                        return true;
                    } else {
                        return false;
                    }
                }),
                i,
                poi;
            var container = $(".pws-main-findabranch-container");
            if (!container.hasClass("overlay-active")) {
                container.addClass("overlay-active");
            }
            if (signature !== searchResults.searchResultsSignature) {
                return;
            }
            //save information that those POIs comes from load more action
            this.set("loadMore", searchResults.loadMore);
            for (i = 0; i < geolocationData.length; i++) {
                poi = geolocationData[i];
                //don't show POIs which doesn't have Latitude and Longitude
                if (poi.Geospatial.Latitude === 0 || poi.Geospatial.Longitude === 0) {
                    continue;
                }
                dynamicPoiList.push({
                    id: poi.Id,
                    type: "Dynamic",
                    title: poi.Name,
                    latitude: poi.Geospatial.Latitude,
                    longitude: poi.Geospatial.Longitude,
					distance: poi.Geospatial.Distance.toFixed(2),
					openinghtml:poi.OpeningTimeHtml,
                    icon: poi.Geospatial.PoiIcon,
                    poiTypeId: poi.Geospatial.PoiTypeId,
                    poiVariantId: this.getPoiVariant(poi.Geospatial.PoiTypeId, poi.Geospatial.PoiVariantId)
                });
            }
			if(searchResults.data.length > 0 && dynamicPoiList.length > 0)
			{
				this.set("dynamicPoiList", dynamicPoiList);
			}
			else if (searchResults.data.length === 0){
				this.set("dynamicPoiList", undefined);				
			}				
        },
        changeMyLocation: function (myLocationData) {
            var sig = this.get("dataProperties").searchResultsSignature;
            if (sig === myLocationData.sig) {
                this.set("myLocation", myLocationData.coordinates);
            }
        }
    });
    MapView = Backbone.View.extend({
        initialize: function () {
            var dataProperties = this.$el.data(),
                properties = dataProperties.properties;
            if (this.model) {
                this.model.set({dataProperties: properties});
                this.model.set({id: this.$el.find(".map-canvas").prop("id")});
            }
			this.updateDefaultLocation();
            this.render();
            this.model.on("change:dynamicPoiList", this.renderDynamicPois, this);
            this.model.on("change:myLocation", this.updateMyLocationPoi, this);
            if (typeof (XA.component.search) !== "undefined") {
                XA.component.search.vent.on("center-map", this.handleCenterMap.bind(this));
				XA.component.search.vent.on("search-center-map", this.handleSearchCenterMap.bind(this));
            }
            this.updateMyLocationPoi();
			
        },
        render: function () {
            var that = this,
                showed = this.model.get("showed"),
                canvas = document.getElementById(this.model.get("id"));
            if (!showed && canvas !== null) {
                this.getCentralPoint(function (viewBounds, ctx) {
                    if (typeof viewBounds !== "undefined") {
                        var context = typeof ctx !== "undefined" ? ctx : this,
                            id = context.model.get("id"),
                            properties = context.model.get("dataProperties"),
                            mapOptions = {
                                canvasId: id,
                                zoom: typeof(properties.zoom) === "number" ? properties.zoom : context.parseZoom(properties.zoom, 15),
                                mode: properties.mode,
                                poiCount: properties.pois.length,
                                key: properties.key,
                                disableMapScrolling: properties.disableMapScrolling,
                                disableMapZoomOnScroll: properties.disableMapZoomOnScroll,
                                styles: [{
                                    "featureType": "water",
                                    "elementType": "geometry",
                                    "stylers": [{"color": "#e9e9e9"}, {"lightness": 17}]
                                }, {
                                    "featureType": "landscape",
                                    "elementType": "geometry",
                                    "stylers": [{"color": "#f5f5f5"}, {"lightness": 20}]
                                }, {
                                    "featureType": "road.highway",
                                    "elementType": "geometry.fill",
                                    "stylers": [{"color": "#A9A9A9"}, {"lightness": 17}]
                                }, {
                                    "featureType": "road.highway",
                                    "elementType": "geometry.stroke",
                                    "stylers": [{"color": "#A9A9A9"}, {"lightness": 29}, {"weight": 0.2}]
                                }, {
                                    "featureType": "road.arterial",
                                    "elementType": "geometry",
                                    "stylers": [{"color": "#ffffff"}, {"lightness": 18}]
                                }, {
                                    "featureType": "road.local",
                                    "elementType": "geometry",
                                    "stylers": [{"color": "#ffffff"}, {"lightness": 16}]
                                }, {
                                    "featureType": "poi",
                                    "elementType": "geometry",
                                    "stylers": [{"color": "#f5f5f5"}, {"lightness": 21}]
                                }, {
                                    "featureType": "poi.park",
                                    "elementType": "geometry",
                                    "stylers": [{"color": "#dedede"}, {"lightness": 21}]
                                }, {
                                    "elementType": "labels.text.stroke",
                                    "stylers": [{"visibility": "on"}, {"color": "#ffffff"}, {"lightness": 16}]
                                }, {
                                    "elementType": "labels.text.fill",
                                    "stylers": [{"saturation": 36}, {"color": "#7e7561"}, {"lightness": 20}]
                                }, {
                                    "elementType": "labels.icon",
                                    "stylers": [{"visibility": "off"}]
                                }, {
                                    "featureType": "transit",
                                    "elementType": "geometry",
                                    "stylers": [{"color": "#f2f2f2"}, {"lightness": 19}]
                                }, {
                                    "featureType": "administrative",
                                    "elementType": "geometry.fill",
                                    "stylers": [{"color": "#fefefe"}, {"lightness": 20}]
                                }, {
                                    "featureType": "administrative",
                                    "elementType": "geometry.stroke",
                                    "stylers": [{"color": "#fefefe"}, {"lightness": 17}, {"weight": 1.2}]
                                }]
                            };
                        userViewBounds = viewBounds;
                        mapsConnector.showMap(id, mapOptions, viewBounds);
                        context.renderPoiList(id, properties.pois);
                        context.model.set("showed", true);
                    }
                });
            }
        },
        renderDynamicPois: function () {
            var dataProperties = this.model.get("dataProperties"),
                dynamicPoiList = this.model.get("dynamicPoiList"),
                properties = this.model.get("dataProperties"),
                id = this.model.get("id"),
                i;
				//console.log('dynamicPoiList');
				//console.log(dynamicPoiList);
            if (!this.model.get("loadMore")) {
                mapsConnector.clearMarkers(id);
            }
			if(dynamicPoiList !== undefined && dynamicPoiList.length > 0)
			{
				$('.pws-search-results-scroll-container, .arb-irrelevant-result-map').removeClass('pws-force-hide');
				//$('.pws-irrelevant-popup').removeClass('pws-force-hide');
				for (i = 0; i < dynamicPoiList.length; i++) {
					mapsConnector.renderDynamicPoi(id, dynamicPoiList[i], this.getGeoPoiContent.bind(this));
				}
				
				$(".overlay-active").removeClass("overlay-active");
				//if user want to see all POIs then after adding dynamic POIs we have to recalculate map center point
				if (dataProperties.centralPointMode === "MidOfPoi") {
					mapsConnector.updateMapPosition(this.model.get("id"), this.parseZoom(properties.zoom, 12));
				}
				
				/*Start: function called by Ovrlod developer to render the marker clusters */
				mapsConnector.renderMarkerCluster(id);		
				$("body").addClass("autocomplete-done");			
				/*Start: function called by Ovrlod developer to render the marker clusters */
			}
			else
			{
				$('.pws-search-results-scroll-container, .arb-irrelevant-result-map').addClass('pws-force-hide');
				XA.connector.mapsConnector.forceClearCluster();
				$('.pws-irrelevant-popup').removeClass('pws-force-hide');				
				$("a.irrelevent-search").attr("href", document.location.protocol +"//"+ document.location.hostname + document.location.pathname)				
			}
			
        },
        renderPoiList: function (mapId, poiList) {
            var i,
                poi,
                myLocation,
                poiCount = poiList.length,
                properties = this.model.get("dataProperties"),
                sig = properties.searchResultsSignature,
                hash = queryModel.parseHashParameters(window.location.hash),
                param = sig !== "" ? sig + "_g" : "g";
			/*
		   for (i = 0; i < poiCount; i++) {
                poi = poiList[i];
				//Start: Code added by ovrlod developer to  update the current location marker//
				poi.PoiIcon = "/-/media/Feature/AlrajhiPWS/Maps Extended/map-current-location.png";
				//End: Code added by ovrlod developer to  update the current location marker//
                if (poi.Type === "MyLocation") {
                    myLocation = this.model.get("myLocation");
					// if(poi.Latitude === "" || poi.Longitude === "")
					// {
						// poi.Latitude = properties.latitude;
						// poi.Longitude = properties.longitude;					
					// }
					// else
					// {
						poi.Latitude = myLocation[0];
						poi.Longitude = myLocation[1];	
					// }
                    if (!hash.hasOwnProperty(param) || (hash.hasOwnProperty(param) && hash[param] === "")) {
                        //if there is no "g" param then it's mean that there is no Location Filter on the map
                        //in this case we have take coordinated from the browser to display My Location POI
                        this.getCurrentPosition(function (coordinates) {
							// if(coordinates !== undefined && (coordinates[0] !== 0 || coordinates [1] !== 0 ))
							// {
								this.model.set("myLocation", coordinates);
							// }
							// else
							// {
								// this.model.set("myLocation", [properties.latitude,properties.longitude]);								
							// }
                        });
                    } else if (hash.hasOwnProperty(param)) {
                        this.model.set("myLocation", hash[param].split("|"));
                    }
					// else 
					// {
						// this.model.set("myLocation", [properties.latitude,properties.longitude]);						
					// }
                } else if (poi.Type !== "MyLocation") {
                    continue;
                }
				
                mapsConnector.renderPoi(mapId, {
                    id: poi.Id.Guid,
                    title: poi.Title,
                    description: poi.Description,
                    latitude: poi.Latitude,
                    longitude: poi.Longitude,
                    icon: poi.PoiIcon,
                    html: poi.Html,
                    type: poi.Type
                });
				
            }
			*/
			
			mapsConnector.renderPoi(mapId, {
                    id: 'MyLocation',
                    title: '',
                    description: 'MyLocation',
                    latitude: properties.latitude,
                    longitude: properties.longitude,
                    icon: "/-/media/Feature/AlrajhiPWS/Maps Extended/map-current-location.png",
                    html: '',
                    type: 'MyLocation'
                });
				
        },
        getPoiContent: function (poiId, poiTypeId, poiVariantId, renderPoiContentCallback) {
            var properties = this.model.get("dataProperties"),
                url = urlHelperModel.createGetPoiContentUrl({endpoint: properties.variantsEndpoint}, poiId, poiVariantId);
            apiModel.getData({
                callback: renderPoiContentCallback,
                url: url,
                excludeSiteName: true
            });
        },
        getGeoPoiContent: function (poiId, poiTypeId, poiVariantId, renderPoiContentCallback) {
            var myLocation = this.model.get("myLocation"),
                latitude = myLocation[0],
                longitude = myLocation[1],
                properties = this.model.get("dataProperties"),
                hash = queryModel.parseHashParameters(window.location.hash),
                units = hash.o,
                url = urlHelperModel.createGetGeoPoiContentUrl({endpoint: properties.variantsEndpoint}, poiId, poiVariantId, latitude + "," + longitude, units);
            apiModel.getData({
                callback: renderPoiContentCallback,
                url: url,
                excludeSiteName: true
            });
        },
        getCentralPoint: function (callback) {
            var properties = this.model.get("dataProperties"),
                that = this;
            switch (properties.centralPointMode) {
                case "Auto": {
                    if (properties.centralPoint !== "") {
                        callback.call(that, [properties.latitude, properties.longitude]);
                    } else if (properties.pois.length > 0) {
                        callback.call(that, [properties.pois[0].Latitude, properties.pois[0].Longitude]);
                    } else {
                        this.getCurrentPosition(callback);
                    }
                    break;
                }
                case "MidOfPoi": {
                    callback.call(that, this.getPoisCentralPoint());
                    break;
                }
                case "Location": {
                    this.getCurrentPosition(callback);
                    break;
                }
            }
        },
        getCurrentPosition: function (callback) {
            var that = this;
            XA.component.locationService.detectLocation(
                function (location) {
                    callback.call(that, location, that);
                },
                function (errorMessage) {
                    callback.call(that, [0, 0], that);
                    console.log(errorMessage);
                }
            );
        },
        getPoisCentralPoint: function () {
            var i,
                poi,
                poisCoords = [],
                myLocation = this.model.get("myLocation"),
                properties = this.model.get("dataProperties"),
                count = properties.pois.length;
            for (i = 0; i < count; i++) {
                poi = properties.pois[i];
                if (poi.TemplateId.Guid === "7dd9ece5-9461-498d-8721-7cbea8111b5e") {
                    if (myLocation[0] !== "" && myLocation[1] !== "") {
                        poi.Latitude = myLocation[0];
                        poi.Longitude = myLocation[1];
                        this.model.set("dataProperties", properties);
                        poisCoords.push({latitude: poi.Latitude, longitude: poi.Longitude});
                    }
                } else {
                    poisCoords.push({latitude: poi.Latitude, longitude: poi.Longitude});
                }
            }
            return mapsConnector.getCentralPoint(poisCoords);
        },
        handleCenterMap: function (data) {
            var mainBox = $(".branch-locator-filters-box");
			var id= this.model.id;
            mainBox.addClass("one-branch-active");
            $(".search-result-list li").removeClass("active");
            var branch = $(".search-result-list li[data-id='" + data.id + "']");
            branch.addClass("active");
            // concat servies list into one comma string to show in branch details.
            var servicesBox = branch.find(".pws-services-box");
            var servicesTitles = servicesBox.find("div.field-title");
            if (servicesTitles.length > 1) {
                var services = [];
                servicesTitles.each(function () {
                    services.push($(this).text());
                });
                var servicesSTR = services.join(', ');
                servicesTitles.remove();
                branch.find(".pws-services-box").append($("<div class='field-title'/>").text(servicesSTR));
            }
			
			// convert contact phone number into list of contact number.
            var contactBox = branch.find(".pws-address-box");
            var contactSTR = contactBox.find("div.field-phone");
            if (contactSTR.text().length > 1) {
                var contacts = [];
                contacts = contactSTR.text().split(',');
				   if(contacts.length > 1)
				   {						
						contactSTR.remove();
						contactBox.append($("<div class='field-phone'/>"));
						contactBox.find("div.field-phone").append('<ul class=contact-phone>');
						
					    $.each(contacts, function (key , value) {
						contactBox.find("div.field-phone").find('ul.contact-phone').append("<li> <a href='tel:"+value+"'>"+value+" </a></li>");				   
				   });
					}                
            }
			
            //Bind back to branch listing button
            var searchBtn = $(".pws-back-to-search-btn");
            var branchItem = $(".branch-locator-filters-box.one-branch-active .pws-branches-box li");
            var that = this;
            // searchBtn.unbind("click")
            searchBtn.on('click', function (event) {
                //$(".pws-top-message-bar").on("click", ".pws-back-to-search-btn", function () {

                branchItem.removeClass("active");
                $(".branch-locator-filters-box").removeClass("one-branch-active");
                   mapsConnector.activatePOIsIcons(that.model.get("id"));				
				
				//following line of code added cause the event got fired multiple time,initially it was not in SXA 1.3 it is updated for SXA 1.7
                event.stopImmediatePropagation();	
				
				/*Start: code called by Ovrlod developer to redraw the marker cluster*/
				mapsConnector.redrawClusters();
				/*End: code called by Ovrlod developer to redraw the marker cluster*/
			    // console.log("back button fire Id- " + that.model.get("id"));
            });
            var centerMap = this.model.get("dataProperties").centerOnFoundPoi === "1",
                animate = this.model.get("dataProperties").animateFoundPoi === "1";
            this.centerOnMap(data, centerMap, animate);
        },
        centerOnMap: function (data, centerMap, animate) {
            if (data.sig === this.model.get("dataProperties").searchResultsSignature) {
                mapsConnector.centerMap(this.model.get("id"), data, centerMap, animate);
            }
        },
		/*Start: function added by ovrlod developer to handel the global search poi center marker */
		searchCenterOnMap: function (data, centerMap, animate) {
            if (data.sig === this.model.get("dataProperties").searchResultsSignature) {
                mapsConnector.searchCenterMap(this.model.get("id"), data, centerMap, animate);
            }
        },
		
		handleSearchCenterMap: function (data) {
           				
            var centerMap = this.model.get("dataProperties").centerOnFoundPoi === "1",
                animate = this.model.get("dataProperties").animateFoundPoi === "1";
            this.searchCenterOnMap({latitude: data.coordinates[0], longitude: data.coordinates[1], sig: data.sig, 
							icon:"/-/media/Feature/AlrajhiPWS/Maps-Extended/map-marker-current.png"}, centerMap, animate);
        },
		/*End: function added by ovrlod developer to handel the global search poi center marker */
        updateMyLocationPoi: function () {
            var properties = this.model.get("dataProperties"),
                myLocation = this.model.get("myLocation");
            //check if there is something in my location
            if (myLocation[0] !== "" && myLocation[1] !== 0) {
                //my location was changed so update position of My Location marker				
                mapsConnector.updateMyPoiLocation(this.model.get("id"), myLocation, this.parseZoom(properties.zoom, 12));
            }
        },
		updateDefaultLocation:function ()
		{
			var properties = this.model.get("dataProperties");
			//locationFilter.setDefaultLocation([properties.latitude, properties.longitude]);
			searchBox.setDefaultLocation([properties.latitude, properties.longitude]);
		},
        parseZoom: function (str, defaultValue) {
            var retValue = defaultValue;
            if (str !== null) {
                if (str.length > 0) {
                    if (!isNaN(str)) {
                        retValue = parseInt(str);
                    }
                }
            }
            return retValue;
        }
    });
    api.init = function () {
        var i,
            mapElements = $(".map.component:not(.initialized)"),
            count = mapElements.length;
        if (typeof (XA.component.search) !== "undefined") {
            queryModel = XA.component.search.query;
            urlHelperModel = XA.component.search.url;
            apiModel = XA.component.search.ajax;
            locationFilter = XA.component.search.locationfilter;
            searchBox=XA.component.search.box;
			
            //if the page was reloaded there could be situation that search results will load results faster then map initialization
            //so that we have to save them and pass to the models when they will be created
            XA.component.search.vent.on("results-loaded", resultsLoaded);
            //the same with "my location", sometimes Location Filter component can change location before map was initialized
            XA.component.search.vent.on("my-location-coordinates-changed", myLocationChanged);
        }
        mapsConnector = XA.connector.mapsConnector;
        if (count > 0) {
            for (i = 0; i < count; i++) {
                var $map = $(mapElements[i]);
                var properties = $map.data("properties");
                key = properties.key;
                searchEndpoint = properties.endpoint;
                searchResultsSignatures.push(properties.searchResultsSignature)
                $map.addClass("initialized");
                maps.push($map);
            }
            if (!scriptsLoaded) {
                mapsConnector.loadScript(key, XA.component.map.scriptsLoaded);
            } else {
                initialize();
            }
        }
    };
    api.scriptsLoaded = function () {
        console.log("Maps api loaded");
        scriptsLoaded = true;
        initialize();
    };
    api.getSearchEndpoint = function () {
        return searchEndpoint;
    };
    api.getSignatures = function () {
        return searchResultsSignatures;
    }
    return api;
}(jQuery, document));
XA.register("map", XA.component.map);
