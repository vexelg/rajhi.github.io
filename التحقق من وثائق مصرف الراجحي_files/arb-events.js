filterData = null;
currmonth = 'all';
pages = 0;
pageCount = 0;
pageIndex = 0;
current = [];
filters = [];
viewAll = [];
upcoming = [];
archive = [];
var mm;
var yyyy;
var currDate;
var todaydate;
var d = new Date();
var month;

var filterMonths=[]
jQuery(document).ready(function () {
    var container = jQuery(".pws-events");
    if (container.length > 0) {
		if(Eventsresources.Culture == "ar"){
 month =["يناير", "فبراير", "مارس", "إبريل", "مايو", "يونيو",
              "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
}
else{
month=	 ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']	;	  
}
        var q = new Date();
        var dd = q.getDate();
        mm = q.getMonth() + 1; //January is 0!
        yyyy = q.getFullYear();

        if (dd < 10) {
            dd = '0' + dd
        }

        if (mm < 10) {
            mm = '0' + mm
        }

        q = mm + '/' + dd + '/' + yyyy;
        currDate = new Date(q);
        todaydate =new Date(currDate);
        GenerateFilter();
        GetFilteredItems(currmonth);
        jQuery("#view-all").append(' (' + viewAll.length + ')');
        jQuery('#months').delegate('li', 'click', function () {
            currmonth = jQuery(this).find('a').data('month');
            jQuery("#months li").removeClass("active");
            jQuery(this).addClass("active");
            jQuery('.rep-con').empty();
            pageCount = 0;
            pageIndex = 0;
            GetFilteredItems(currmonth);
        });

        jQuery("#load-more-events").click(function () {
            LoadMore();
        });


    };



    function GetFilteredItems(currmonth) {
        if (typeof modelEvent !== 'undefined') {
            if (currmonth != 'all' && currmonth != 'upcoming' && currmonth != 'archive') {
                filterData = jQuery.grep(current, function (element, index) {
                    return element.currMonth == currmonth;
                });
                pages = paginate(pageSizeEvent, filterData)
            }
            else if (currmonth == 'upcoming') {
                
                pages = paginate(pageSizeEvent, upcoming);
            }
            else if (currmonth == 'archive') {                
                pages = paginate(pageSizeEvent, archive);
            }

           
            else { //all items
                viewAll = [];                
                viewAll= viewAll.concat(upcoming,current);
                pages = paginate(pageSizeEvent, viewAll);
            }

            pageCount = pages.length;
            if (pageCount > 0) {
                BuildEventsGrid();
            }
            else {
                jQuery("#load-more-events").hide();
            }

        }
    }
    function BuildEventsGrid() {
        if (typeof modelEvent !== 'undefined') {
            var strReportsHtml = '';
            
            for (var i = 0; i < pages[pageIndex].items.length; i++) {

                strReportsHtml += "<li><div class='pws-listing-item events-item offers-overlay'><div class='pws-image-box'> <div class='field-thumbnailimage pws-thumb-logo'><img src=" + pages[pageIndex].items[i].Image + "/> </div> </div>";
                strReportsHtml += "<div class='pws-content-box'><div class='field-publishedstartdate'><span class='lbl'>"+Eventsresources.Starts+"</span>" + pages[pageIndex].items[i].Month + " " + new Date(pages[pageIndex].items[i].strDate).getDate() + " ," + pages[pageIndex].items[i].Year + "</div>";
                if (new Date(pages[pageIndex].items[i].EndDate) > new Date(pages[pageIndex].items[i].strDate)) {
                    strReportsHtml += "<div class='field-publishedenddate'><span class='lbl'>"+Eventsresources.Ends+"</span>" + month[new Date(pages[pageIndex].items[i].EndDate).getMonth()] + " " + new Date(pages[pageIndex].items[i].EndDate).getDate() + " ," + new Date(pages[pageIndex].items[i].EndDate).getFullYear() + "</div>";
                }
				strReportsHtml += "<div class='pws-title-heading field-title'>"+ pages[pageIndex].items[i].Title +"</div>";
                strReportsHtml += "<div class='pws-title-description field-title'>" + pages[pageIndex].items[i].Description + "</div>";
                strReportsHtml += "</div></div></li>";
            }
            jQuery('.rep-con').append(strReportsHtml);
			var offersOverlay = jQuery(".offers-overlay");
            if (offersOverlay.length >= 1) {
                offersOverlay.fancybox({
                    maxWidth: 1140,
                    maxHeight: 1120,
                    fitToView: false,
                    width: "80%",
                    height: "80%",
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
                jQuery("#load-more-events").show();
            }
            else {
                jQuery("#load-more-events").hide();
            }
        }
    }
    //function BuildEventsGrid() {
    //    if (typeof modelEvent !== 'undefined') {
    //        var strReportsHtml = '';
    //        for (var i = 0; i < pages[pageIndex].items.length; i++) {

    //            strReportsHtml += "<div><h3 class='event-title'>" + pages[pageIndex].items[i].Title + "</h3>";
    //            strReportsHtml += "<p> Starts:" + pages[pageIndex].items[i].Month + " " + new Date(pages[pageIndex].items[i].strDate).getDate() + " ," + pages[pageIndex].items[i].Year + "</p>";
    //            if (new Date(pages[pageIndex].items[i].EndDate) > new Date(pages[pageIndex].items[i].strDate))
    //                {
    //                    strReportsHtml += "<p> Ends:" + month[new Date(pages[pageIndex].items[i].EndDate).getMonth()] + " " + new Date(pages[pageIndex].items[i].EndDate).getDate() + " ," + new Date(pages[pageIndex].items[i].EndDate).getFullYear() + "</p>";
    //                }
    //            strReportsHtml += "<p>" + pages[pageIndex].items[i].Description + "</p>";
    //            strReportsHtml += "<img src=" + pages[pageIndex].items[i].Image + "/></div>";
    //        }
    //        jQuery('.rep-con').append(strReportsHtml);
    //        if (pageIndex != pageCount - 1) {
    //            jQuery("#load-more-events").show();
    //        }
    //        else {
    //            jQuery("#load-more-events").hide();
    //        }
    //    }
    //}
    
    function GenerateFilter() {
        if (typeof modelEvent !== 'undefined') {
            jQuery(".filter ul").append("<li class='active'><a id='view-all' href='javascript:void(0)' data-month='all'>"+Eventsresources.All+"</a></li>");
            jQuery(".filter ul").append(" <li><a id='upcoming' href='javascript:void(0)' data-month='upcoming'>"+Eventsresources.Upcoming+"</a></li>");
            filterMonths.push(month[todaydate.getMonth()] + todaydate.getFullYear())
            jQuery(".filter ul").append("<li><a href='javascript:void(0)' data-month='" + month[todaydate.getMonth()] + todaydate.getFullYear() + "'>" + month[todaydate.getMonth()] + " " + todaydate.getFullYear() + "</a></li>");
            for (var c = 1; c < 3; c++)
            {
                todaydate.setMonth(todaydate.getMonth() - 1);
                filterMonths.push(month[todaydate.getMonth()] + todaydate.getFullYear())
                jQuery(".filter ul").append("<li><a href='javascript:void(0)' data-month='" + month[todaydate.getMonth()] + todaydate.getFullYear() + "'>" + month[todaydate.getMonth()] + " " + todaydate.getFullYear() + "</a></li>");
            }
            jQuery(".filter ul").append("<li><a href='javascript:void(0)' data-month='archive'>"+Eventsresources.Archive+"</a></li>");
            for (var i = 0; i < modelEvent.length; i++)
            {
                if (new Date(modelEvent[i].strDate) > currDate)
                {
                    upcoming.push(modelEvent[i])
                }
                for (var j = 0; j < filterMonths.length; j++)
                {
                    if(modelEvent[i].currMonth==filterMonths[j])
                    {
                        current.push(modelEvent[i])
                    }
                }
                var tempDate = new Date(todaydate);
                tempDate.setDate(1);
                if (new Date(modelEvent[i].strDate) < tempDate)              
                {
                    archive.push(modelEvent[i])
                }
            }           
        }
    }

    function LoadMore() {
        pageIndex++;
        BuildEventsGrid();
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