var filterData = null;
//noofYears = 10;
var currYear = 'all';

//pageSize = 3;
var pages = 0;
var pageCount = 0;
var pageIndex = 0;

var jQueryawardsContainer = jQuery('#awards-con');
var isLang = jQuery("html").attr("lang");
var jQueryawardData = {
    isRTL: isLang == "ar" ? !0 : !1,
    isOriginLeft: isLang == "en" ? !0 : !1,
    itemSelector: '.award'

};
jQuery(document).ready(function () {

    GetTimeline();
    GetFilteredItems(currYear);


    if (jQueryawardsContainer.length == 1) {
        jQueryawardsContainer.masonry(jQueryawardData);
    }


/*    jQuery('.cc-tabs-nav').delegate('li', 'click', function () {
        currYear = jQuery(this).find('a').data('year');
        jQuery(".cc-tabs-nav li").removeClass("active");
        jQuery(this).addClass("active");
        jQueryawardsContainer.html('');
        pageCount = 0;
        pageIndex = 0;
        GetFilteredItems(currYear);
        jQueryawardsContainer.masonry('destroy').masonry(jQueryawardData);
        //console.log("tabs");
    });*/

    jQuery('.cc-tabs-nav li a').on( 'click', function () {
        currYear = jQuery(this).data('year');
        jQuery(".cc-tabs-nav li").removeClass("active");
        jQuery(this).addClass("active");
        jQueryawardsContainer.html('');
        pageCount = 0;
        pageIndex = 0;
        GetFilteredItems(currYear);
        jQueryawardsContainer.masonry('destroy').masonry(jQueryawardData);
        //console.log("tabs");
    });

    jQuery("#load-more-awards").click(function () {
        LoadMore();
    });

    function GetTimeline() {
        var strHtml = '';
        if (typeof noofYears !== 'undefined' && noofYears>0) {
            strHtml += "<li role=\"presentation\" class=\"active\"><a href='javascript:void(0)' data-year='all' role=\"tab\" data-toggle=\"tab\" aria-expanded=\"true\">"+BAresources.All+"</a></li>";
            strHtml += "<li role=\"presentation\"><a href='javascript:void(0)' data-year='latest' role=\"tab\" data-toggle=\"tab\" aria-expanded=\"false\">"+BAresources.Latest+"</a></li>";
            var currentYear = new Date().getFullYear() - 1;
            for (var i = 1; i <= noofYears; i++) {
                strHtml += "<li role=\"presentation\"><a href='javascript:void(0)' data-year='" + currentYear + "' role=\"tab\" data-toggle=\"tab\" aria-expanded=\"false\">" + currentYear + "</a></li>";
                currentYear--;
            }
        }
        jQuery('.cc-tabs-nav').html(strHtml);
    }

    function GetFilteredItems(currYear) {

        if (typeof model !== 'undefined') {
            if (currYear == 'latest') {
                currYear = new Date().getFullYear();
            }

            if (currYear != 'all' && pageSize>0) {
                filterData = jQuery.grep(model, function (element, index) {
                    return element.AwardYear == currYear;
                });
                pages = paginate(pageSize, filterData);
            }
            else {
				if(pageSize>0){
                pages = paginate(pageSize, model); //Paginate all items
				}
            }


            pageCount = pages.length;
            if (pageCount > 0) {
                BuildAwardsGrid();
            }
            else {
                jQuery("#load-more-awards").hide();
            }
        }
    }

    function BuildAwardsGrid() {
        var strAwardsHtml = '';
        for (var i = 0; i < pages[pageIndex].items.length; i++) {
            strAwardsHtml += "<div class=\"award awards-overlay award-listing-item\"><div class=\"img-placeholder\"><img src=" + pages[pageIndex].items[i].ImageURL + " alt=''></div>" + pages[pageIndex].items[i].Description + "</div>";
        }
        jQueryawardsContainer.append(strAwardsHtml);
          var awardsOverlay = jQuery(".awards-overlay");
            if (awardsOverlay.length >= 1) {
                awardsOverlay.fancybox({
                    maxWidth: 1140,
                    maxHeight: 1120,
                    fitToView: false,
                    width: "70%",
                    padding: "0",
                    autoSize: false,
                    closeClick: false,
                    openEffect: "none",
                    closeEffect: "none",
                    wrapCSS: "dark-overlay-skin",
                    helpers: {
                        overlay: {
                            css: {"background-color": "#585858"}
                        }
                    }
                });
            }
        if (pageIndex != pageCount - 1) {
            jQuery("#load-more-awards").show();
        }
        else {
            jQuery("#load-more-awards").hide();
        }
        setTimeout(function(){
            jQueryawardsContainer.masonry('destroy').masonry(jQueryawardData);
        }, 10);
    }

    function LoadMore() {
        pageIndex++;
        BuildAwardsGrid();
    }



    //Pagination methods

    function takeItems(n, list) {
        return list.slice(0, n);
    }

    function dropItems(n, list) {
        return list.slice(n);
    }

    function concat(lists) {
        return Array.prototype.concat.apply(this, lists);
    }

    function divide(n, list) {
        if (list.length) {
            var head = takeItems(n, list);
            var tail = dropItems(n, list);
            return concat.call([head], [divide(n, tail)]);
        } else return [];
    }

    function paginate(n, list) {
        return divide(n, list).map(function (items, index) {
            var number = n * index;
            return {
                start: number + 1,
                end: number + items.length,
                items: items
            };
        });
    }


});


jQuery(window).load(function () {

    if (jQueryawardsContainer.length == 1) {
        jQueryawardsContainer.masonry(jQueryawardData);
    }
});