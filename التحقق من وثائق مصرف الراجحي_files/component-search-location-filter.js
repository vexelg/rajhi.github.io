XA.component.search.locationfilter = (function ($, document) {

    "use strict";

    var api = {},
        locationFilters = [],
        views = [],
        queryModel,
        urlHelperModel,
        initialized = false,
        scriptsLoaded = false,
        mapsConnector = XA.connector.mapsConnector,
        LocationFilterModel,
        LocationFilterView,
        initialize,
		/*Start: added by ovrlod developer*/
		currentQuery,		
		currentBtn = $(".eh-current-btn"),
		recentSearches,
		myDefaultLocation,
        detectLocation;
		/*End: added by ovrlod developer*/

    initialize = function() {
        var i, view;
        for (i = 0; i < locationFilters.length; i++) {
            //crate Backbone.js views - one view per component on the page
            view = new LocationFilterView({el: locationFilters[i], model: new LocationFilterModel()});
        }
    };

    LocationFilterModel = Backbone.Model.extend({
        defaults: {
            dataProperties: {},
            sig: []
        },
        initAutocompleteEngine : function() {
            var _this = this,
                searchEngine;

            //initialize predictive only when number of predictions is non-zero
            if(_this.get("dataProperties").p > 0){
                    searchEngine = new Bloodhound({
                        datumTokenizer: Bloodhound.tokenizers.obj.whitespace("name"),
                        queryTokenizer: Bloodhound.tokenizers.whitespace,
                        limit :  _this.get("dataProperties").p,
                        remote : {
                            url : "-",
                            replace : function(){
                                return Date.now().toString();
                            },
                            transport : function(url,options, onSuccess, onError){
                                var queryParams =  _this.get("queryParams");
                                if(!queryParams.text){
                                    onSuccess([]);
                                    return;
                                }
                                mapsConnector.locationAutocomplete(queryParams,
                                    function(results){ //success
                                        onSuccess(results);
                                    },
                                    function(){ //fail
                                        onError("Could not autocomplete");
                                    });
                            }
                        }
                });
                searchEngine.initialize();
                this.set({"searchEngine" : searchEngine});
            }
        }
    });

    LocationFilterView = XA.component.search.baseView.extend({
        initialize: function () {
            var inst = this,
                dataProperties = this.$el.data(),
                $textBox = this.$el.find(".location-search-box-input");

            if (dataProperties.properties.searchResultsSignature === null) {
                dataProperties.properties.searchResultsSignature = "";
            }

            this.model.set({dataProperties: dataProperties.properties});
            this.model.set({sig: dataProperties.properties.searchResultsSignature.split(',')});
            this.model.set({queryParams : {maxResults : dataProperties.p, text : ""}});
            this.model.initAutocompleteEngine();
            var autocompleteEngine = this.model.get("searchEngine");

            if(autocompleteEngine){
                $textBox.typeahead({
                    hint : true,
                    minLength : 2
                },
                {
                    source : autocompleteEngine.ttAdapter(),
                    templates : {
                        suggestion : function(data) {							
							//Start: code updated by Ovrlod Developer to highlight the Branch and ATM suggestions							
							if(data.branchoratm !== undefined && data.branchoratm !== ''){
								return '<div class="suggestion-item item-bold">' + data.text + '</div>';
							}
							else{
								return '<div class="suggestion-item">' + data.text + '</div>';
							}
							//End: code updated by Ovrlod Developer to highlight the Branch and ATM suggestions
                        }
                    }
                }).on("typeahead:selected",function(args, selected){
                    inst.translateUserLocation(selected);
                    $textBox.typeahead("val",selected.text);					
                    inst.$el.find(".location-search-box-input.tt-input").attr("data-branchoratm", selected.branchoratm);
					inst.$el.find(".location-search-box-input.tt-input").attr("data-maintext", selected.structured_formatting.main_text );					
					inst.$el.find(".location-search-box-input.tt-input").blur();
                });
            }
            this.addressLookup();
        },
        events: {
            "click .location-search-box-button": "addressLookup",
            "keypress .location-search-box-input": "searchTextChanges",
            "keyup .location-search-box-input" : "autocomplete"			
			//"click .branch-locator-filters-box .location-filter .component-content > label" : "hideCloseButton"			
        },

		hideCloseButton :  function(){
			$('.branch-locator-filters-box .location-filter').removeClass("input-active");	
            $(".branch-locator-filters-box .location-filter .location-search-box-input").val("");					
		},
		
        addressLookup: function(e){
            var properties = this.model.get("dataProperties"),
                $textBox = this.$el.find(".location-search-box-input.tt-input"),
                lookupQuery = {
                    text : $textBox.length !== 0 ? $textBox.val() : this.$el.find(".location-search-box-input").val(),
                    maxResults : 1
                };

            switch (properties.mode) {
                case "Location": {
                    //use browser to detect location
                    this.detectLocation();
                    break;
                }
                case "UserProvided": {
                    //take address entered by user and try to convert it to latitude and longitude
                    this.translateUserLocation(lookupQuery);
                    break;
                }
                case "Mixed": {
                    //use user address otherwise try to detect location by browser
                    if (typeof(lookupQuery.text) === "undefined" || lookupQuery.text === "") {
                        this.detectLocation();
						//this.getDefaultLocationPoi();
                    } else {
                        this.translateUserLocation(lookupQuery);
                    }
                    break;
                }
            }
        },

        autocomplete : function(args){
            var $textBox,
                queryParams,
                properties = this.model.get("dataProperties");
			this.ToggleActiveInput();
            args.stopPropagation();
            if (args.keyCode === 13) {
                return;
            }
            $textBox = this.$el.find(".location-search-box-input.tt-input");

            queryParams = {
                text : $textBox.length !== 0 ? $textBox.val() : this.$el.find(".location-search-box-input").val(),
                maxResults : properties.p
            };
            this.model.set({queryParams : queryParams});
        },

        searchTextChanges: function(e) {						
            e.stopPropagation();
			/* Start: Code added by the ovrlod developer to active input and clear text CTA */
			this.ToggleActiveInput();
			//console.log("input-active");
            /* End: Code added by the ovrlod developer to active input and clear text CTA */
			if (e.keyCode === 13) {
                this.addressLookup(e);
                return false;
            }
            return true;
        },
        translateUserLocation: function(lookupQuery) {
            var that = this,
                properties = this.model.get("dataProperties"),
                hashObj = {};
				/* Start: varaible added by the ovrlod developer to hold the function argument to be used in callback*/
				that.currentQuery =  lookupQuery;
				/* Start: varaible added by the ovrlod developer to hold the function argument to be used in callback*/			

				
            if (lookupQuery.text === "") {
               // return;
			   
			   hashObj = this.createHashObject(myDefaultLocation[0] + "|" + myDefaultLocation[1], properties.f + ",Ascending");
                this.updateHash(hashObj, properties);
            }
			else
			{
			/* Start: code commneted by the ovrlod developer and add the following modification to hide irrelevant search results*/
			/*
            mapsConnector.addressLookup(lookupQuery, function(data) {
                hashObj = that.createHashObject(data[0] + "|" + data[1], properties.f + ",Ascending", that.currentQuery.branchoratm);
                that.updateHash(hashObj, properties);
            }, function () {
                console.error("Error while getting '" + lookupQuery.text + "' location");
            });
			
			*/
			/* End: code commneted by the ovrlod developer and add the following modification to hide irrelevant search results*/
			
			/* Start: code commneted by the ovrlod developer to hide  irrelevant search results*/
			mapsConnector.addressLookup(lookupQuery, function(data) {
				//$('.pws-search-results-scroll-container, .arb-irrelevant-result-map').removeClass('pws-force-hide');
				hashObj = that.createHashObject(data[0] + "|" + data[1], properties.f + ",Ascending", that.currentQuery.branchoratm, that.currentQuery.text);
                that.updateHash(hashObj, properties);
            }, function () {
				//$('.pws-search-results-scroll-container, .arb-irrelevant-result-map').addClass('pws-force-hide');
				//XA.connector.mapsConnector.forceClearCluster();
				//$('.pws-irrelevant-popup').removeClass('pws-force-hide');
				//$("a.irrelevent-search").attr("href", document.location.protocol +"//"+ document.location.hostname + document.location.pathname)
                console.error("Error while getting '" + lookupQuery.text + "' location");
            });
			}
			/* Start: code commneted by the ovrlod developer to hide  irrelevant search results*/
			
			//recentSearches.updateRecentSearchList(  selected);
			/* Start: code added by the ovrlod developer to add the data- attribute to selected suggestion from location finder*/
			if(lookupQuery.branchoratm !== undefined)
			{
				that.$el.find(".location-search-box-input.tt-input").attr("data-branchoratm",lookupQuery.branchoratm);
			}
			else
			{
				that.$el.find(".location-search-box-input.tt-input").attr("data-branchoratm",'');
			}
			if(lookupQuery.structured_formatting !== undefined)
			{
				that.$el.find(".location-search-box-input.tt-input").attr("data-maintext",lookupQuery.structured_formatting.main_text);
			}
			else
			{
				that.$el.find(".location-search-box-input.tt-input").attr("data-maintext",'');				
			}
            that.$el.find(".location-search-box-input.tt-input").blur();
			/* end: code added by the ovrlod developer to add the data- attribute to selected suggestion from location finder*/
        },
        detectLocation: function() {
            var properties = this.model.get("dataProperties"),
                $textBox = this.$el.find(".location-search-box-input"),
				
                sig = this.model.get("sig"),
                hash = queryModel.parseHashParameters(window.location.hash),
                param,
                hashObj = {},
                that = this;

             XA.component.locationService.detectLocation(
                function (location) {
                    hashObj = that.createHashObject(location[0] + "|" + location[1], properties.f + ",Ascending");
                    that.updateHash.call(that, hashObj, properties);
                    if ($textBox.length > 0) {
                        $textBox.attr("placeholder", properties.myLocationText);
						/*Start:  code added by ovrlod developer to show the information message for location service disable*/
						currentBtn.attr("class", "eh-current-btn");
						/*End:  code added by ovrlod developer to show the information message for location service disable*/
                    }
                },
                function (errorMessage) {
                    //do not update the hash in any way when then location isn't available
					/*Start:  code added by ovrlod developer to show the information message for location service disable*/
					currentBtn.attr("class", "eh-current-btn inactive");					
					that.showGeolocationWarning();	
					hashObj = that.createHashObject(myDefaultLocation[0] + "|" + myDefaultLocation[1], properties.f + ",Ascending");
					that.updateHash(hashObj, properties);					
					/*End:  code added by ovrlod developer to show the information message for location service disable*/
					
					console.log(errorMessage);
                }
          );
        },
		getDefaultLocationPoi:function()
		{
			 var properties = this.model.get("dataProperties"),
                $textBox = this.$el.find(".location-search-box-input"),
				
                sig = this.model.get("sig"),
                hash = queryModel.parseHashParameters(window.location.hash),
                param,
                hashObj = {},
                that = this;
				
				hashObj = this.createHashObject(myDefaultLocation[0] + "|" + myDefaultLocation[1], properties.f + ",Ascending");
                this.updateHash(hashObj, properties);			
		},
        updateHash: function (params, properties) {
            var sig = this.model.get("sig"),
                searchModels = typeof XA.component.search !== "undefined" ? XA.component.search.results.searchResultModels : [],
                i, j;

            //clear load more offset in each of search results with the same signature when location is changes
            //at the moment this is needed to clear offset but should be handle in search service in the future
            for (i = 0; i < searchModels.length; i++) {
                for (j = 0; j < sig.length; j++) {    
                    if (searchModels[i].get("dataProperties").sig === sig[j]) {
                        searchModels[i].set("loadMoreOffset", 0);
                    }
                }
            }

            queryModel.updateHash(params, properties.targetUrl);
            for (i = 0; i < sig.length; i++) {
                XA.component.search.vent.trigger("my-location-coordinates-changed", {
                    sig: sig[i],
                    coordinates: params[sig[i] !== "" ? sig[i] + "_g" : "g"].split("|")
                });
            }
        },
        createHashObject: function(g, o,b,q) {
            var sig = this.model.get("sig"),
                signature, 
                hashObj = {},
                i;

            for (i = 0; i < sig.length; i++) {
                signature = sig[i];
                hashObj[signature !== "" ? signature + "_g" : "g"] = g;
                hashObj[signature !== "" ? signature + "_o" : "o"] = o;
				if(q!== undefined )
				{
					hashObj[signature !== "" ? signature + "_q" : "q"] = q;
				}
				else
				{
					hashObj[signature !== "" ? signature + "_q" : "q"] = '';
				}
				if( Globalresources.isEnableDistanceFilter.toLowerCase() === 'true'){
					hashObj[signature !== "" ? signature + "_distance" : "distance"] = parseInt(Globalresources.mapradius);
				}
				if(b !== undefined)
				{
					hashObj[signature !== "" ? signature + "_branchesoratm" : "branchesoratm"] = b;
				}
            }

            return hashObj;
        },
		
		/*Start:  Function added by ovrlod developer to show the information message for location service disable*/
		showGeolocationWarning:function()
		{
			if (jQuery(window).width() < 769){
				
				var geolocationWarning = jQuery('.pws-geolocation-warning')
				if(geolocationWarning !== undefined)
				{
					geolocationWarning.show();
				}
			}			
			jQuery('.geolocation-close').on('click', this.hideGeolocationWarning);
		},

		hideGeolocationWarning:function(e)
		{
			var geolocationWarning =  jQuery('.pws-geolocation-warning')
			if(geolocationWarning !== undefined)
			{
				geolocationWarning.hide();
			}
		},

		ToggleActiveInput : function()
		{
			if(jQuery('.location-search-box-input.tt-input').val().length >= 1) 
			{
				$('.branch-locator-filters-box .location-filter').addClass("input-active");			
			} else 
			{
				$('.branch-locator-filters-box .location-filter').removeClass("input-active");			
			}
		}
		/*End:  Function added by ovrlod developer to show the information message for location service disable*/
	
    });

    api.init = function() {
        if ($("body").hasClass("on-page-editor") || initialized) {
            return;
        }

        queryModel = XA.component.search.query;
        urlHelperModel = XA.component.search.url;
		recentSearches = XA.component.recentsearches;

        var components = $(".location-filter:not(.initialized)");
        _.each(components, function(elem) {
            var $el = $(elem),
                properties = $el.data("properties");

            //collect all found components - we will use them later to create views
            locationFilters.push($el);

            //load google or bing scripts in order to properly use address lookup functionality but just
            //when we are not in Location mode (in this mode we are taking location form the browser)
            if (!scriptsLoaded && properties.mode !== "Location") {
                mapsConnector.loadScript(properties.key, XA.component.search.locationfilter.scriptsLoaded);
            } else {
                initialize();
            }

            $el.addClass("initialized");
        });
        initialized = true;
    };

    api.scriptsLoaded = function() {
        if (!scriptsLoaded) {
            console.log("Maps api loaded");
            scriptsLoaded = true;
            initialize();
        }
    };
    api.setDefaultLocation = function (data) {
        myDefaultLocation = data;
    };
    api.detectCurrentLocation = function () {
        //detectLocation();
        console.log(LocationFilterView);
        debugger;
    }
    return api;

}(jQuery, document));

XA.register("locationfilter", XA.component.search.locationfilter);
