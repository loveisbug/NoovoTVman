//全局
var headerHeight          = 0;
var recordFileEditStatus  = false;
var pvrFileEditStatus     = false;
var pvrScheduleObj        = new Array();
var channelList           = 0;
var currentTime			  = 0;
var utcdiff				  = 0;
var offset				  = 0;
var confirmLabel		  = "";
var nowRecordId			  = -1;
var catchUpScheduleObj    = "";

var recordFileItem = '<li class="recFilesListli">\
                    <a href="#" class="recordFileItem" data-transition="slide" data-path="hellow.ts">\
                        <div class="ui-body ui-body-a ui-corner-all ui-shadow" style="padding:8px 8px;" >  \
                            <span style="font-size:17px;"><b id="channelName_recFile">CH: Fox News</b></span><br />     \
                            <div class="recFileItemInfoDiv"> \
                                <ul>\
                                    <li><span style="font-size:16px;" id="programme_recFile">England vs. France</span></li> \
                                    <li><span id="recTime_recFile">2014.7.5, 18:00 ~ 20:00</span></li>  \
                                    <li><span id="fileInfo_recFile">3rd Game of Group A</span></li> \
                                </ul>   \
                            </div> \
                        </div>  \
                    </a>\
                    <div class="pvrItemMaskDiv">\
                        <div class="pvrItemCheckBox ui-icon-custom-unselect" data-isCheck="false"></div>\
                    </div>\
                </li>'

var pvrScheduleItem ='<li class="pvrScheduleListli" style="height:8em;"> \
                    <a id="recordEditItemPage" class="pvrScheduleItem" href="#" data-transition="slide"> \
                        <div class="ui-body ui-body-a ui-corner-all ui-shadow" style="padding:8px 8px;height:6em;" data-role="button" >\
                            <div class="pvrItemRecDiv pvrItemRecNow"></div>\
                            <span style="font-size:17px;" id="channelName_pvrShedule" class="titleForAnimate"><b>CH: Fox News</b></span><br />\
                            <div class="pvrItemContent">\
                            	<div class="pvrItemImgDiv"><img src="./img/a_cherie25.png"/></div>\
                                <div class="pvrItemInfoDiv"> \
                                    <ul>\
                                        <li style="height:36px;"><span style="font-size:16px;line-height:18px;" id="programme_pvrShedule">England vs. England</span></li>\
                                        <li style="margin-top:0.5em;"><span id="startTime_pvrShedule" style="font-size:14px;line-height:16px;">2014.7.5, 18:00</span>~<span id="endTime_pvrShedule" style="font-size:14px;line-height:16px;">2014.7.5, 20:00</span></li>\
                                    </ul>\
                                </div>\
                            </div>\
                        </div>\
                    </a>\
                    <div class="pvrItemMaskDiv">\
                        <div class="pvrItemCheckBox ui-icon-custom-unselect" data-isCheck="false"></div>\
                    </div>\
                </li>'

var catchUpPVRScheduleItem = '<li class="catchUpPVRScheduleLi">\
                        <div class="catchUpPVRScheduleItem ui-body ui-body-a" data-index="0"  style="padding:8px 8px;height:6em;" data-role="button" >\
                            <p id="channelName">CH02:BBC Sports 1</p>\
                            <p><span id="displayName">England vs Japan </span><span id="timeLabel">2014/06/19 18:00-20:00</span></p>\
                            <div class="catchUpItemMaskDiv">\
                                <div class="catchUpItemCheckBox ui-icon-custom-unselect" data-isCheck="false"></div>\
                            </div>\
                        </div>\
                    </li>'

var pvrScheduleItemBtn = '<li class="pvrScheduleListli" style="height:8em;">\
                    <a href="#" data-transition="slide" class="pvrScheduleItem pvrScheduleAddItem">\
                        <div class="ui-body ui-body-a ui-shadow" style="padding:8px 8px;height:6em; border-color:#e4e7e8;background-color:#e4e7e8" >\
                            <div style="position:absolute;top: 50%; left: 50%; margin-top:0.5em; margin-left: -5em;font-size:12px;"><span style="color:#95a5a6;">New PVR Schedule</span></div>\
                            <div style="margin-top:-1em;width:28px; height:28px;position:absolute; top: 50%; left: 50%; margin-left: -1em; margin-top: -1.8em;text-align:center; border-radius:5px;"><span style="font-weight:bold;font-size:3em; line-height:0.7em; color:#95a5a6;">+</span></div>\
                        </div>\
                    </a>\
                </li>'         
                

/*=======================================Init function============================================*/ 
function init() {
    window.location = "native://PVRInit";
}


