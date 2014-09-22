var currentTime			  = 0;
var utcdiff				  = 0;
var offset				  = 0;
var weekdayNameArray     = "";
var channelArray         = "";
var channelItemProtoType = '<li>\
			    				<a class="ui-btn">\
			  						<img class="channelIcon leftIcon" src="./img/a_m6.png"/>\
			  						<span class="channelName">6 6Msefsfsfsfsfsef6 6Msefsfsfsfsfsef6 6Msefsfsfsfsfsef6 6Msefsfsfsfsfsef</span>\
			  					</a>\
			  				</li>';
var epgItemProtoType = '<li data-icon="false">\
						<a href="#" style="padding:0;margin:0" class="EPGListDiv">\
							<div style="position:absolute;right:0;top:0;"><div class="icon ui-nodisc-icon ui-btn ui-btn-icon-notext ui-icon-carat-l" style="border:none;background-color:transparent;"></div></div>\
							<div style="margin:1em;font-weight:normal;text-shadow:none;">\
								<div class="EPGTime">01.27-02.06</div>\
								<div class="programName">program name</div>\
								<span class="programDsp"></span>\
							</div>\
						</a>\
					</li>'

/*=======================================Init function============================================*/
function init() {
	window.location = "native://EPGInit";
}

/*=======================================public slot============================================*/
function onDataWithJSON(data, key) {	
	var temp;
	if(browser.versions.android) {
 		temp = eval( "(" + data + ")" );
	} else {
		temp = data;
	}
	
	if(key == "EPGInit"){
		if(key == "EPGInit"){
			$.mobile.changePage("#EPGPage",  { transition: "none"});
		}
        
		channelArray     = temp.ChannelList;
        weekdayNameArray = temp.WeekdayNames;
        epgInfo          = temp.CurrentEPG;
        var channelIndex = temp.CurrentChannelIndex;
        var dayIndex     = temp.CurrentDayIndex;
        
        //calculateCurrentTime
		var	now 	  = new Date().getTime();
		var nowoffset = new Date().getTimezoneOffset();
		nowoffset 	  = nowoffset * 60 * 1000;
        
		if(typeof(temp.CurrentTime.UTCDiff) != "undefined" && typeof(temp.CurrentTime.Offset) != "undefined") {
            utcdiff	= parseInt(temp.CurrentTime.UTCDiff);
			offset  = parseInt(temp.CurrentTime.Offset);
            
			currentTime = new Date(now + nowoffset + utcdiff + offset);
		}

		initEPGInfo(epgInfo);
        initDateTabel(currentTime, dayIndex);
        initChannelList(channelArray);
	}
}

/*=======================================Init function============================================*/
function initChannelList(data) {
	var channelList = $("#channelList");
	channelList.children().remove();
	channelList.empty();

	$.each(data, function(index,  value) {
		var channelName	= value.ChannelName;
		var networkId   = value.NetworkId;
		var tsId 	    = value.TsId;
		var serviceId   = value.ServiceId;
		var iconKey     = getChannelIconKey(networkId, tsId, serviceId);
		var iconName    = getIconNameFromKey(iconKey);
		var channelItem = $(channelItemProtoType);
		
		channelItem.attr("data-filtertext", channelName);
        channelItem.attr("data-NetworkId", networkId);
        channelItem.attr("data-TsId", tsId);
        channelItem.attr("data-ServiceId", serviceId);
		channelItem.find(".channelName").html(channelName);
		channelItem.find(".channelIcon").attr("src", "./img/"+ iconName +".png");

		channelList.append(channelItem);
	});
    
    channelList.listview('refresh');
}

function initDateTabel(data, dayIndex) {
    $("#timeDiv").children("p").html(data.toLocaleDateString());
    
	var timeTable = $("#timeTable tr").find("td");
    
    $.each(timeTable, function(index, value) {
        var tempDate = new Date(data.getTime() + 1000 * 24 * 60 * 60 * index);
        var weekName = weekdayNameArray[tempDate.getDay()];
        var dayNum   = tempDate.getDate();
           
	 	$(value).find(".week").html(weekName);
        $(value).find(".date").html(dayNum);
    });
    
    $("#timeTable tr").find("td:eq(" + dayIndex + ")").addClass("current");
}

function initEPGInfo(data) {
	var epgInfoList = $("#EPGList");
	epgInfoList.children().remove();
	epgInfoList.empty();

	$.each(data, function(index,  value) {
		var startTime   = value.fStartDateTime;
		var duration    = value.fDuration;
		var programName	= value.fEventName;
		var description = value.fEventText;
		var epgInfoItem = $(epgItemProtoType);

		epgInfoItem.find(".programName").html(programName);
		epgInfoItem.find(".programDsp").html(description);

		epgInfoList.append(epgInfoItem);
	});
    
    epgInfoList.listview('refresh');
}

/*=======================================public signal============================================*/
function changeSVC(svcIndex) {
    window.location = "native://EPGChangeSVC?" + svcIndex;
}

function changeDay(dayIndex) {
    window.location = "native://EPGChangeDay?" + dayIndex;
}

/*=======================================private function============================================*/

/*=======================================JQuery Binding============================================*/
$(document).ready(function(){
	// change date
	$("body").on("click","#timeTable td",function() {
		$(this).addClass("current").siblings().removeClass("current");
        changeDay($(this).index());
	});

	$("#panelBtn").click(function() {
		$("div[data-role='page']").ontouchmove = function(e) {
			e.preventDefault();
		}
	});
                  
    $("body").on("click","#channelList li",function() {
        changeSVC($(this).index());
    });

	$("body").on("click", ".EPGListDiv", function() {
		if($(this).find(".programDsp").hasClass("unfold")) {
			$(this).find(".programDsp").removeClass("unfold");
			$(this).find(".icon").addClass("ui-icon-carat-l").removeClass("ui-icon-carat-d");
		} else {
			$(this).find(".programDsp").addClass("unfold");
			$(this).find(".icon").addClass("ui-icon-carat-d").removeClass("ui-icon-carat-l");
		}
	});
});