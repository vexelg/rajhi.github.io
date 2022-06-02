XA.component.search.results = (function($, document) {

    "use strict";

    var api = {},
        searchResultViews = [],
        searchResultModels = [],
        urlHelperModel,
        queryModel,
        apiModel,
		nearestBranches = $('.item-count'),
        initialized = false;

    var SearchResultModel = Backbone.Model.extend({
        defaults: {
            template: "<% if(!results.length){ %><div class='no-results'><%= noResultsText %></div> <% }else { %>" +
                "<ul class='search-result-list'> " +
                "<% _.forEach(results, function(result){ %>" +
                "<li " + "<% if(result.Geospatial){%>data-id='<%= result.Id %>' data-distance='<%= result.Geospatial.Distance.toFixed(2) %>' "+
				"data-longitude='<%= result.Geospatial.Longitude %>' data-latitude='<%= result.Geospatial.Latitude %>'<% } %>" + "><%= result.Html %></li>" +
                "<% }); %>" +
                "</ul>" +
                "<% } %>" +
                "<div class='search-result-overlay'>",
            templateItems: "<% _.forEach(results, function(result){ %>" +
                "<li " + "<% if(result.Geospatial){%>data-id='<%= result.Id %>' data-distance='<%= result.Geospatial.Distance.toFixed(2) %>'"+
				" data-longitude='<%= result.Geospatial.Longitude %>' data-latitude='<%= result.Geospatial.Latitude %>'<% } %>" + "><%= result.Html %></li>" +
                "<% }); %>",
            dataProperties: {},
            blockNextRequest: false,
            noResultsText: "",
            resultData: {},
            loadingInProgress: false,
            loadingMoreInProgress: false,
            resultDataMore: {},
            loadMoreOffset: 0,
            loadMore: false
        },
        initialize: function() {
            var hashObj = queryModel.parseHashParameters(window.location.hash),
                signature = encodeURIComponent(this.get("dataProperties").sig),
                offsetKey = "e_" + signature;

            //if there is "e" in hash object then one of page selectors on the page is global (not assigned to any of the
            //search results - in such case it will paginate all search results without signature
            if (hashObj.hasOwnProperty("e") && signature === '') {
                this.set("loadMoreOffset", parseInt(hashObj.e));
            }

            //check if there is page selector assigned to this specific search results
            if (hashObj.hasOwnProperty(offsetKey)) {
                this.set("loadMoreOffset", parseInt(hashObj[offsetKey]));
            }

            XA.component.search.vent.on("results-loaded", this.resultsLoaded.bind(this));
        },
        blockRequests: function(value) {
            this.set("blockNextRequest", value);
        },
        checkBlockingRequest: function() {
            return this.get("blockNextRequest");
        },
        getMyOffset: function() {
            var hash = queryModel.parseHashParameters(window.location.hash),
                signature = encodeURIComponent(this.get("dataProperties").sig);
            if (hash.hasOwnProperty("e_" + signature)) {
                return hash["e_" + signature];
            }
            return 0;
        },
        resultsLoaded: function(resultsData) {
            var signature = encodeURIComponent(this.get("dataProperties").sig);

            if (signature === resultsData.searchResultsSignature) {
                if (this.get("loadMore")) {
                    this.set({ resultDataMore: resultsData });
                    this.set({ loadingMoreInProgress: false });
                    this.unset("loadMore", { silent: true });
                } else {
                    this.set({ resultData: resultsData });
                    this.set({ loadingInProgress: false });
                }
				var offSet = resultsData.offset !== undefined ? resultsData.offset : 0;
				var dataLength = resultsData.data.length;
				
				if(resultsData.dataCount === 0 || (offSet + dataLength) === resultsData.dataCount)
				{
					jQuery('.component.load-more').addClass('hide-show-more');		
				}
				else if( (offSet + dataLength)  < resultsData.dataCount)
				{
					jQuery('.component.load-more').removeClass('hide-show-more');	
				}
                this.blockRequests(false);
				if($('.arb-map-search-box .search-box-input.tt-input').val().length==0)
				{
					$('.arb-map-search-box').removeClass("input-active");
				}
            }
        }
    });

    var SearchResultView = Backbone.View.extend({
        initialize: function() {
            var dataProperties = this.$el.data(),
                noResultsText = this.$el.find(".no-results").html(),
                maxHeight = 0,
                inst = this;

            if (dataProperties.properties.sig === null) {
                dataProperties.properties.sig = "";
            }

            if (this.model) {
                this.model.set({ dataProperties: dataProperties.properties, noResultsText: noResultsText });
            }

            this.model.on("change:loadingInProgress", this.loading, this);
            this.model.on("change:loadingMoreInProgress", this.loadingMore, this);
            this.model.on("change:resultData", this.render, this);
            this.model.on("change:resultDataMore", this.renderPart, this);

            XA.component.search.vent.on("add-variant-class", function(data) {
                var signature = inst.model.get("dataProperties").sig;
                if (data.sig === signature) {
                    inst.$el.removeClass(inst.$el.attr("data-class-variant"));
                    inst.$el.attr("data-class-variant", data.classes);
                    inst.$el.addClass(data.classes);
                }
            });

            XA.component.search.vent.on("loadMore", function(data) {
                var signature = inst.model.get("dataProperties").sig;
                if (data.sig === signature) {
                    XA.component.search.service.getData({
                        loadMore: "true",
                        p: inst.model.get("dataProperties").p,
                        singleRequestMode: signature
                    });
                }
            });

            XA.component.search.vent.on("my-location-coordinates-changed", function(data) {
                if (data.sig === inst.model.get("dataProperties").sig && inst.model.get("loadMore")) {
                    inst.$el.find(".search-result-list").html("");
                }
            });

            this.render();
        },

        events: {
            'click .search-result-list > li[data-longitude][data-latitude]': "poiClick",
			/*Start: event added by ovrlod developer to trigger the global search branch map marker */
			'click .search-result-list h4':"searchPoiClick"
			/*End: event added by ovrlod developer to trigger the global search branch map marker */
        },
        loading: function() {
            if (this.model.get("loadingInProgress")) {
                this.$el.addClass("loading-in-progress");
            } else {
                this.$el.removeClass("loading-in-progress");
            }
        },
        loadingMore: function() {
            if (this.model.get("loadingMoreInProgress")) {
                this.$el.addClass("loading-more-in-progress");
            } else {
                this.$el.removeClass("loading-more-in-progress");
            }
        },
        renderPart: function() {
            var template = _.template(this.model.get("templateItems"));
            var templateResult = template({ results: this.model.get("resultDataMore").data });
            this.$el.find(".search-result-list").append(templateResult);
			
			//this.model.get("dataProperties").p + this.model.get("resultDataMore").data.length === this.model.get("resultDataMore").dataCount;
        },
        render: function() {
            var inst = this,
                maxHeight = 0,
				count = '',
                results = inst.model.get("resultData").data;
            //check if we're opening page from disc - if yes then we are in Creative Exchange mode
            if (window.location.href.startsWith("file://")) {
                return;
            }
            if (typeof results === "undefined") {
                results = [];
            }

            var template = _.template(inst.model.get("template"));
            var templateResult = template({ results: results, noResultsText: inst.model.get("noResultsText") });
			//console.log('templateResult');
			//console.log(templateResult);
            this.$el.html(templateResult);
			count =  '('+ inst.model.get("resultData").dataCount +')';
			nearestBranches.text(count);
			/*
			var irrelevantsearch=$(".arb-irrelevant-result-map span.item-count").text()
			if(irrelevantsearch==="(0)")
			{
				$('.pws-irrelevant-popup').removeClass('pws-force-hide');
				$("a.irrelevent-search").attr("href", document.location.protocol +"//"+ document.location.hostname + document.location.pathname)
			}	
			*/
        },
        poiClick: function(e) {
            var li = $(e.currentTarget);

            XA.component.search.vent.trigger("center-map", {
                sig: this.model.get("dataProperties").sig,
                coordinates: [li.data('latitude'), li.data('longitude')],
                id: li.data('id')
            });
        },
		
		/*Start: function added by ovrlod developer to trigger the global search branch map marker */
        searchPoiClick: function(e) {
            var h4 = $(e.currentTarget);
			var lng=  h4.closest('li').find('.field-longitude').text();
			var lat=  h4.closest('li').find('.field-latitude').text();
			
            XA.component.search.vent.trigger("search-center-map", {
                sig: this.model.get("dataProperties").sig,
                coordinates: [lat, lng]
                
            });
        },		
		hideGeolocationWarning:function(e)
		{
			var geolocationWarning =  jQuery('.pws-geolocation-warning')
			if(!geolocationWarning)
			{
				geolocationWarning.hide();
			}			
		}	
		
		/*End: function added by ovrlod developer to trigger the global search branch map marker */
    });

    api.init = function() {
        if ($("body").hasClass("on-page-editor") || initialized) {
            return;
        }

        urlHelperModel = XA.component.search.url;
        queryModel = XA.component.search.query;
        apiModel = XA.component.search.ajax;

        var searchResults = $(".search-results");
        _.each(searchResults, function(elem) {
            var resultsModel = new SearchResultModel();
            searchResultModels.push(resultsModel);
            searchResultViews.push(new SearchResultView({ el: $(elem), model: resultsModel }));
        });

        initialized = true;
    };

    api.searchResultViews = searchResultViews;
    api.searchResultModels = searchResultModels;

    return api;

}(jQuery, document));

XA.register('searchResults', XA.component.search.results);