/*=======================================public slot============================================*/
function onDataWithJSON(data,key) { 
    var temp;
    if(browser.versions.android) {
        temp = eval( "(" + data + ")" );
    } else {
        temp = data;
    }

    if(key == "PVRInit" || key == "PVRInitWithoutTransition"){
		if(key == "PVRInit"){
			$.mobile.changePage("#pvrPage",  { transition: "none"});
		}
        var recordFilesArray = temp.PVR;
        var recordFilesLabel = temp.PVRLabel;
        var pvrScheduleArray = temp.PVRSchedule;
        var pvrScheduleLabel = temp.PVRScheduleLabel;
            channelList      = temp.ChannelList;
			confirmLabel	 = temp.ConfirmLabel;
		
        //calculateCurrentTime
		var	now = new Date().getTime();
		var nowoffset = new Date().getTimezoneOffset();
		nowoffset = nowoffset * 60 * 1000;

		if(typeof(temp.CurrentTime.UTCDiff) != "undefined" && typeof(temp.CurrentTime.Offset) != "undefined"){
			currentTime = new Date(parseInt(now)+parseInt(nowoffset)+parseInt(temp.CurrentTime.UTCDiff)+parseInt(temp.CurrentTime.Offset));
			utcdiff	= parseInt(temp.CurrentTime.UTCDiff);
			offset = parseInt(temp.CurrentTime.Offset);
		}
        $("#pvrScheduleLabel_PVR").text(pvrScheduleLabel);
        $("#recordFilesLabel_RecordFile").text(recordFilesLabel);
		
        initPVRShedule(pvrScheduleArray);
		nowRecordId = temp.RecordingItemId;
		findNowRecord(nowRecordId);
        initRecordFiles(recordFilesArray);
        initChannelList(channelList);
		
    } else if(key == "UpdateRemoteFileList") {
        var recordFilesArray = temp.PVR;
        initRecordFiles(recordFilesArray);

    } else if(key == "UpdateRecItemList"){
		$.mobile.changePage("#pvrPage",  { transition: "none"});
		var pvrScheduleArray = temp.PVRSchedule;
		initPVRShedule(pvrScheduleArray);
		findNowRecord(nowRecordId);

	} else if(key == "UpdateTime"){
		var	now = new Date().getTime();
		var nowoffset = new Date().getTimezoneOffset();
		nowoffset = nowoffset * 60 * 1000;

		if(typeof(temp.CurrentTime.UTCDiff) != "undefined" && typeof(temp.CurrentTime.Offset) != "undefined"){
			currentTime = new Date(parseInt(now)+parseInt(nowoffset)+parseInt(temp.CurrentTime.UTCDiff)+parseInt(temp.CurrentTime.Offset));
			utcdiff	= parseInt(temp.CurrentTime.UTCDiff);
			offset = parseInt(temp.CurrentTime.Offset);
		}

	} else if(key == "RecordStartNotification"){
		nowRecordId=temp;
		findNowRecord(nowRecordId);

	} else if(key == "RecordFinishNotification"){
		nowRecordId = -1;
		var pvrScheduleArray = temp.PVRSchedule;
		initPVRShedule(pvrScheduleArray);
	
	} else if(key == "PVRFromS3") {
		initPVRFromS3(temp);
		$.mobile.changePage("#catchUpPVRSchedualPage", { transition: "slide", reverse:true});
	}

	resizepvrScheduleList();
	resizeRecordFileList();
	resizecatchUpTopicList();
}


/*=======================================public signal============================================*/
function playFile(filePath) {
    window.location = "native://PlayFile?" + filePath;
}

function deleteFile(filesArray) {
    window.location = "native://DeleteFile?" + filesArray;
}

function modifyRecItem(jsonstr) {
    window.location = "native://ModifyRecItem?" + jsonstr;
}

function addRecItem(jsonarraystr) {
    window.location = "native://AddRecItem?" + jsonarraystr + "&" + 0;
}

function syncPVRSchedule(jsonarraystr) {
	window.location = "native://AddRecItem?" + jsonarraystr + "&" + 1;
}

function deletePvr(recordIdArray){
	window.location = "native://DeleteRecItem?" + recordIdArray;	
}

function getPVRFromS3(url) {
    window.location = "native://GetPVRFromS3?" + url;
}

/*=======================================Init function============================================*/
//yang begin
function initPVRFromS3(data){

	 var catchUpPVRScheduleList = $("#catchUpPVRScheduleList");
	 catchUpPVRScheduleList.children().remove();
	 catchUpPVRScheduleList.empty();

	  var topic                = data.Topic;
	  var description          = data.Description;
	  var countryCode          = data.CountryCode; 
	  var catchUpPVRSchedule   = data.PVRSchedule;

	 $("#topic_catchUpPVRSchedualPage").html(topic);
	 $("#description_catchUpPVRSchedualPage").html(description);

	 catchUpScheduleObj    = new Array();
	 $.each(catchUpPVRSchedule, function(index, value) {
	 	var channelName = value.ChannelName;
		var displayName = value.DisplayName;
		var startYear   = value.StartYear;
		var startMonth	= value.StartMonth;
		var startDay 	= value.StartDay;
		var startHour   = value.StartHour
		var startMinute	= value.StartMinute;
		var endYear   	= value.EndYear;
		var endMonth	= value.EndMonth;
		var endDay 		= value.EndDay;
		var endHour 	= value.EndHour;
		var endMinute	= value.EndMinute;
		var endSecond	= value.EndSecond;

	 	var catchUpItem = $(catchUpPVRScheduleItem);
	
		catchUpItem.find(".catchUpPVRScheduleItem").attr("data-index", index);
		catchUpItem.find("#channelName").html(channelName).removeAttr("id");
		catchUpItem.find("#displayName").html(displayName).removeAttr("id");
		
        var startTime = new Date(startYear + "/" + startMonth + "/" + startDay + " " + startHour + ":" + startMinute + ":0");
        	startTime = new Date(startTime.getTime() + offset);
        var endTime   = new Date(endYear + "/" + endMonth + "/" + endDay + " " + endHour + ":" + endMinute + ":0");
            endTime   = new Date(endTime.getTime() + offset);
        var timeLabel = startTime.format("yyyy-MM-dd hh:mm") + " - " + endTime.format("hh:mm");

		catchUpItem.find("#timeLabel").html(timeLabel).removeAttr("id");
		
	  	catchUpScheduleObj[index] = value;
	  	catchUpScheduleObj[index].startTime = startTime;
	  	catchUpScheduleObj[index].endTime = endTime;
		
	 	catchUpPVRScheduleList.append(catchUpItem);
	 });		
}

//yang end

