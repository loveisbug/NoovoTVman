var LiveTVItem = '<li data-icon="false">\
						<a href="#" style="padding:0;margin:0" class="channelItem">\
							<div id="channelListDiv">\
								<div style="float:left;margin-left: 1em;"><img class="channelIcon" src="./img/a_m6.png" /></div>\
								<div style="float:left;margin: 1em 1em;"><span style="font-size:1em;" class="channelName">6 6M</span></div>\
							</div>\
						</a>\
						<div class="channelItemMaskDiv">\
                        	<div class="channelItemCheckBox ui-icon-custom-channel-unselect" data-isCheck="false"></div>\
                        </div>\
					</li> ';

var RegionItem = '<li dat-icon="false">France</li>';

function init() {
    window.location = "native://LiveTVInit";
}

/*=======================================public slot============================================*/
function onDataWithJSON(data, key) {
    var temp;
    if(browser.versions.android) {
        temp = eval( "(" + data + ")" );
    } else {
        temp = data;
    }

	if(key == "LiveTVInit"){
		$.mobile.changePage("#liveTVPage",  { transition: "none"});

		var channelList 		= temp.ChannelList;
		var regionList 			= temp.RegionList;
		var channelList         = temp.ChannelList;
		var regionList          = temp.RegionList;
		var playingChannelIndex = temp.PlayingChannelIndex;
		var currentRegionIndex  = temp.CurrentRegionIndex;

		initChannelList(channelList);
		findPlayingChannel(playingChannelIndex);
		initRegionList(regionList, currentRegionIndex);

	} else if(key == "UpdateChannel") {
		initChannelList(temp);
		$.mobile.changePage("#liveTVPage",  { transition: "none"});

	} else if(key == "UpdateScanStatus") {

		$.mobile.changePage("#searchingPage", {transition:"pop"});

		var currentIndex = temp.CurrentIndex;
		var totalChannel = temp.TotalChannel;
		var statusString = temp.StatusString;
		var fondChannel  = temp.FoundChannel;

		updateScanStatus(currentIndex, totalChannel, statusString, fondChannel);
	}
}

/*=======================================Init function============================================*/
function initChannelList(data) {

	var channelList = $("#channelList");
	channelList.children().remove();
	channelList.empty();
	$("#delButton").css("display","none");
	$("#back_liveTV").css("display","none");
	$("#editButton").css("display","block");
	$("#searchButton").css("display","block");

	$.each(data, function(index,  value) {
		var channelName	= value.ChannelName;
		var networkId   = value.NetworkId;
		var tsId 	    = value.TsId;
		var serviceId   = value.ServiceId;
		var iconKey     = getChannelIconKey(networkId, tsId, serviceId);
		var iconName    = getIconNameFromKey(iconKey);
		var channelItem = $(LiveTVItem);

		channelItem.find(".channelName").html(channelName);
		channelItem.find(".channelIcon").attr("src", "./img/"+ iconName +".png");

		channelList.append(channelItem);
	});
	
	channelList.listview('refresh');
}

function initRegionList(data, currentRegionIndex) {
	var regionList = $("#RegionList");
	regionList.children().remove();
	regionList.empty();

	$.each(data, function(index, value) {
		var regionName = value;
		var regionItem = $(RegionItem);

		regionItem.html(regionName);

		if (currentRegionIndex == index) {
			regionItem.addClass("ui-btn-icon-right ui-icon-custom-check");
		};

		regionList.append(regionItem);
	});
	regionList.listview('refresh');
}

/*=======================================public signal============================================*/
function playLive(channelIndex) {
    window.location = "native://PlayLive?" + channelIndex;
}

function deleteChannels(channelIndexsJosnArray) {
    window.location = "native://DelChannels?" + JSON.stringify(channelIndexsJosnArray);
}

function changeRegion(regionIndex) {
    window.location = "native://ChangeRegion?" + regionIndex;
}

function scanChannel() {
    window.location = "native://ScanChannel";
}

function cancelScan() {
	window.location = "native://CancelScan";
}

