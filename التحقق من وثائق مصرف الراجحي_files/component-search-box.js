XA.component.search.box = (function ($, document) {
    var api = {},
        searchBoxViews = [],
        searchBoxModels = [],
        queryModel,
        urlHelperModel,
        searchResultModels,
        myDefaultLocation,
        locationInterval,
        currentBtn = $(".eh-current-btn"),
        initialized = false;

    var SearchBoxModel = Backbone.Model.extend({
        defaults: {
            searchEngine: "",
            typeahead: "",
            dataProperties: {},
            searchQuery: "",
            loadingInProgress: false,
            sig: []
        },
        initSearchEngine: function () {
            var inst = this,
                siteName = XA.component.search.ajax.getPrameterByName("sc_site"),
                searchEngine = new Bloodhound({
                    datumTokenizer: Bloodhound.tokenizers.obj.whitespace("name"),
                    queryTokenizer: Bloodhound.tokenizers.whitespace,
                    limit: inst.get("dataProperties").p,
                    remote: {
                        url: urlHelperModel.createSiteUrl(inst.createSuggestionsUrl($.extend({ l: inst.getSearchResultsLanguage() }, inst.get("dataProperties")), inst.get("searchQuery")), siteName),
                        filter: function (list) {
                            var searchArr = [];
                            return _.map(list.Results, function (item) { return { html: item.Html }; });
                        },
                        replace: function () {
                            var valueProvider = inst.get("valueProvider"),
                                searchQuery = valueProvider(),
                                properties = $.extend({ l: inst.getSearchResultsLanguage() }, inst.get("dataProperties"));

                            return urlHelperModel.createSiteUrl(inst.createSuggestionsUrl(properties, searchQuery), siteName);
                        },
                        ajax: {
                            beforeSend: function () {
                                inst.set({ "loadingInProgress": true });
                            },
                            complete: function () {
                                inst.set({ "loadingInProgress": false });
                            }
                        }
                    }
                });

            searchEngine.initialize();
            this.set({ searchEngine: searchEngine });
                        

        },
        createSuggestionsUrl: function (properties, searchQuery) {
            var suggestionsMode = this.get("dataProperties").suggestionsMode,
                resultsEndpoint = this.get("dataProperties").endpoint,
                suggestionsEndpoint = this.get("dataProperties").suggestionEndpoint;
             if (properties.searchResultsSignature === "poisearch") {
                searchQuery = searchQuery.replace(/\-/g, ' ');
            }
            switch (suggestionsMode) {
                case "ShowPredictions": {
                    return urlHelperModel.createPredictiveSearchUrl(suggestionsEndpoint, properties, searchQuery);
                    break;
                }
                default: {
                    return urlHelperModel.createPredictiveSearchUrl(resultsEndpoint, properties, searchQuery);
                    break;
                }
            }
        },
        getSignature: function () {
            var rawSignature = this.get("dataProperties").searchResultsSignature,
                signatures;

            if (typeof rawSignature === "undefined" || rawSignature === null) {
                return "";
            }

            signatures = rawSignature.split(',');

            if (rawSignature === "") {
                return "";
            } else {
                return signatures[0];
            }
        },
        getSearchResultsLanguage: function () {
            var searchResultModels = XA.component.search.results.searchResultModels,
                signature = this.getSignature(),
                model = searchResultModels.filter(function (element) {
                    return element.get("dataProperties").sig === signature;
                })[0];
            if (typeof model !== "undefined") {
                return model.get("dataProperties").l;
            }
            return "";
        }
    });

    var SearchBoxView = XA.component.search.baseView.extend({
        initialize: function () {
            var inst = this,
                dataProperties = this.$el.data(),
                hashObj = queryModel.parseHashParameters(window.location.hash),
                $searchBox = this.$el.find(".search-box-input"),
                typeahead;

            dataProperties.properties.targetSignature = dataProperties.properties.targetSignature !== null ? dataProperties.properties.targetSignature : "";

            this.model.set({ dataProperties: dataProperties.properties });
            this.model.set("sig", this.translateSignatures(dataProperties.properties.searchResultsSignature, "q"));
            this.model.set("sigPOIsearch", dataProperties.properties.searchResultsSignature);
            this.model.initSearchEngine();
            this.model.on("change:loadingInProgress", this.loading, this);

            typeahead = this.$el.find(".search-box-input").typeahead({
                hint: true,
                minLength: 2
            },
                {
                    source: inst.model.get("searchEngine").ttAdapter(),
                    displayKey: function () { return inst.$el.find(".search-box-input.tt-input").val(); },
                    templates: {
                        suggestion: function (data) {
                            var suggestionsMode = dataProperties.properties.suggestionsMode;
                            text = $(data.html).text(),
                                suggestionText = text != "" ? text : data.html;
                            switch (suggestionsMode) {
                                case "ShowPredictions":
                                case "ShowSearchResultsAsPredictions": {
                                    return '<div class="sugesstion-item">' + suggestionText + '</div>';
                                }
                                default: {
                                    return '<div class="sugesstion-item">' + data.html + '</div>';
                                }
                            }
                        }
                    }
                }).on('typeahead:selected', this.suggestionSelected.bind(inst));

            //TODO: Seems like bellow line isn't needed as updateSearchBoxValue() function will be callend when hash will change - to be tested in non/multi signatures cases
            //$searchBox.val(hashObj[this.model.get("sig")] !== undefined ? hashObj[this.model.get("sig")] : "");

            this.model.set({ typeahead: typeahead });
            this.model.set({
                valueProvider: function () {
                    return inst.$el.find(".search-box-input.tt-input").val();
                }
            });
            XA.component.search.vent.on("hashChanged", this.updateSearchBoxValue.bind(this));
            if (dataProperties.properties.searchResultsSignature === "poisearch") {
                that = this;
                locationInterval = setInterval(function () {
                    if (myDefaultLocation !== 'undefined') { that.detectLocation(); }
                }
                    , 1000);
              $('.branch-locator-filters-box .arb-map-search-box .component-content > label').click(function(){
	            that.resetSearch();
             });
            }
			 
        },
        events: {
            "click .search-box-button": "updateQueryModelClick",
            "click .search-box-button-with-redirect": "updateQueryWithRedirect",
            "keypress .search-box-input.tt-input": "predictiveSearch",
            "keydown .search-box-input.tt-input": "predictiveSearch",
            "paste .search-box-input.tt-input": "onPasteRemove",
            "change .search-box-input.tt-input": "onSearchBoxChange",
			"blur .search-box-input.tt-input": "onSearchBoxBlur",
            
        },
        ToggleActiveInput: function () {
            if (jQuery('.arb-map-search-box .search-box-input.tt-input').length !== 0) {
                if (jQuery('.arb-map-search-box .search-box-input.tt-input').val().length >= 2) {
                    $('.arb-map-search-box').addClass("input-active");
                } else {
                    $('.arb-map-search-box').removeClass("input-active");
                }
            }
        },
        loading: function () {
            this.$el.toggleClass("loading-in-progress");
        },
        suggestionSelected: function (event, data) {
            event.preventDefault();

            var suggestionsMode = this.model.get("dataProperties").suggestionsMode,
                text = $($(data.html)[0]).text(),
                suggestionText = text != "" ? text : data.html,
                link;

            switch (suggestionsMode) {
                case "ShowPredictions":
                case "ShowSearchResultsAsPredictions": {
                    this.performSearch(suggestionText);
                    break;
                }
                default: {
                    link = $(data.html).find("a");
                    if (link.length) {
                        window.location.href = $(link[0]).attr("href");
                    }
                    break;
                }
            }
        },
        updateQueryWithRedirect: function (event) {
            event.preventDefault();

            var resultPage = this.model.get("dataProperties").resultPage,
                targetSignature = this.model.get("dataProperties").targetSignature,
                searchResultsSignature = this.model.get("dataProperties").searchResultsSignature,
                query = this.$el.find(".search-box-input.tt-input").val(),
                sig = this.model.get("sig"),
                queryWithSignature = {};

            if (targetSignature !== "") {
                queryWithSignature = this.updateSignaturesHash([targetSignature + "_q"], query, this.createOffsetObject())
            } else {
                queryWithSignature = this.updateSignaturesHash(sig, query, this.createOffsetObject())
            }

            window.location.href = urlHelperModel.createRedirectSearchUrl(resultPage, queryWithSignature, searchResultsSignature, targetSignature);
        },
        updateQueryModelClick: function (event) {
            event.preventDefault();
            var query = this.$el.find(".search-box-input.tt-input").val();
            this.closeDropdown();
            this.updateQueryModel(query);
        },
        updateQueryModel: function (query) {
            var searchValue = {},
                offsetSignatures = this.translateSignatures(this.model.get("dataProperties").searchResultsSignature, "e"),
                sig = this.model.get("sig"),
                i;

            for (i = 0; i < sig.length; i++) {
                searchValue[sig[i]] = query;
                searchValue[offsetSignatures[i]] = 0;
            }

            queryModel.updateHash(searchValue, this.model.get("dataProperties").targetUrl);
        },
        predictiveSearch: function (event) {
            this.ToggleActiveInput();
            
            if (event.keyCode === 60 || event.keyCode === 62)
            {
                return false;
            }

            if (event.keyCode === 13) {
                event.preventDefault();
                var userInput = this.$el.find(".search-box-input.tt-input").val();
                userInput = $("<div/>").text(userInput).html();
                this.performSearch(userInput);
            }
        },

        onPasteRemove : function(event){
            event.preventDefault();
            return false;
        },
        onSearchBoxChange : function(event)
        {
			var userInput = this.$el.find(".search-box-input.tt-input").val();
            if(userInput.indexOf('<') != -1 || userInput.indexOf('>') != -1)
            {
                return false;
            }
        },
		onSearchBoxBlur : function(event)
        {
			var userInput = this.$el.find(".search-box-input.tt-input").val();
            if(userInput.indexOf('<') != -1 || userInput.indexOf('>') != -1)
            {				
                return false;
            }
			else if(userInput.includes("&lt") || userInput.includes("&gt"))
			{
				this.$el.find(".search-box-input.tt-input").val('');
			}
        },


        
		resetSearch: function (event) {
			this.$el.find(".search-box-input.tt-input").val('');
            this.ToggleActiveInput();
            this.performSearch(this.$el.find(".search-box-input.tt-input").val());
        },
        performSearch: function (query) {
            var properties = this.model.get("dataProperties"),
                targetSignature = properties.targetSignature,
                searchResultsSignature = properties.searchResultsSignature,
                resultPage = properties.resultPage,
                sig = this.model.get("sig"),
                queryWithSignature = {};

            this.closeDropdown();

            // if (searchResultsSignature === "poisearch") {
                // query = query.replace(/\-/g, ' ');
            // }

            if (resultPage === "") {
                this.updateQueryModel(query);
                this.$el.find(".search-box-input.tt-input").blur().val(query);
            } else {
                if (targetSignature !== "") {
                    queryWithSignature = this.updateSignaturesHash([targetSignature + "_q"], query, this.createOffsetObject())
                } else {
                    queryWithSignature = this.updateSignaturesHash(sig, query, this.createOffsetObject())
                }
                window.location.href = urlHelperModel.createRedirectSearchUrl(resultPage, queryWithSignature, searchResultsSignature, targetSignature);
            }
        },
        createOffsetObject: function () {
            var sig = this.model.get("sig"),
                targetSignature = this.model.get("dataProperties").targetSignature,
                signature = targetSignature !== "" ? targetSignature : this.model.get("dataProperties").searchResultsSignature,
                offsetSignatures = this.translateSignatures(signature, "e"),
                offsetObject = {},
                i;

            for (i = 0; i < sig.length; i++) {
                offsetObject[offsetSignatures[i]] = 0;
            }

            return offsetObject;
        },
        updateSearchBoxValue: function () {
            var hashObj = queryModel.parseHashParameters(window.location.hash),
                el = this.$el.find(".search-box-input.tt-input"),
                sig = this.model.get("sig"),
                i;

            for (i = 0; i < sig.length; i++) {
                if (hashObj.hasOwnProperty(sig[i])) {
                    el.val(hashObj[sig[i]]);
                } else {
                    el.val("");
                }
            }
        },
        closeDropdown: function () {
            this.$el.find(".search-box-input").typeahead('close');
        },

        detectLocation: function () {
            clearInterval(locationInterval);
            var properties = this.model.get("dataProperties"),
                $textBox = this.$el.find(".search-box-input"),

                sig = this.model.get("sigPOIsearch"),
                hash = queryModel.parseHashParameters(window.location.hash),
                param,
                hashObj = {},
                that = this;

            XA.component.locationService.detectLocation(
                function (location) {
					var existhash=that.getUrlVars();
					XA.connector.mapsConnector.LocationShared=true;
                   hashObj = that.createHashObject(location[0] + "|" + location[1], "distance,Ascending");
				    //hashObj = that.createHashObject("24.7135517|46.67529569999999", "distance,Ascending");
                    that.updateHash.call(that, hashObj, properties);
                    if ($textBox.length > 0) {
                        /*Start:  code added by ovrlod developer to show the information message for location service disable*/
                        currentBtn.attr("class", "eh-current-btn");
                        /*End:  code added by ovrlod developer to show the information message for location service disable*/
                    }
                },
                function (errorMessage) {
                    //do not update the hash in any way when then location isn't available
                    /*Start:  code added by ovrlod developer to show the information message for location service disable*/
                    currentBtn.attr("class", "eh-current-btn inactive");
					XA.connector.mapsConnector.LocationShared=false;
                    hashObj = that.createHashObject("", "name,Ascending");
                    that.updateHash(hashObj, properties);
                    /*End:  code added by ovrlod developer to show the information message for location service disable*/

                    console.log(errorMessage);
                }
            );
        },
		getUrlVars:function ()
     {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('#') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
},
        updateHash: function (params, properties) {
            var sig = this.model.get("sigPOIsearch"),
                searchModels = typeof XA.component.search !== "undefined" ? XA.component.search.results.searchResultModels : [],
                i, j;

            //clear load more offset in each of search results with the same signature when location is changes
            //at the moment this is needed to clear offset but should be handle in search service in the future
            for (i = 0; i < searchModels.length; i++) {

                if (searchModels[i].get("dataProperties").sig === sig) {
                    searchModels[i].set("loadMoreOffset", 0);
                }
            }

            queryModel.updateHash(params, properties.targetUrl);

            /*
            XA.component.search.vent.trigger("my-location-coordinates-changed", {
                    sig: sig,
                    coordinates: params[sig !== "" ? sig + "_g" : "g"].split("|")
                });
            */
        },
        createHashObject: function (g, o, b, q) {
            var sig = this.model.get("sigPOIsearch"),
                signature,
                hashObj = {},
                i;

            hashObj[sig !== "" ? sig + "_g" : "g"] = g;
            hashObj[sig !== "" ? sig + "_o" : "o"] = o;
            if (q !== undefined) {
                hashObj[sig !== "" ? sig + "_q" : "q"] = q;
            }
            else {
                hashObj[sig !== "" ? sig + "_q" : "q"] = '';
            }
            if (Globalresources.isEnableDistanceFilter.toLowerCase() === 'true' && XA.connector.mapsConnector.LocationShared) {
                hashObj[sig !== "" ? sig + "_distance" : "distance"] = parseInt(Globalresources.mapradius);
            }
            if (b !== undefined) {
                hashObj[sig !== "" ? sig + "_branchesoratm" : "branchesoratm"] = b;
            }

            return hashObj;
        }


    });

    api.init = function () {
        if ($("body").hasClass("on-page-editor") || initialized) {
            return;
        }
        queryModel = XA.component.search.query;
        searchResultModels = XA.component.search.results.searchResultModels;
        urlHelperModel = XA.component.search.url;
        //  locationFilter = XA.component.search.locationfilter;

        var searchBox = $(".search-box:not(.initialized)");
        _.each(searchBox, function (elem) {
            var $el = $(elem);
            var boxModel = new SearchBoxModel();
            searchBoxModels.push(boxModel);
            searchBoxViews.push(new SearchBoxView({ el: $el, model: boxModel }));
            $el.addClass("initialized");
        });

        initialized = true;
    };
    api.setDefaultLocation = function (data) {
        myDefaultLocation = data;
    };

    api.searchBoxViews = searchBoxViews;
    api.searchBoxModels = searchBoxModels;

    return api;

}(jQuery, document));

XA.register('searchBox', XA.component.search.box);