function initRecordFiles(data) {
	
    var recFilesList = $("#recFilesList");
    recFilesList.children().remove();
    recFilesList.empty();

    $.each(data, function(index,value) {
        var filePath    = value.FilePath;
        var channelName = value.ChannelName;
        var displayName = value.DisplayName;
        var fileInfo    = value.FileInfo;
        var recordDate  = value.RecordDate;
        var recItem     = $(recordFileItem);
        recItem.children("a").attr("data-path", filePath);
        recItem.find("#channelName_recFile").text(channelName).attr("id", "channelName" + index + "_recFile");
        recItem.find("#programme_recFile").html(displayName == "" ? "&nbsp" : displayName).attr("id", "programme" + index + "_recFile");
        recItem.find("#recTime_recFile").text(recordDate).attr("id", "recTime" + index + "_recFile");
        recItem.find("#fileInfo_recFile").text(fileInfo).attr("id", "fileInfo" + index + "_recFile");

        recFilesList.append(recItem);
    });

	resizepvrScheduleList();
	resizeRecordFileList();
}

function initPVRShedule(data) {
    var pvrScheduleList = $("#pvrScheduleList");
    pvrScheduleList.children().remove();
    pvrScheduleList.empty();
	pvrScheduleObj = new Array();

    $.each(data, function(index,value) {
        var channelName    = value.ChannelName;
        var displayName    = value.DisplayName;
        var startTime      = new Date(value.StartYear + "/" + value.StartMonth + "/" + value.StartDay + " " + value.StartHour + ":" + value.StartMinute + ":0").format("yyyy-MM-dd hh:mm");
        var endTime        = new Date(value.EndYear + "/" + value.EndMonth + "/" + value.EndDay + " " + value.EndHour + ":" + value.EndMinute + ":0").format("hh:mm");
		var endTimeFull    = new Date(value.EndYear + "/" + value.EndMonth + "/" + value.EndDay + " " + value.EndHour + ":" + value.EndMinute + ":0").format("yyyy-MM-dd hh:mm");
        var sheduleItem    = $(pvrScheduleItem);
		var recordItemId   = value.RecordItemId;
		
        sheduleItem.children("a").attr("data-PVRIndex", index);
		sheduleItem.children("a").attr("data-recordId", recordItemId);
		sheduleItem.find(".pvrItemRecDiv").attr("data-recordId",recordItemId);
        sheduleItem.find("#channelName_pvrShedule").text("CH:"+channelName).attr("id", "channelName" + index + "_pvrShedule");
        sheduleItem.find("#programme_pvrShedule").html(displayName == "" ? "&nbsp" : displayName).attr("id", "programme" + index + "_pvrShedule");
        sheduleItem.find("#startTime_pvrShedule").text(startTime).attr("id", "startTime" + index + "_pvrShedule");
        sheduleItem.find("#endTime_pvrShedule").text(endTime).attr("id", "endTime" + index + "_pvrShedule");

        pvrScheduleObj[index] = value;
        pvrScheduleObj[index].startTime = startTime;
        pvrScheduleObj[index].endTime   = endTimeFull;

        pvrScheduleList.append(sheduleItem);
    });

	pvrScheduleList.append(pvrScheduleItemBtn);
	resizepvrScheduleList();
	resizeRecordFileList();
}

function initChannelList(data) {
    var channelList = $("#channelList");
    channelList.children().remove();
    channelList.empty();
    
    $("#applyButton").text(confirmLabel);
    $.each(data, function(index, value){
        channelList.append('<li data-icon="false" class="channelItem" data-index="'+index+'" value="' + value.ChannelName + '">' + value.ChannelName + '</li>');
    });

    channelList.listview('refresh');
}

