filterData = null;
curryear = 'all';
pages = 0;
pageCount = 0;
pageIndex = 0;
uniquefilters = [];
filters = [];
viewAll = [];
archive = [];
jQuery(document).ready(function () {
    var container = jQuery(".pws-quarterly-report");
    if (container.length > 0) {
        GenerateFilter();
        GetFilteredItems(curryear);
        jQuery("#view-all").append(' (' + viewAll.length + ')');
        jQuery('#quarters').delegate('li', 'click', function () {
            curryear = jQuery(this).find('a').data('year');
            jQuery("#quarters li").removeClass("active");
            jQuery(this).addClass("active");
            jQuery('.rep-con').empty();
            pageCount = 0;
            pageIndex = 0;
            GetFilteredItems(curryear);
        });

        jQuery("#load-more-reports").click(function () {
            LoadMore();
        });
    };



    function GetFilteredItems(curryear) {
        if (typeof modelQuartelyReport !== 'undefined') {
            if (curryear != 'all' && curryear != 'archive') {
                filterData = jQuery.grep(modelQuartelyReport, function (element, index) {
                    return element.Year == curryear;
                });
                pages = paginate(pageSizeQuarterlyReport, filterData)
            }
            else if (curryear == 'archive') {
                viewAll = [];
                for (var fl = 6; fl < archive.length; fl++) {
                    for (var i = 0; i < modelQuartelyReport.length; i++) {
                        if (modelQuartelyReport[i].Year == archive[fl]) {
                            viewAll.push(modelQuartelyReport[i]);
                        }
                    }
                }
                pages = paginate(pageSizeQuarterlyReport, viewAll);
            }
            else { //all items
                viewAll = [];
                for (var fl = 0; fl < filters.length; fl++) {
                    for (var i = 0; i < modelQuartelyReport.length; i++) {
                        if (modelQuartelyReport[i].Year == filters[fl]) {
                            viewAll.push(modelQuartelyReport[i]);
                        }
                    }
                }
                pages = paginate(pageSizeQuarterlyReport, viewAll);
            }

            pageCount = pages.length;
            if (pageCount > 0) {
                BuildQuarterlyReportsGrid();
            }
            else {
                jQuery("#load-more-reports").hide();
            }

        }
    }

    function BuildQuarterlyReportsGrid() {
        if (typeof modelQuartelyReport !== 'undefined') {
            var strReportsHtml = '';
            for (var i = 0; i < pages[pageIndex].items.length; i++) {
				strReportsHtml += "<li class='active'><span class='rpt-title'>" + pages[pageIndex].items[i].ReportTitle + "</span><div class='file-links-box'><ul class='list-inline'>";
                strReportsHtml += "<li><a href=" + pages[pageIndex].items[i].EnglishFile + ">"+QRresources.English+"</a></li>";
                strReportsHtml += "<li><a href=" + pages[pageIndex].items[i].ArabicFile + ">"+QRresources.Arabic+"</a></li></ul></div></li>";
            }
            jQuery('.rep-con').append(strReportsHtml);
            if (pageIndex != pageCount - 1) {
                jQuery("#load-more-reports").show();
            }
            else {
                jQuery("#load-more-reports").hide();
            }
        }
    }

    function GenerateFilter() {
        if (typeof modelQuartelyReport !== 'undefined') {
            //get unique items based on quarter and year
            var flags = [], l = modelQuartelyReport.length, i;
            for (i = 0; i < l; i++) {
                if (flags[modelQuartelyReport[i].Year]) continue;
                flags[modelQuartelyReport[i].Year] = true;
                uniquefilters.push(modelQuartelyReport[i]);
                filters.push(modelQuartelyReport[i].Year);
                archive.push(modelQuartelyReport[i].Year);
            }
            //seperate first 6 years for if condition
            filters = filters.slice(0, 6);
            var count;
            if (uniquefilters.length < 6) {
                count = uniquefilters.length;
            }
            else {
                count = 6
            }
            for (i = 0; i < count; i++) {
                jQuery(".filter ul").append("<li><a href='javascript:void(0)' data-year='" + uniquefilters[i].Year + "'>" + uniquefilters[i].Year + "</a></li>");
            }
            jQuery(".filter ul").append("<li><a href='javascript:void(0)' data-year='archive'>"+QRresources.Archive+"</a></li>");
        }
    }

    function LoadMore() {
        pageIndex++;
        BuildQuarterlyReportsGrid();
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
