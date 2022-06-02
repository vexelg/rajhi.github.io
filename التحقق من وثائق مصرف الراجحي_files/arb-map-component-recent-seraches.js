

XA.component.recentsearches = (function ($, document) {

    var recentsearches = {},
        recentSearchListBox,
        queryModel,
        urlHelperModel,
        initialized = false,
        recentHashValue,
        cookiename = 'recentlocationsearches',
        cookieExpirDays = 2,
        recentSerachesCount = 3,
        SearchListBoxModel,
        SearchListBoxView,
		currentQuery,
        mapsConnector = XA.connector.mapsConnector;

    initialize = function () {
        var view;
            //crate Backbone.js view
        view = new SearchListBoxView({ el: recentSearchListBox, model: new SearchListBoxModel() });
    };

    SearchListBoxModel = Backbone.Model.extend({
        defaults: {
            recenttemplate: "<% if(!results.length){ %><div class='no-results'>"+Globalresources.recentsearches+"</div> <% }else { %>" +
            "<% _.forEach(results, function(result){ %>" +
            "<div class='serach-item' data-searchFacet='<%= result.searchFacet %>' data-mainText='<%= result.mainText %>'><%= result.searchText %></div>" +
            "<% }); %>" +
            "<% } %>",
            dataProperties: {},
            sig: [],
            searches: [[],[],[]]
        },
       addSearchedTextToRecent: function (searchText, mainText, searchCordinates) {
            var searches = this.getRecentSearches();

            var d = new Date();
            d.setTime(d.getTime() + (cookieExpirDays * 24 * 60 * 60 * 1000));
            var expires = "expires=" + d.toUTCString();
            var recentSearch = {'searchText' : searchText, 'mainText': mainText, 'searchFacet': searchCordinates};
           
            var exsitingSerachIndex = this.getExistingSearchIndex(searches, searchText);
            if (exsitingSerachIndex === -1) {
				var searchTerm = '';
				
                var searchCount = searches.length;
                if (searchCount < recentSerachesCount) {
					
                    searches.unshift(recentSearch);
                } else {
                    searches.splice(2, 1);
                    searches.unshift(recentSearch);
                }
            }
            else {
                var shiftItem = searches.splice(exsitingSerachIndex, 1);
				if(shiftItem !== undefined)
				{
					searches.unshift(shiftItem[0]);
				}
            }

            document.cookie = encodeURI(cookiename + "=" + JSON.stringify(searches) + ";" + expires + ";path=/");
            this.set({ "searches": searches });
        },
        getRecentSearches: function () {
            var searches = [];
            var cookie = this.getCookie(cookiename);
            if (cookie !== "") {
                var cvalues = jQuery.parseJSON(cookie);
                searches = cvalues.filter(function (x) {
                    return x !== undefined
                });
            }

            return searches;
        },
        getCookie: function (cname) {
            var name = cname + "=";
            var decodedCookie = decodeURIComponent(document.cookie);
            var ca = decodedCookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) === ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) === 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        },
        getExistingSearchIndex: function (items, searchText) {
            var index = -1;
            for (var i = 0; i < items.length; i++) {
                var txt = items[i].searchText ;
                if (txt.toLowerCase() === searchText.toLowerCase()) {
                    index = i;
                    break;
                }
            }
            return index;
        }
    });

    SearchListBoxView = XA.component.search.baseView.extend({
        initialize: function () {
            var inst = this,
                dataProperties = this.$el.find(".recent-searches").data(),
                $searcheslist = this.$el.find(".pws-recent-searches-box"),
                $textBox = this.$el.find(".arb-map-search-box .search-box-input");
            if (typeof dataProperties !== "undefined") {
                if (dataProperties.properties.searchResultsSignature === null) {
                    dataProperties.properties.searchResultsSignature = "";
                }

                this.model.set({ dataProperties: dataProperties.properties });
                this.model.set({ sig: dataProperties.properties.searchResultsSignature.split(',') });
                this.model.set({ queryParams: { maxResults: dataProperties.p, text: "" } });
            }
            if (this.model) {
                this.model.on('change', this.render, this);
            }
            //this.addressLookup();
        },
        render: function () {
            var inst = this,
               results = inst.model.get("searches"),
			    template,  templateResult;

            if (typeof results === "undefined") {
                results = [];
            }
			
			/*Start: Code update by ovrlod developer to enable the recent search */
			if (results !== undefined) {                
                template = _.template(inst.model.get("recenttemplate"));                
                templateResult = template({ results: results});
            }
            this.$el.find(".pws-recent-searches-box").html(templateResult);			
			/*End: Code update by ovrlod developer to enable the recent search */
        },
        events: {
            "click .serach-item": "addressLookup",
            "blur .arb-map-search-box .search-box-input": "updateRecentSearchList",
			/*Start: event register by ovrlod developer to show the recent searched on mouse click*/
            "focus .location-search-box-input": "showRecentSearches",			
            "focus .arb-map-search-box .search-box-input": "showRecentSearches"			
			/*End: event register by ovrlod developer to show the recent searched on mouse click*/
            //"focus .location-search-box-input": "clearText"
        },
        clearText: function (e) {
            $(e.currentTarget).val("");
        },
        addressLookup: function (e) {
            var div = $(e.currentTarget);
            var text = div.text();
			var searchFacet = div.attr("data-searchFacet");
            var mainText = div.attr("data-mainText");
            var searchValue = {},
            sig = this.model.get("sig");
            lookupQuery = {
                text: text,
				mainText:mainText,
				searchFacet: searchFacet,
                maxResults: 1
            };

            for (i = 0; i < sig.length; i++) {
                searchValue[sig[i] + "_q"] = lookupQuery.text;                
            }
					
            this.$el.find(".arb-map-search-box .search-box-input.tt-input").val(text);
            this.$el.find(".arb-map-search-box .search-box-input").val(text);
            this.autocomplete(e);
            //this.translateUserLocation(lookupQuery);
            that.updateHash(searchValue ,this.model.get("dataProperties"));
			
			/*Start: code added by ovrlod developer*/
			this.$el.find('.pws-recent-searches-text').hide();
			$('body').addClass('autocomplete-done');
            $('.arb-map-search-box .search-box-input.tt-input').addClass('input-active');
			this.model.addSearchedTextToRecent(text, mainText,searchFacet)	;
			/*Start: code added by ovrlod developer*/
        },

        autocomplete: function (args) {
            var $textBox,
                queryParams,
                properties = this.model.get("dataProperties");

            args.stopPropagation();
            if (args.keyCode === 13) {
                return;
            }

            $textBox = this.$el.find(".arb-map-search-box .search-box-input.tt-input");

            queryParams = {
                text: $textBox.length !== 0 ? $textBox.val() : this.$el.find(".arb-map-search-box .search-box-input").val(),
                maxResults: properties.p
            };
            this.model.set({ queryParams: queryParams });
        },
        translateUserLocation: function (lookupQuery) {
            var that = this,
                sig = this.model.get("sig"),
                properties = this.model.get("dataProperties"),
                hashObj = {};
				
				that.currentQuery =  lookupQuery;

            if (lookupQuery.text === "") {
                this.updateHash(that.createHashObject("", "Distance,Ascending"), properties);
                return;
            }
            mapsConnector.addressLookup(lookupQuery, function (data) {
                hashObj = that.createHashObject(data[0] + "|" + data[1], "Distance,Ascending", that.currentQuery.searchFacet, that.currentQuery.text);
                that.updateHash(hashObj, properties);
            }, function () {
                console.error("Error while getting '" + lookupQuery.text + "' location");
            });
            //that.$el.find(".location-search-box-input.tt-input").blur();
        },
        detectLocation: function () {
            var properties = this.model.get("dataProperties"),
                $textBox = this.$el.find(".arb-map-search-box .search-box-input"),
                sig = this.model.get("sig"),
                hash = queryModel.parseHashParameters(window.location.hash),
                param,
                hashObj = {},
                that = this;

            XA.component.locationService.detectLocation(
               function (location) {
                   hashObj = that.createHashObject(location[0] + "|" + location[1], "Distance,Ascending");
                   that.updateHash.call(that, hashObj, properties);
                   if ($textBox.length > 0) {
                       $textBox.attr("placeholder", properties.myLocationText);
                   }
               },
               function (errorMessage) {
                   //if there is g param in the hash already then don't update g with empty value - case when with disabled location sharing someone typed his location
                   for (var i = 0; i < sig.length; i++) {
                       param = sig[i] !== "" ? sig[i] + "_g" : "g";
                       if (!hash.hasOwnProperty(param)) {
                           that.updateHash(that.createHashObject("", "Distance,Ascending"), properties);
                       }
                   }
                   console.log(errorMessage);
               }
         );
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
            /*
            for (i = 0; i < sig.length; i++) {
                XA.component.search.vent.trigger("my-location-coordinates-changed", {
                    sig: sig[i],
                    coordinates: params[sig[i] !== "" ? sig[i] + "_g" : "g"].split("|")
                });
            }*/
        },
        createHashObject: function (g, o,b,q) {
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
		updateRecentSearchList: function (e) {
            $textBox = this.$el.find(".arb-map-search-box .search-box-input.tt-input");
            var text = $textBox.length !== 0 ? $textBox.val() : this.$el.find(".arb-map-search-box .search-box-input").val();
			var branchoratm = $textBox.attr("data-branchoratm");
			var mainText = $textBox.attr("data-maintext");
			if (text !== "")
			{ 
				this.model.addSearchedTextToRecent(text, mainText, branchoratm);				
			}
        },	
		/*Start: function added by ovrlod developer*/
		showRecentSearches : function(e){
			e.stopPropagation();
			console.log("showRecentSearches");
			 
			var searches = this.model.getRecentSearches();
            
            this.model.set({ "searches": searches });
			this.render();
			recentSearchBox = this.$el.find(".pws-recent-searches-box div");
			if(recentSearchBox !== undefined && recentSearchBox.length > 0)
			{
				this.$el.find('.pws-recent-searches-text').show();
				$('body').removeClass('autocomplete-done');
                $('.arb-map-search-box .search-box-input').removeClass('input-active');	
				/*Start: code added by ovrlod developer*/		
			}			
		}
		/*End: function added by ovrlod developer*/
    });

    recentsearches.init = function () {
        if (jQuery("body").hasClass("on-page-editor") || initialized) {
            return;
        }

        queryModel = XA.component.search.query;
        urlHelperModel = XA.component.search.url;

        var $components = $(".pws-main-findabranch-container");
        
        recentSearchListBox = $components;

        initialize();

        initialized = true;
    };	
		
    return recentsearches;

}(jQuery, document));

XA.register("recentsearches", XA.component.recentsearches);