/*=======================================private function============================================*/
function findNowRecord(nowRecordId){
	if(nowRecordId != -1){
		var pvrItemRecDivs = $(".pvrItemRecDiv");
		$.each(pvrItemRecDivs, function(index,element) {
			pvrItemRecDiv = $(element);
			if(pvrItemRecDiv.attr("data-recordId") == nowRecordId){
				pvrItemRecDiv.addClass('pvrItemRecNow');
				pvrItemRecDiv.parent().find(".titleForAnimate").animate({marginLeft:'1.3em'});
				pvrItemRecDiv.animate({opacity:'1.0'});
			}
		});
	}
}
/*=======================================twitter============================================*/
function twitter(d,s,id) {
	var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';
	if(!d.getElementById(id)){ 
		js=d.createElement(s);
		js.id=id;
		js.src=p+"://platform.twitter.com/widgets.js";
		fjs.parentNode.insertBefore(js,fjs);
	}
}
function loadTwitter () {
	timerId = setTimeout("checkIframe()", 500);
	twitter(document,"script","twitter-wjs");
}
function checkIframe() {
	var iframe = $("iframe");

	if(iframe.length <= 0) {
		setTimeout("checkIframe()", 500);
		return;
	}

	if(iframe.width() <= "1") {
		setTimeout("checkIframe()", 500);
		return;
	}

	iframe.contents().find("body").css("margin", "0px 0px");
	iframe.contents().find("body").css("padding", "0px 0px");
	iframe.contents().find("#twitter-widget-0").css("marginBottom", "0px");
	var tempHeight = $(window).height() - headerHeight - 10;
	iframe.height(tempHeight);

	iframe.contents().find("a:not(.e-entry-content)").click(function() {
		return false;
	});

	iframe.contents().find(".e-entry-content a").click(function() {
		getPVRFromS3($(this).attr("href"));
		return false;
	});
}
/*=======================================JQuery Binding============================================*/
/*===================================delect record and documents===================================*/
 $(document).ready(function () {

    $("#delButton_PVR").click(function() {

		if($('.pvrScheduleListli').length > 0){
			var pvrScheduleListdiv = $("#pvrScheduleList li>div")
			if(pvrScheduleListdiv.length > 0) {
				if (pvrFileEditStatus == false) {
					pvrFileEditStatus = true;
					
					$("#delButton_PVR").removeClass("ui-icon-custom-edit");
					$("#delButton_PVR").addClass("ui-icon-custom-delete");

					pvrScheduleListdiv.fadeIn(200);
					$("#cancelpvrselect").fadeIn(200);
					$(".pvrScheduleAddItem").fadeOut(200);
					$("#pvrPage").unbind();

				} else {
					pvrFileEditStatus = false;

					$("#delButton_PVR").removeClass("ui-icon-custom-delete");
					$("#delButton_PVR").addClass("ui-icon-custom-edit");
					
					pvrScheduleListdiv.fadeOut(200);
					$("#cancelpvrselect").fadeOut(200);

					pvrScheduleListdiv = pvrScheduleListdiv.find(".pvrItemCheckBox[data-isCheck=true]");
					var tempArray = new Array();
					$.each(pvrScheduleListdiv,function(index,temp){
						tempArray.push($(temp).parents("li").children("a").attr("data-recordId"));
					});

					deletePvr(tempArray);

					var checkBox = $(".pvrItemCheckBox");
					checkBox.removeClass("ui-icon-custom-selected");
					checkBox.addClass("ui-icon-custom-unselect");
					checkBox.attr("data-isCheck", "false");
					$(".pvrScheduleItem>div").removeClass("check");

					$("#pvrPage").on("swiperight",function(){
						$.mobile.changePage("#catchUpTopicPage",  { transition: "slide", reverse:true});
					});

					$("#pvrPage").on("swipeleft",function(){
						$.mobile.changePage("#recFilesPage",  { transition: "slide" });
						resizepvrScheduleList();
						resizeRecordFileList();
					});
				}
			}
		}
    });

	$("#cancelpvrselect").click(function() {
		pvrFileEditStatus = false;

		$("#delButton_PVR").removeClass("ui-icon-custom-delete");
		$("#delButton_PVR").addClass("ui-icon-custom-edit");

        var checkBox = $(".pvrItemCheckBox");
		checkBox.removeClass("ui-icon-custom-selected");
		checkBox.addClass("ui-icon-custom-unselect");
		checkBox.attr("data-isCheck", "false");
		$("#pvrScheduleList li>a>div").removeClass("check");

		var pvrScheduleListdiv = $("#pvrScheduleList li>div");
		pvrScheduleListdiv.fadeOut(200);
		$("#cancelpvrselect").fadeOut(200);
		$(".pvrScheduleAddItem").fadeIn(200);

		$("#pvrPage").on("swiperight",function(){
			$.mobile.changePage("#catchUpTopicPage",  { transition: "slide", reverse:true});
		});
		$("#pvrPage").on("swipeleft",function(){
			$.mobile.changePage("#recFilesPage",  { transition: "slide" });
			resizepvrScheduleList();
			resizeRecordFileList();
		});
	});

    $("#delButton_Record").click(function() {
		if($(".recFilesListli").length > 0){
			var recordFileItemList = $("#recFilesList li>div");
			if (recordFileEditStatus == false) {
				recordFileEditStatus = true;

				$("#delButton_Record").removeClass("ui-icon-custom-edit");
				$("#delButton_Record").addClass("ui-icon-custom-delete");

				recordFileItemList.fadeIn(200);
				$("#cancelrecselect").fadeIn(200);
				$("#recFilesPage").unbind();

			} else {
				recordFileEditStatus = false;
			
				$("#delButton_Record").removeClass("ui-icon-custom-delete");
				$("#delButton_Record").addClass("ui-icon-custom-edit");

				recordFileItemList.fadeOut(200);
				$("#cancelrecselect").fadeOut(200);

				recordFileItemList = recordFileItemList.find(".pvrItemCheckBox[data-isCheck=true]");
				var tempArray = new Array();
				$.each(recordFileItemList,function(index,temp){
					tempArray.push($(temp).parents("li").children("a").attr("data-path"));
				});
				deleteFile(tempArray);

				var checkBox = $(".pvrItemCheckBox");
				checkBox.removeClass("ui-icon-custom-selected");
				checkBox.addClass("ui-icon-custom-unselect");
				checkBox.attr("data-isCheck", "false");
				$(".pvrScheduleItem>div").removeClass("check");

				$("#recFilesPage").on("swiperight",function(){
					$.mobile.changePage("#pvrPage",  { transition: "slide", reverse:true});
					resizepvrScheduleList();
					resizeRecordFileList();
				});
			}
		}
    }); 

	$("#cancelrecselect").click(function() {
		recordFileEditStatus = false;
		
		$("#delButton_Record").removeClass("ui-icon-custom-delete");
		$("#delButton_Record").addClass("ui-icon-custom-edit");

        var checkBox = $(".pvrItemCheckBox");
		checkBox.removeClass("ui-icon-custom-selected");
		checkBox.addClass("ui-icon-custom-unselect");
		checkBox.attr("data-isCheck", "false");
        $("#recFilesList li>a>div").removeClass("check");

		var recordFileItemList = $("#recFilesList li>div");
		recordFileItemList.fadeOut(200);
		$("#cancelrecselect").fadeOut(200);
		$("#recFilesPage").on("swiperight",function(){
			$.mobile.changePage("#pvrPage",  { transition: "slide", reverse:true});
			resizepvrScheduleList();
			resizeRecordFileList();
		});
	});

/*=======================================Sliding============================================*/
    $("#pvrPage").on("swiperight",function(){
        $.mobile.changePage("#catchUpTopicPage",  { transition: "slide", reverse:true});
    });
    $("#pvrPage").on("swipeleft",function(){
        $.mobile.changePage("#recFilesPage",  { transition: "slide" });
		resizepvrScheduleList();
		resizeRecordFileList();
    });
    $("#catchUpTopicPage").on("swipeleft",function(){
        $.mobile.changePage("#pvrPage",  { transition: "slide"});
		resizepvrScheduleList();
		resizeRecordFileList();
    });
    $("#recFilesPage").on("swiperight",function(){
        $.mobile.changePage("#pvrPage",  { transition: "slide", reverse:true});
		resizepvrScheduleList();
		resizeRecordFileList();
    });


    //初始化日期控件
    var formTime = {
        preset: 'datetime', //日期
        theme: 'android-ics', //皮肤样式
        display: 'modal', //显示方式 
        mode: 'Scroller', //日期选择模式
        dateFormat: 'yy-mm-dd', // 日期格式
        dateOrder: 'yymmdd', //面板中日期排列格式
        startYear:2010,
        endYear:2050,
        animate:"slideup",
		timeFormat: 'HH:ii',//获得的时间为24小时制
		height:30,//调整行高度不让整个控件超出屏幕
		showOnFocus: false//解决页面切换回来后会弹出时间选择
    };

    var toTime = {
        preset: 'datetime', //日期
        theme: 'android-ics', //皮肤样式
        display: 'modal', //显示方式 
        mode: 'Scroller', //日期选择模式
        dateFormat: 'yy-mm-dd', // 日期格式
        dateOrder: 'yymmdd', //面板中日期排列格式
        startYear:2010,
        endYear:2050,
        animate:"slideup",
		timeFormat: 'HH:ii',//获得的时间为24小时制
		height:30,//调整行高度不让整个控件超出屏幕
		showOnFocus: false//解决页面切换回来后会弹出时间选择
    };
    $("#formTimeSelect").textinput();
	$("#toTimeSelect").textinput();
    $("#formTimeSelect").mobiscroll(formTime);
    $("#toTimeSelect").mobiscroll(toTime);
});

