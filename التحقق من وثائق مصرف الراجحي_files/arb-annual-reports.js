filterData = null;
pages = 0;
pageCount = 0;
pageIndex = 0;
jQuery(document).ready(function () {
    var container = jQuery(".pws-annual-report");
    if (container.length > 0) {       
        GetFilteredItems();
        jQuery("#view-all").append(' (' + viewAll.length + ')');
        jQuery("#load-more-annual-reports").click(function () {
            LoadMoreAnnual();
        });
    };
    function GetFilteredItems() {
        if (typeof modelAnnualReport !== 'undefined' && pageSizeAnnualReport>0) {
            {//all items
                pages = paginate(pageSizeAnnualReport, modelAnnualReport);
                pageCount = pages.length;
                if (pageCount > 0) {
                    BuildAnnualReportsGrid();
                }
                else {
                    jQuery("#load-more-annual-reports").hide();
                }

            }
        }
    }

        function BuildAnnualReportsGrid() {
            if (typeof modelAnnualReport !== 'undefined') {
                var strReportsHtml = '';
                for (var i = 0; i < pages[pageIndex].items.length; i++) {
               
				
                    strReportsHtml += "<li class='active'><span class='rpt-title'>" + pages[pageIndex].items[i].ReportTitle + "</span><div class='file-links-box'><ul class='list-inline'>";
                    strReportsHtml += "<li><a href=" + pages[pageIndex].items[i].EnglishFile + ">"+ARresources.English+"</a></li>";
                    strReportsHtml += "<li><a href=" + pages[pageIndex].items[i].ArabicFile + ">"+ARresources.Arabic+"</a></li></ul></div></li>";
                }
                jQuery('#annual-rep-con').append(strReportsHtml);
                if (pageIndex != pageCount - 1) {
                    jQuery("#load-more-annual-reports").show();
                }
                else {
                    jQuery("#load-more-annual-reports").hide();
                }
            }
        }

        

        function LoadMoreAnnual() {
            pageIndex++;
            BuildAnnualReportsGrid();
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
