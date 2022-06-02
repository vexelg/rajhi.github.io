filterData = null;
currquarter = 'all';
pages = 0;
pageCount = 0;
pageIndex = 0;
uniquefilters = [];
filters = [];
viewAll = [];
archive = [];
jQuery(document).ready(function () {

    var containerBasel = jQuery(".pws-basel-report");
    if (containerBasel.length > 0) {
        GenerateFilter();
        GetFilteredItems(currquarter);
        jQuery("#view-all-basel-report").append(' ('+ viewAll.length + ')');
        jQuery('#quarters-basel-report').delegate('li', 'click', function () {
            currquarter = jQuery(this).find('a').data('quarter');
            jQuery("#quarters-basel-report li").removeClass("active");
            jQuery(this).addClass("active");
            jQuery('#basel-rep-con').empty();
            pageCount = 0;
            pageIndex = 0;
            GetFilteredItems(currquarter);
        });

        jQuery("#load-more-basel-reports").click(function () {
            LoadMoreBasel();
        });
    };



    function GetFilteredItems(currquarter) {
        if (typeof modelReport !== 'undefined') {
            if (currquarter != 'all' && currquarter != 'archive') {
                filterData = jQuery.grep(modelReport, function (element, index) {
                    return element.currQuarter == currquarter;
                });
                pages = paginate(pageSizeReport, filterData)
            }
            else if (currquarter == 'archive') {
                viewAll = [];
                for (var fl = 5; fl < archive.length; fl++) {
                    for (var i = 0; i < modelReport.length; i++) {
                        if (modelReport[i].currQuarter == archive[fl]) {
                            viewAll.push(modelReport[i]);
                        }
                    }
                }
                pages = paginate(pageSizeReport, viewAll);
            }
            else { //all items
                viewAll = [];
                for (var fl = 0; fl < filters.length; fl++) {
                    for (var i = 0; i < modelReport.length; i++) {
                        if (modelReport[i].currQuarter == filters[fl]) {
                            viewAll.push(modelReport[i]);
                        }
                    }
                }
                pages = paginate(pageSizeReport, viewAll);
            }

            pageCount = pages.length;
            if (pageCount > 0) {
                BuildBaselReportsGrid();
            }
            else {
                jQuery("#load-more-basel-reports").hide();
            }

        }
    }

    function BuildBaselReportsGrid() {
        if (typeof modelReport !== 'undefined' && containerBasel.length>0) {
            var strReportsHtml = '';
            for (var i = 0; i < pages[pageIndex].items.length; i++) {
               
				
				strReportsHtml += "<li class='active'><span class='rpt-title'>" + pages[pageIndex].items[i].ReportTitle + "</span><div class='file-links-box'><ul class='list-inline'>";
                strReportsHtml += "<li><a href=" + pages[pageIndex].items[i].EnglishFile + ">"+BRresources.English+"</a></li>";
                strReportsHtml += "<li><a href=" + pages[pageIndex].items[i].ArabicFile + ">"+BRresources.Arabic+"</a></li></ul></div></li>";
            }
            jQuery('#basel-rep-con').append(strReportsHtml);
            if (pageIndex != pageCount - 1) {
                jQuery("#load-more-basel-reports").show();
            }
            else {
                jQuery("#load-more-basel-reports").hide();
            }
        }
    }

    function GenerateFilter() {
        if (typeof modelReport !== 'undefined') {
            //get unique items based on quarter and year
            var flags = [], l = modelReport.length, i;
            for (i = 0; i < l; i++) {
                if (flags[modelReport[i].currQuarter]) continue;
                flags[modelReport[i].currQuarter] = true;
                uniquefilters.push(modelReport[i]);
                filters.push(modelReport[i].currQuarter);
                archive.push(modelReport[i].currQuarter);
            }
            //seperate first 5 quarters for if condition
            filters = filters.slice(0, 5);
            var count;
            if (uniquefilters.length < 5) {
                count = uniquefilters.length;
            }
            else {
                count=5
            }
            for (i = 0; i < count; i++) {
                jQuery(".filter ul").append("<li><a href='javascript:void(0)' data-quarter='" + uniquefilters[i].Quarter + uniquefilters[i].Year + "'>"+BRresources.Q+"" + uniquefilters[i].Quarter + " " + uniquefilters[i].Year + "</a></li>");
            }
            jQuery(".filter ul").append("<li><a href='javascript:void(0)' data-quarter='archive'>"+BRresources.Archive+"</a></li>");
			
        }
    }

    function LoadMoreBasel() {
        pageIndex++;
        BuildBaselReportsGrid();
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