$(function() {
    headerHeight = $("#pvrHeader").height();

    $("body").on("click", ".channelItem", function() {
        var channelName = $(this).text();

        var preCheck = $("#channelList").find("[data-icon=check]");
        preCheck.attr("data-icon", "false");
        preCheck.removeClass("ui-btn-icon-right ui-icon-check");

        $(this).attr("data-icon", "check");
        $(this).addClass("ui-btn-icon-right ui-icon-check");
		$("#channelName_recItemEdit").attr("data-index",$(this).attr("data-index"));
        $("#channelName_recItemEdit").text(channelName);
    });

    $("body").on("click", ".recordFileItem", function() {
        playFile($(this).attr("data-path"));
    });

    $("body").on("click", "#recordEditItemPage", function() {
		if(currentTime==0){
			return;
		}

		$("#formTimeSelect").css({"background-color":"transparent","color":"#333"});
		$("#toTimeSelect").css({"background-color":"transparent","color":"#333"});
        var pvrScheduleItemObj = pvrScheduleObj[$(this).attr("data-PVRIndex")];
		 $("#recItemIndex").val($(this).attr("data-PVRIndex"));
		 $("#channelName_recItemEdit").attr("data-index","-1");
		 $("#channelName_recItemEdit").text(pvrScheduleItemObj.ChannelName);
		 $("#channelName_recItemEdit").attr("href","#");
         $("#displayName_recItemEdit").val(pvrScheduleItemObj.DisplayName);
         $("#formTimeSelect").val(pvrScheduleItemObj.startTime);
         $("#toTimeSelect").val(pvrScheduleItemObj.endTime);
		 var pvrItemRecDiv=$(this).find(".pvrItemRecDiv");
		if(pvrItemRecDiv.attr("data-recordId")==nowRecordId){
			$("#formTimeSelect").textinput("disable");
		}else{
			$("#formTimeSelect").textinput("enable");
		}
		$.mobile.changePage("#recordItemPage",  { transition: "slide" });
    });
	
	$("body").on("click", ".pvrScheduleAddItem", function() {
		if(currentTime==0){
			return;
		}

		$("#formTimeSelect").css({"background-color":"transparent","color":"#333"});
		$("#toTimeSelect").css({"background-color":"transparent","color":"#333"});
		$("#recItemIndex").val('-1');
		$("#channelName_recItemEdit").attr("data-index","0");
		$("#channelName_recItemEdit").text(channelList[0].ChannelName);
		$("#channelName_recItemEdit").attr("href","#channelListPage");
	    $("#displayName_recItemEdit").val("");
		 
		var starttime = new Date().getTime();
		var nowoffset = new Date().getTimezoneOffset();
		    nowoffset = nowoffset * 60 * 1000;
		    starttime = starttime + nowoffset + utcdiff + offset;
		var endtime   = starttime + 3600000;
		    starttime = new Date(starttime).format("yyyy-MM-dd hh:mm");
		    endtime   = new Date(endtime).format("yyyy-MM-dd hh:mm");
	    
	    $("#formTimeSelect").val(starttime);
	    $("#toTimeSelect").val(endtime);
		$("#formTimeSelect").textinput("enable");
		$.mobile.changePage("#recordItemPage",  { transition: "slide" });
    });
	
    $("body").on("click", ".pvrItemMaskDiv", function() {
        var checkBox = $(this).find(".pvrItemCheckBox");
        if(checkBox.attr("data-isCheck") == "false") {
			$(this).parents("li").find("a>div").addClass("check");
			checkBox.removeClass("ui-icon-custom-unselect");
			checkBox.addClass("ui-icon-custom-selected");
            checkBox.attr("data-isCheck", "true");
        } else {
			$(this).parents("li").find("a>div").removeClass("check");
			checkBox.removeClass("ui-icon-custom-selected");
			checkBox.addClass("ui-icon-custom-unselect");
            checkBox.attr("data-isCheck", "false");
        }
    });

    // Yang begin
    $("body").on("click", ".twitterTopicListLi", function() {
		var twitterAccount = $(this).children("div").attr("data-account");
		var twitterId = $(this).children("div").attr("data-id");
		$("#twitterContent").empty();
		$("#twitter-wjs").remove();
		$("iframe").empty();
		
        $.mobile.changePage("#twitterPage", {transition: "slide", reverse: true});
		$("#twitterContent").append('<a class="twitter-timeline" data-dnt="true" href="https://twitter.com/' + twitterAccount+'" data-widget-id="'+twitterId + '">loading Twitter...</a>');
		loadTwitter();
    });

	$("body").on("click",".catchUpTopicCheckBox",function(){
		if($(this).attr("data-isCheck") == "false"){
			$(this).removeClass("ui-icon-custom-unselect").addClass("ui-icon-custom-selected");
			$(this).attr("data-isCheck","true");
		}else{
			$(this).removeClass("ui-icon-custom-selected").addClass("ui-icon-custom-unselect");
			$(this).attr("data-isCheck","false");
		}
		return false;
	});
	
	
	$("body").on("click", ".catchUpItemMaskDiv", function() {

        var checkBox = $(this).find(".catchUpItemCheckBox");
	    var index = parseInt($(this).parent().attr("data-index"));

		//ScheduleTime
		var endTime 	= catchUpScheduleObj[index].endTime;
		
		//cuurentTime
		var	nowTime   = new Date().getTime();
		var nowOffset = new Date().getTimezoneOffset();
		    nowOffset = nowOffset * 60 * 1000;
		    currentTime = new Date(parseInt(nowTime) + parseInt(nowOffset) + utcdiff + offset);

		if(currentTime < endTime){
			if(checkBox.attr("data-isCheck") == "false") {
				checkBox.removeClass("ui-icon-custom-unselect");
				checkBox.addClass("ui-icon-custom-selected");
				checkBox.attr("data-isCheck", "true");
				
        	}else{
				checkBox.removeClass("ui-icon-custom-selected");
				checkBox.addClass("ui-icon-custom-unselect");
				checkBox.attr("data-isCheck", "false");
        	}	
		}
    });
	
	$("body").on("click", ".syncBtn", function() {
		var jsonStrArray = [];
		var checkBox = $(".catchUpItemCheckBox[data-isCheck=true]");
		var recordItemId = new Date().getTime();

		$.each(checkBox, function(catchUpScheduleIndex, item) {
			var catchUpScheduleItemIndex = parseInt($(item).parents(".catchUpPVRScheduleItem").attr("data-index"));
			var catchUpScheduleItem      = catchUpScheduleObj[catchUpScheduleItemIndex];
			
			var startTime = catchUpScheduleItem.startTime;
			var endTime   = catchUpScheduleItem.endTime;
			var	pidArray  = 0;
			var	bandwidth = 0;
			var	frequency = 0;

			//get the Channel Info
			$.each(channelList, function(channelIndex, channel) {
				if(catchUpScheduleItem.ProgId == channel.ServiceId &&
					catchUpScheduleItem.NetworkId == channel.NetworkId &&
					catchUpScheduleItem.TsId == channel.TsId ) {
					
					pidArray  = channel.PidArray;
					bandwidth = channel.Bandwidth;
					frequency = channel.Frequency;
				}
			});

			var jsonstr = {
					StartYear:startTime.getFullYear(),
					StartMonth:startTime.getMonth() + 1,
					StartDay:startTime.getDate(),
					StartHour:startTime.getHours(),
					StartMinute:startTime.getMinutes(),
					StartSecond:startTime.getSeconds(),
					EndYear:endTime.getFullYear(),
					EndMonth:endTime.getMonth() + 1,
					EndDay:endTime.getDate(),
					EndHour:endTime.getHours(),
					EndMinute:endTime.getMinutes(),
					EndSecond:endTime.getSeconds(),
					ProgId:catchUpScheduleItem.ProgId,
					NetworkId:catchUpScheduleItem.NetworkId,
					TsId:catchUpScheduleItem.TsId,
					Version:catchUpScheduleItem.Version,
					ChannelName:catchUpScheduleItem.ChannelName,
					DisplayName:catchUpScheduleItem.DisplayName,
					EventId:0,
					RecordItemId:parseInt(recordItemId / 1000) + catchUpScheduleIndex,
					PidArray:pidArray,
					Bandwidth:bandwidth,
					Frequency:frequency
				};

				jsonStrArray.push(jsonstr);
		});
		
		syncPVRSchedule(JSON.stringify(jsonStrArray));
	});
	// Yang end
});

