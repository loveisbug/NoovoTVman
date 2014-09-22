var currentWebViewIndex = 0;

function changeWebView(webviewIndex) {
    window.location = "native://WebView?" + webviewIndex;
}

function changeTab(tabIndex) {

	var item = $("#orgArea").children("td:eq(" + currentWebViewIndex + ")");
	item.find("div").fadeIn(0);

	var item = $("#selectedArea").children("td:eq(" + currentWebViewIndex + ")");
	item.find("div").fadeOut(100);

	var item = $("#orgArea").children("td:eq(" + tabIndex + ")");
	item.find("div").fadeOut(150);

	var item = $("#selectedArea").children("td:eq(" + tabIndex + ")");
	item.find("div").fadeIn(100);
}

$(document).ready(function () {
	$("td").click(function() {
		var tabIndex = $(this).index();
		if (currentWebViewIndex != tabIndex) {
			changeTab(tabIndex);

			currentWebViewIndex = tabIndex;
			changeWebView(tabIndex);
		}
	});
});