/*=======================================private function============================================*/
function findPlayingChannel(chnannelIndex) {
	if(chnannelIndex != -1) {
		var channelList = $("#channelList");
		channelList.find("li:eq("+ chnannelIndex + ")").addClass("currentPlayingChannel");
	}
}

function updateScanStatus(currentIndex, maxIndex, statusString, foundChannel) {
	var progressWdith = $(".progressBackground").width();
	if(currentIndex <= maxIndex) {
		var pbarWith = progressWdith * currentIndex / maxIndex;
		$(".progressScrollBar").stop().animate({width:pbarWith});
		$(".currentValue").html(currentIndex);
		$(".maxValue").html(maxIndex);
		$(".searchStatus").html(statusString);
		$(".proNum").html(foundChannel);
	} 
}

function clearProgressInfo() {
	$(".progressScrollBar").width(0);
	$(".currentValue").html("&nbsp;");
	$(".maxValue").html("&nbsp;");
	$(".searchStatus").html("&nbsp;");
	$(".proNum").html("&nbsp;");
}

/*=======================================JQuery Binding============================================*/
$(document).ready(function() {
	$("#editButton").on("click", function() {
		$("#editButton").css("display","none");
		$("#delButton").css("display","block");
		$("#searchButton").css("display","none");
		$("#back_liveTV").css("display","block");
		$(".channelItemMaskDiv").css("display","block");
	});
	$("#delButton").on("click", function() {
		var checkedBox = $(".channelItemCheckBox[data-ischeck='true']");

		if( checkedBox.length != 0 ) {
			var jsonArray = [];
			$.each(checkedBox, function(index, value) {
				var jsonChannel = {};
				jsonChannel.ChanneIndex = $(value).parents("li").index();
				jsonArray.push(jsonChannel);

				$(value).parents("li").remove();
			});

			deleteChannels(jsonArray);
		}
	});
	$("#back_liveTV").on("click", function() {
        var CheckBox = $(".channelItemCheckBox");

		CheckBox.removeClass("ui-icon-custom-channel-selected");
		CheckBox.addClass("ui-icon-custom-channel-unselect");
        CheckBox.attr("data-isCheck", "false");

		$("#editButton").css("display","block");
        $("#delButton").css("opacity","0.5");
		$("#delButton").css("display","none");
		$("#searchButton").css("display","block");
		$("#back_liveTV").css("display","none");
		$(".channelItemMaskDiv").css("display","none");

	});

	$("body").on("click", ".channelItem", function() {
        var channelIndex = $(this).parent().index();
        playLive(channelIndex);
    });

    $("body").on("click", ".channelItemMaskDiv", function() {
        var CheckBox = $(this).find(".channelItemCheckBox");
		var checkedBox = $(".channelItemCheckBox[data-ischeck='true']");
        if(CheckBox.attr("data-isCheck") == "false") {
			CheckBox.removeClass("ui-icon-custom-channel-unselect");
			CheckBox.addClass("ui-icon-custom-channel-selected");
            CheckBox.attr("data-isCheck", "true");
            $("#delButton").css("opacity","1");
        } else {
			CheckBox.removeClass("ui-icon-custom-channel-selected");
			CheckBox.addClass("ui-icon-custom-channel-unselect");
            CheckBox.attr("data-isCheck", "false");
            if(checkedBox.length == 1) {
            	$("#delButton").css("opacity","0.5");
            }
        }
    });

	$("#searchButton").on("click",function(){
		$.mobile.changePage("#RegionListPage", { transition: "slide"});
	});

	$("body").on("click", "#RegionList>li", function() {
		$(this).addClass("ui-btn-icon-right ui-icon-custom-check").siblings().removeClass("ui-btn-icon-right ui-icon-custom-check");

		var regionIndex = $(this).index();
		changeRegion(regionIndex);
		clearProgressInfo();
		setTimeout("scanChannel()", 10);
    });

    $("#cancelButton").on("click", function() {
    	cancelScan();
    });

});