/*魏雯涛增加部分*/
$(function(){
	
	$("#formTimeSelect").click(function(){
		$("#formTimeSelect").css({"background-color":"transparent","color":"#333"});
		$("#toTimeSelect").css({"background-color":"transparent","color":"#333"});
	});

	$("#toTimeSelect").click(function(){
		$("#formTimeSelect").css({"background-color":"transparent","color":"#333"});
		$("#toTimeSelect").css({"background-color":"transparent","color":"#333"});
	});
	
    $("#toTimeSelect").change(function(){
		if($("#toTimeSelect").val()!=""&&$("#formTimeSelect").val()!=""){
			var starttime=new Date($("#formTimeSelect").val().replace(/-/g, '/'));
			var endtime=new Date($("#toTimeSelect").val().replace(/-/g, '/'));
			if(endtime<=currentTime){
				$("#formTimeSelect").css({"background-color":"#ff6464","color":"#fff"});
				$("#toTimeSelect").css({"background-color":"#ff6464","color":"#fff"});
				return;
			}
			if(starttime>=endtime){
				$("#formTimeSelect").css({"background-color":"#ff6464","color":"#fff"});
				$("#toTimeSelect").css({"background-color":"#ff6464","color":"#fff"});
				return;
			}
			if(iftimeconflict(starttime,endtime,$("#recItemIndex").val())){
				$("#formTimeSelect").css({"background-color":"#ff6464","color":"#fff"});
				$("#toTimeSelect").css({"background-color":"#ff6464","color":"#fff"});
				return;
			}
			$("#formTimeSelect").css({"background-color":"transparent","color":"#333"});
			$("#toTimeSelect").css({"background-color":"transparent","color":"#333"});
		}
	});

	$("#formTimeSelect").change(function(){
		if($("#toTimeSelect").val()!=""&&$("#formTimeSelect").val()!=""){
			var starttime=new Date($("#formTimeSelect").val().replace(/-/g, '/'));
			var endtime=new Date($("#toTimeSelect").val().replace(/-/g, '/'));
			if(endtime<=currentTime){
				$("#formTimeSelect").css({"background-color":"#ff6464","color":"#fff"});
				$("#toTimeSelect").css({"background-color":"#ff6464","color":"#fff"});
				return;
			}
			if(starttime>=endtime){
				$("#formTimeSelect").css({"background-color":"#ff6464","color":"#fff"});
				$("#toTimeSelect").css({"background-color":"#ff6464","color":"#fff"});
				return;
			}
			if(iftimeconflict(starttime,endtime,$("#recItemIndex").val())){
				$("#formTimeSelect").css({"background-color":"#ff6464","color":"#fff"});
				$("#toTimeSelect").css({"background-color":"#ff6464","color":"#fff"});
				return;
			}
			$("#formTimeSelect").css({"background-color":"transparent","color":"#333"});
			$("#toTimeSelect").css({"background-color":"transparent","color":"#333"});
		}
	});

	$("#applyButton").click(function(){
		
		if(currentTime==0){
			return;
		}

		if($("#channelName_recItemEdit").text()==""||$("#channelName_recItemEdit").text()=="　"){
			return;
		}
		/*if($("#displayName_recItemEdit").val()==""){
			$("#displayName_recItemEdit").css({"background-color":"#ff6464","color":"#fff"});
			return;
		}*/
		if($("#formTimeSelect").val()==""){
			$("#formTimeSelect").css({"background-color":"#ff6464","color":"#fff"});
			return;
		}

		if($("#toTimeSelect").val()==""){
			$("#toTimeSelect").css({"background-color":"#ff6464","color":"#fff"});
			return;
		}

		var starttime=new Date($("#formTimeSelect").val().replace(/-/g, '/'));
		var endtime=new Date($("#toTimeSelect").val().replace(/-/g, '/'));
		if(endtime<=currentTime){
			$("#formTimeSelect").css({"background-color":"#ff6464","color":"#fff"});
			$("#toTimeSelect").css({"background-color":"#ff6464","color":"#fff"});
			return;
		}
		if(starttime>=endtime){
			$("#formTimeSelect").css({"background-color":"#ff6464","color":"#fff"});
			$("#toTimeSelect").css({"background-color":"#ff6464","color":"#fff"});
			return;
		}
		if(iftimeconflict(starttime,endtime,$("#recItemIndex").val())){
			$("#formTimeSelect").css({"background-color":"#ff6464","color":"#fff"});
			$("#toTimeSelect").css({"background-color":"#ff6464","color":"#fff"});
			return;
		}
		var json = [];		
		json.StartYear=starttime.getFullYear();
		json.StartMonth=starttime.getMonth()+1;
		json.StartDay=starttime.getDate();
		json.StartHour=starttime.getHours();
		json.StartMinute=starttime.getMinutes();
		json.StartSecond=starttime.getSeconds();
		json.EndYear=endtime.getFullYear();
		json.EndMonth=endtime.getMonth()+1;
		json.EndDay=endtime.getDate();
		json.EndHour=endtime.getHours();
		json.EndMinute=endtime.getMinutes();
		json.EndSecond=endtime.getSeconds();
		
		json.EventId=0;
		var now=new Date().getTime();
		json.RecordItemId=parseInt((parseInt(now)+parseInt(utcdiff))/1000);
		
		if($("#channelName_recItemEdit").attr("data-index")!="-1"){
			var channel=channelList[parseInt($("#channelName_recItemEdit").attr("data-index"))];
			json.ChannelName=channel.ChannelName;
			json.ProgId=channel.ServiceId;
			json.Bandwidth=channel.Bandwidth;
			json.NetworkId=channel.NetworkId;
			json.TsId=channel.TsId;
			json.PidArray=channel.PidArray;
			json.Frequency=channel.Frequency;
			json.Version=4;
		}

		if($("#recItemIndex").val()!="-1"){
			var pvrScheduleItemObj = pvrScheduleObj[$("#recItemIndex").val()];
			json.RecordItemId=pvrScheduleItemObj.RecordItemId;
			json.ChannelName=pvrScheduleItemObj.ChannelName;
			json.EventId=pvrScheduleItemObj.EventId;
			json.ProgId=pvrScheduleItemObj.ProgId;
			json.Bandwidth=pvrScheduleItemObj.Bandwidth;
			json.NetworkId=pvrScheduleItemObj.NetworkId;
			json.TsId=pvrScheduleItemObj.TsId;
			json.PidArray=pvrScheduleItemObj.PidArray;
			json.Frequency=pvrScheduleItemObj.Frequency;
			json.Version=pvrScheduleItemObj.Version;
		}

		var jsonstr = {StartDay:json.StartDay,
					EndMonth:json.EndMonth,
					StartMonth:json.StartMonth,
					EventId:json.EventId,
					ChannelName:json.ChannelName,
					DisplayName:$("#displayName_recItemEdit").val(),
					RecordItemId:json.RecordItemId,
					EndMinute:json.EndMinute,
					StartHour:json.StartHour,
					ProgId:json.ProgId,
					Bandwidth:json.Bandwidth,
					EndSecond:json.EndSecond,
					EndHour:json.EndHour,
					StartYear:json.StartYear,
					NetworkId:json.NetworkId,
					TsId:json.TsId,
					StartMinute:json.StartMinute,
					EndDay:json.EndDay,
					StartSecond:json.StartSecond,
					PidArray:json.PidArray,
					EndYear:json.EndYear,
					Frequency:json.Frequency,
					Version:json.Version};

		if($("#recItemIndex").val()!="-1") {
			modifyRecItem(JSON.stringify(jsonstr));

		} else {
			var jsonstrarray=[];
			jsonstrarray.push(jsonstr);
			addRecItem(JSON.stringify(jsonstrarray));
		}
	});

	//判断与其他节目的时间冲突
	var iftimeconflict=function(starttime,endtime,recItemIndex){
		data=pvrScheduleObj
		flag=0;
		$.each(data, function(index,value) {
			if(index!=recItemIndex){
				localstarttime=new Date(value.startTime.replace(/-/g, '/'));
				localendtime=new Date(value.endTime.replace(/-/g, '/'));
				if(starttime>=localstarttime&&starttime<=localendtime){
					flag=1;
					return;
				}
				if(endtime>=localstarttime&&endtime<=localendtime){
					flag=1;
					return;
				}
				if(localstarttime>=starttime&&localstarttime<=endtime){
					flag=1;
					return;
				}
				if(localendtime>=starttime&&localendtime<=endtime){
					flag=1;
					return;
				}
			}
		});
		if(flag==1){
			return true;
		}
		return false;
	}
});

