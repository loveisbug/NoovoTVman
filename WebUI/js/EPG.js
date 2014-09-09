var currentTime			  = 0;
var utcdiff				  = 0;
var offset				  = 0;
var weekdayNameArray     = "";
var channelArray         = "";
var channelItemProtoType = '<li data-icon="false" class="ui-nodisc-icon" data-filtertext="6 6M">\
				  		<a href="#" class="ui-btn" style="padding:0px;">\
				  			<img class="channelIcon ui-li-icon leftIcon" src="./img/a_m6.png" style="top:0px;left:0px;" />\
				  			<span class="channelName"></span>\
				  		</a>\
				    </li>';

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
        
        //calculateCurrentTime
		var	now 	  = new Date().getTime();
		var nowoffset = new Date().getTimezoneOffset();
		nowoffset 	  = nowoffset * 60 * 1000;
        
		if(typeof(temp.CurrentTime.UTCDiff) != "undefined" && typeof(temp.CurrentTime.Offset) != "undefined") {
            utcdiff	= parseInt(temp.CurrentTime.UTCDiff);
			offset  = parseInt(temp.CurrentTime.Offset);
            
			currentTime = new Date(now + nowoffset + utcdiff + offset);
		}
        
        initDateTabel(currentTime);
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
    
    channelList.listview('refresh')
}

function initDateTabel(data) {
    $("#timeDiv").children("p").html(data.toLocaleDateString());
    
	var timeTable = $("#timeTable tr").find("td");
    
    $.each(timeTable, function(index, value) {
        var tempDate = new Date(data.getTime() + 1000 * 24 * 60 * 60 * index);
        var weekName = weekdayNameArray[tempDate.getDay()];
        var dayNum   = tempDate.getDate();
           
	 	$(value).find(".week").html(weekName);
        $(value).find(".date").html(dayNum);
    });
}

/*=======================================public signal============================================*/


/*=======================================private function============================================*/

/*=======================================JQuery Binding============================================*/
$(document).ready(function(){
	// change date
	$("body").on("click","#timeTable td",function() {
		$(this).addClass("current").siblings().removeClass("current");
	});
	// $("body").on("toggle", ".EPGListDiv",function(){
	// 	$(this).find(".programDsp").addClass("unfold");
	// },function(){
	// 	$(this).find(".programDsp").removeClass("unfold");
	// });
	$(".EPGListDiv").toggle(
		function(){
			$(this).find(".programDsp").addClass("unfold");
			$(this).find(".EPGTime").addClass("ui-icon-carat-d").removeClass("ui-icon-carat-l");
		},function(){
			$(this).find(".programDsp").removeClass("unfold");
			$(this).find(".EPGTime").addClass("ui-icon-carat-l").removeClass("ui-icon-carat-d");
		}
	);
});