/*列表自适应*/
var divwidth=272;

var resizeRecordFileList = function(){
	if($('.recFilesListli').length > 0){
		var windowwidth=$("#recFilesList").width();
		//var marginleft=$('.recFilesListli').css("margin-left").substring(0,$('.recFilesListli').css("margin-left").indexOf('px'));
		var marginleft=0;
		//var marginright=$('.recFilesListli').css("margin-right").substring(0,$('.recFilesListli').css("margin-right").indexOf('px'));
		var marginright=0;
		var divallwidth=parseInt(divwidth)+parseInt(marginleft)+parseInt(marginright);
		var multiple=parseInt(windowwidth/divallwidth);
		var needwidth=parseInt(windowwidth/multiple)-parseInt(marginleft)-parseInt(marginright);
		$('.recFilesListli').width(needwidth);
	}
}
var resizepvrScheduleList = function(){
	if($('.pvrScheduleListli').length > 0){	
		var windowwidth=$('#pvrScheduleList').width();
		//var marginleft=$('.pvrScheduleListli').css("margin-left").substring(0,$('.recFilesListli').css("margin-left").indexOf('px'));
		var marginleft=0;
		//var marginright=$('.pvrScheduleListli').css("margin-right").substring(0,$('.recFilesListli').css("margin-right").indexOf('px'));
		var marginright=0;
		var divallwidth=parseInt(divwidth)+parseInt(marginleft)+parseInt(marginright);
		var multiple=parseInt(windowwidth/divallwidth);
		var needwidth=parseInt(windowwidth/multiple)-parseInt(marginleft)-parseInt(marginright);
		$('.pvrScheduleListli').width(needwidth);
	}
}

var resizecatchUpTopicList = function(){
	if($('.twitterTopicListLi').length > 0){	
		var windowwidth=$('#twitterTopicList').width();
		//var marginleft=$('.pvrScheduleListli').css("margin-left").substring(0,$('.recFilesListli').css("margin-left").indexOf('px'));
		var marginleft=0;
		//var marginright=$('.pvrScheduleListli').css("margin-right").substring(0,$('.recFilesListli').css("margin-right").indexOf('px'));
		var marginright=0;
		var divallwidth=parseInt(divwidth)+parseInt(marginleft)+parseInt(marginright);
		var multiple=parseInt(windowwidth/divallwidth);
		var needwidth=parseInt(windowwidth/multiple)-parseInt(marginleft)-parseInt(marginright);
		$('.twitterTopicListLi').width(needwidth);
	}
}

$(window).resize(function(){
	resizepvrScheduleList();
	resizeRecordFileList();
	resizecatchUpTopicList();
});

/** 
 * 时间对象的格式化; 
 */  
Date.prototype.format = function(format) {  
	/* 
	 * eg:format="yyyy-MM-dd hh:mm:ss"; 
	 */  
	var o = {  
		"M+" : this.getMonth() + 1, // month  
		"d+" : this.getDate(), // day  
		"h+" : this.getHours(), // hour  
		"m+" : this.getMinutes(), // minute  
		"s+" : this.getSeconds(), // second  
		"q+" : Math.floor((this.getMonth() + 3) / 3), // quarter  
		"S" : this.getMilliseconds()  
		// millisecond  
	}  
  
	if (/(y+)/.test(format)) {  
		format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4  
						- RegExp.$1.length));  
	}  
  
	for (var k in o) {  
		if (new RegExp("(" + k + ")").test(format)) {  
			format = format.replace(RegExp.$1, RegExp.$1.length == 1  
							? o[k]  
							: ("00" + o[k]).substr(("" + o[k]).length));  
		}  
	}  
	return format;  
}

