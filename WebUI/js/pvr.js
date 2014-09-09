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
var catchUpScheduleObj    = new Array();
var catchUpTopicArray     = new Array("true", "true", "true"); //default book all the topic
var twitterIconName 	  = "";
var countryCode           = "";
var loadingLabel          = "";
var remotePVRStart        = "";
var remotePVRFailed       = "";
var catchUpConflictObj    = "";
var localConflictObj      = "";
var catchUpNoConflictObj  = "";

var twitterUK             = [{topic:"WorldCup_GB", displayName:"WorldCup", accountName:"WldcpTVmanuk", description:"The Matches, teams, News", twitterId:"476281877280460800", image:"topic_World_Cup.png"},
							 {topic:"Sports_GB", displayName:"Sports", accountName:"SportsTVmanuk", description:"Football, Tennis, Rugby, F1",twitterId:"476276881440796672", image:"topic_Sports.jpg"}];

var twitterFR             = [{topic:"WorldCup_FR", displayName:"Coupe du Monde", accountName:"WldcpTVmanfr", description:"Les matches, équipes, information",twitterId:"476278045532098560", image:"topic_World_Cup.png"},
							 {topic:"Sports_FR", displayName:"Sports", accountName:"SportTVmanfr", description:"Football, Tennis, Rugby, F1",twitterId:"479913205511094273", image:"topic_Sports.jpg"}];

var twitterIT             = [{topic:"WorldCup_IT", displayName:"Coppa del mondo", accountName:"WldcpTVmanit", description:"Fiammiferi, squadre, informazioni",twitterId:"471980729778180096", image:"topic_World_Cup.png"},
							 {topic:"Sports_IT", displayName:"Sports", accountName:"SportTVmanit", description:"Football, Tennis, Rugby, F1",twitterId:"479913745922007040", image:"topic_Sports.jpg"}];

var twitterTW             = [{topic:"Sports_TW", displayName:"運動", accountName:"SportsTVmantw", description:"運動：棒球、籃球",twitterId:"479914121597448192", image:"topic_SportsTVmantw.jpg"},
							 {topic:"Fl_TW", displayName:"語言學習", accountName:"FlTVmantw", description:"語言學習：英文、日文、客家語",twitterId:"479914742656430080", image:"topic_FlTVmantw.jpg"},
							 {topic:"ChildrenShow_TW", displayName:"兒童節目", accountName:"CdsTVmantw", description:"卡通、兒童育樂節目",twitterId:"479914968125423616", image:"topic_CdsTVmantw.jpg"}];

var twitterAccountList    = [{group:"GB", accoutList:twitterUK},
							 {group:"FR", accoutList:twitterFR},
							 {group:"EU", accoutList:twitterIT},
							 {group:"TW", accoutList:twitterTW}];

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
                            	<div class="pvrItemImgDiv"><img src="./img/video.png" onerror="imgError(this);"/></div>\
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
                        <div class="catchUpPVRScheduleItem ui-body ui-body-a" data-index="0" ata-role="button" >\
                            <table style=" border:none; padding:0; margin:0;">\
                            <tr>\
								<td rowspan="3"><img class="channelIcon" src="img/a_lequipe21.png" style="padding:0.25em">\
								</td><td class="channelName">CH02:BBC Sports 1</td>\
							</tr>\
                            <tr><td class="displayName">England vs Japan</td></tr>\
                            <tr><td class="timeLabel">2014/06/19 18:00-20:00</td></tr>\
                            </table>\
                            <div class="catchUpItemMaskDiv">\
                                <div class="catchUpItemCheckBox ui-icon-custom-selected-blue" data-isCheck="true"></div>\
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

var topicItem = '<li class="catchUpTopicListLi" data-topicName="WorldCup_UK">\
                    <div style="padding:0.3em 0.6em"> \
                        <div class="catchUpTopicItemDiv" data-role="button" data-id="476281877280460800" data-account="WldcpTVmanuk" data-img="topic_World_Cup.png">\
                            <div class="catchUpTopicImgDiv"><img src="./img/topic_World_Cup.png"/></div>\
                            <div class="catchUpTopicInfoDiv">\
                                <div>\
                                    <span class="catchUpTopicInfoTopic"><b>World Cup</b></span>\
                                    <span class="red_dot_img" style="display:none;"><img src="./img/red-dot.png" style="height:0.5em; width:0.5em;float: left;margin-right: 6px;"></span>\
                                </div>\
                                <div class="catchUpTopicInfoDesDiv"><span class="catchUpTopicInfoDes">The Matches,teams,news...</span>\
                                </div>\
                            </div>\
                            <div class="catchUpTopicMaskDiv">\
                                <div class="catchUpTopicCheckBox ui-icon-custom-selected-blue" data-isCheck="true"></div>\
                            </div>\
                        </div>\
                    </div>\
                </li>'

var topicItemComing = '<li class="catchUpTopicListLi" style="padding:0;position:relative;height:8em;width:17em;float:left;">\
                    <div style="padding:0.3em 0.6em">      \
                        <div style="height:6em;	background-color:white;color: black;padding:0.5em 0.5em;">\
                            <div style="width: 20%;float: left;padding-right: 0.1em;margin-top: 0.2em;"><img src="./img/TVman.png" style="height:2.3em;"/></div>\
                            <div style="width:78%;height:6em;float:left;">\
                                <div><span class="catchUpTopicInfoTopic"><b></b></span></div>\
                                <div style=" margin-top:1.45em;line-height:130%;padding-top: 0.5em;background-color:#f9f9fa;height: 4em;padding-left: 0.5em;">\
                                <span  style="font-size:1.1em; font-weight:700; text-shadow:none; padding-top: 0.2em;display: block; color:#666;">Coming soon...</span>\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
                </li>'

var conflictItemOrg = '<li class="syncListLi">\
                        <table style=" border:none; padding:0; margin:0;">\
                            <tr>\
                                <td rowspan="3"><img class="channelIcon" src="img/a_lequipe21.png" style="padding:0.25em">\
                                </td><td class="channelName">CH02:BBC Sports 1</td>\
                            </tr>\
                            <tr><td class="displayName">England vs Japan</td></tr>\
                            <tr><td class="timeLabel">2014/06/19 18:00-20:00</td></tr>\
                        </table>\
                    </li>'
                

/*=======================================Init function============================================*/ 
function init() {
    if(browser.versions.android) {
        preventTheDefaultEvent();
    }

    window.location = "native://PVRInit";
}

/*=======================================public slot============================================*/
function onDataWithJSON(data, key) { 
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
			countryCode      = temp.CountryCode;
		var catchUpTopicData = temp.Topic;
        var catchUp          = temp.CatchUp;
		    loadingLabel     = temp.loading;
        var twitter          = temp.Twitter;
        var syncLabel        = temp.SyncLabel;
        var catchUpContent   = temp.CatchUpContent;
            remotePVRStart   = temp.RemotePVRStart;
            remotePVRFailed  = temp.RemotePVRFailed;

        //calculateCurrentTime
		var	now 	  = new Date().getTime();
		var nowoffset = new Date().getTimezoneOffset();
		nowoffset 	  = nowoffset * 60 * 1000;

		if(typeof(temp.CurrentTime.UTCDiff) != "undefined" && typeof(temp.CurrentTime.Offset) != "undefined"){
			currentTime = new Date(parseInt(now) + parseInt(nowoffset) + parseInt(temp.CurrentTime.UTCDiff) +  parseInt(temp.CurrentTime.Offset));
			utcdiff	= parseInt(temp.CurrentTime.UTCDiff);
			offset  = parseInt(temp.CurrentTime.Offset);
		}
        $("#pvrScheduleLabel_PVR").html(pvrScheduleLabel);
        $("#recordFilesLabel_RecordFile").html(recordFilesLabel);
        $("#header_catchUpTopicPage").html(catchUp);
        $("#header_Twitter").html(twitter);
        $("#syncLabel").html(syncLabel);
        $("#header_RecommandPVRPage").html(catchUpContent);
		
        initPVRShedule(pvrScheduleArray);
		nowRecordId = temp.RecordingItemId;
		findNowRecord(nowRecordId);
        initRecordFiles(recordFilesArray);
        initChannelList(channelList);
        initCatchUpTopic(catchUpTopicData);
		
    } else if(key == "UpdateRemoteFileList") {
        var recordFilesArray = temp.PVR;
        initRecordFiles(recordFilesArray);

    } else if(key == "UpdateRecItemList") {
        var whichPageId = $.mobile.activePage.attr("id");
        if(whichPageId != "mergePage") {
            $.mobile.changePage("#pvrPage",  { transition: "none"});
        }

		var pvrScheduleArray = temp.PVRSchedule;
		initPVRShedule(pvrScheduleArray);
		findNowRecord(nowRecordId);

	} else if(key == "UpdateTime") {
		var	now 	  = new Date().getTime();
		var nowoffset = new Date().getTimezoneOffset();
		nowoffset 	  = nowoffset * 60 * 1000;

		if(typeof(temp.CurrentTime.UTCDiff) != "undefined" && typeof(temp.CurrentTime.Offset) != "undefined"){
			currentTime = new Date(parseInt(now)+parseInt(nowoffset)+parseInt(temp.CurrentTime.UTCDiff)+parseInt(temp.CurrentTime.Offset));
			utcdiff	= parseInt(temp.CurrentTime.UTCDiff);
			offset  = parseInt(temp.CurrentTime.Offset);
		}

	} else if(key == "RecordStartNotification") {
		nowRecordId = temp;
		findNowRecord(nowRecordId);

	} else if(key == "RecordFinishNotification") {
		nowRecordId = -1;
		var pvrScheduleArray = temp.PVRSchedule;
		initPVRShedule(pvrScheduleArray);
	
	} else if(key == "PVRFromS3") {
        
		var isSucceed = temp.isSucceed;

		if(isSucceed) {
			hideLoader();
			initPVRFromS3(temp.PVR);
			$.mobile.changePage("#catchUpPVRSchedulePage", { transition: "slide", reverse:true});
	        $("#catchUpPVRSchedulePage").focus();
    	} else {
    		showLoader(remotePVRFailed);
    		setTimeout("hideLoader()", 1000);
    	}

	} else if(key == "SyncTopicFinishNotification") {
		initCatchUpTopic(temp);

	}
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
	showLoader(remotePVRStart);
    window.location = "native://GetPVRFromS3?" + url;
}

function syncCatchUpTopic(jsonarray){
	window.location = "native://SyncTopicSubscription?" + jsonarray;
}

/*=======================================Init function============================================*/
function initPVRShedule(data) {
    var pvrScheduleList = $("#pvrScheduleList");
    pvrScheduleList.children().remove();
    pvrScheduleList.empty();
	pvrScheduleObj = new Array();

    $.each(data, function(index,value) {
        var channelName    = value.ChannelName;
        var displayName    = value.DisplayName;
        var startTime      = new Date(value.StartYear + "/" + value.StartMonth + "/" + value.StartDay + " " + value.StartHour + ":" + value.StartMinute + ":0");
        var endTime        = new Date(value.EndYear + "/" + value.EndMonth + "/" + value.EndDay + " " + value.EndHour + ":" + value.EndMinute + ":0");
        var sheduleItem    = $(pvrScheduleItem);
		var recordItemId   = value.RecordItemId;
		var networkId      = value.NetworkId;
		var tsId 	       = value.TsId;
		var serviceId 	   = value.ProgId;
		var iconKey   	   = getChannelIconKey(networkId, tsId, serviceId);
		var iconName  	   = getIconNameFromKey(iconKey);
		
        sheduleItem.children("a").attr("data-PVRIndex", index);
		sheduleItem.children("a").attr("data-recordId", recordItemId);
		sheduleItem.find(".pvrItemRecDiv").attr("data-recordId",recordItemId);
        sheduleItem.find("#channelName_pvrShedule").html("CH:"+channelName).attr("id", "channelName" + index + "_pvrShedule");
        sheduleItem.find("#programme_pvrShedule").html(displayName == "" ? "&nbsp" : displayName).attr("id", "programme" + index + "_pvrShedule");
        sheduleItem.find("#startTime_pvrShedule").html(startTime.format("yyyy-MM-dd hh:mm")).attr("id", "startTime" + index + "_pvrShedule");
        sheduleItem.find("#endTime_pvrShedule").html(endTime.format("hh:mm")).attr("id", "endTime" + index + "_pvrShedule");
        sheduleItem.find(".pvrItemImgDiv img").attr("src", "./img/"+ iconName +".png");

        pvrScheduleObj[index] = value;
        pvrScheduleObj[index].startTime = startTime;
        pvrScheduleObj[index].endTime   = endTime;

        pvrScheduleList.append(sheduleItem);
    });

	pvrScheduleList.append(pvrScheduleItemBtn);
	resizepvrScheduleList();
}

function initRecordFiles(data) {
	
    var recFilesList = $("#recFilesList");
    recFilesList.children().remove();
    recFilesList.empty();

    $.each(data, function(index, value) {
        var filePath    = value.FilePath;
        var channelName = value.ChannelName;
        var displayName = value.DisplayName;
        var fileInfo    = value.FileInfo;
        var recordDate  = value.RecordDate;
        var recItem     = $(recordFileItem);
        recItem.children("a").attr("data-path", filePath);
        recItem.find("#channelName_recFile").html(channelName).attr("id", "channelName" + index + "_recFile");
        recItem.find("#programme_recFile").html(displayName == "" ? "&nbsp" : displayName).attr("id", "programme" + index + "_recFile");
        recItem.find("#recTime_recFile").html(recordDate).attr("id", "recTime" + index + "_recFile");
        recItem.find("#fileInfo_recFile").html(fileInfo).attr("id", "fileInfo" + index + "_recFile");

        recFilesList.append(recItem);
    });

	resizeRecordFileList();
}

function initChannelList(data) {
    var channelList = $("#channelList");
    channelList.children().remove();
    channelList.empty();
    
    $("#applyButton").html(confirmLabel);
    $.each(data, function(index, value){
        channelList.append('<li data-icon="false" class="channelItem" data-index="'+index+'" value="' + value.ChannelName + '">' + value.ChannelName + '</li>');
    });
}

function initCatchUpTopic(data) {
	var catchUpTopicList = $("#catchUpTopicList");
	catchUpTopicList.children().remove();
	catchUpTopicList.empty();

	var accoutList = "";
	$.each(twitterAccountList, function(index, value) {
		if(value.group == countryCode) {
			accoutList = value.accoutList;
		}
	});

	$.each(accoutList, function(index, value) {
		var topicItemLi = $(topicItem);
	
		topicItemLi.attr("data-topicName", value.topic);
		topicItemLi.find(".catchUpTopicInfoTopic>b").html(value.displayName);
		topicItemLi.find(".catchUpTopicInfoDes").html(value.description);
		topicItemLi.find(".catchUpTopicItemDiv").attr("data-id", value.twitterId);
		topicItemLi.find(".catchUpTopicItemDiv").attr("data-account", value.accountName);
		topicItemLi.find(".catchUpTopicItemDiv").attr("data-img", value.image);
		topicItemLi.find(".catchUpTopicImgDiv>img").attr("src", "./img/" + value.image);

		catchUpTopicList.append(topicItemLi);
	});

	var topicItemComingLi = $(topicItemComing);
	catchUpTopicList.append(topicItemComingLi);
	resizecatchUpTopicList();


	 var validTopicIndex = -1;
	 $.each(data, function(index, value) {
	 	
	 	if(value.TopicName.indexOf(countryCode.toUpperCase()) >= 0) {
	 		validTopicIndex++;
			catchUpTopicArray[validTopicIndex] = value.Subscribed == 1 ? "true" : "false";
			
			if (catchUpTopicArray[validTopicIndex] == "true") {
				$(".catchUpTopicCheckBox:eq(" + validTopicIndex + ")").removeClass("ui-icon-custom-unselect").addClass("ui-icon-custom-selected-blue");
			} else {
				$(".catchUpTopicCheckBox:eq(" + validTopicIndex + ")").removeClass("ui-icon-custom-selected-blue").addClass("ui-icon-custom-unselect");
			}
	 	}
	 });
}

function initPVRFromS3(data) {

	 var catchUpPVRScheduleList = $("#catchUpPVRScheduleList");
	 catchUpPVRScheduleList.children().remove();
	 catchUpPVRScheduleList.empty();

	  var topic                = data.Topic;
	  var description          = data.Description;
	  var countryCode          = data.CountryCode; 
	  var catchUpPVRSchedule   = data.PVRSchedule;

	  var index   = description.indexOf("http");
	  description = description.substr(0, index);
	  
	  twitterIconURL = "./img/" +twitterIconName;
	  $(".twitterImg").attr("src",twitterIconURL);

	 $("#topic_catchUpPVRSchedulePage").html(topic);
	 $("#description_catchUpPVRSchedulePage").html(description);
		
	 catchUpScheduleObj = new Array();
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
		var networkId   = value.NetworkId;
		var tsId        = value.TsId;
		var serviceId   = value.ProgId;
		var iconKey     = getChannelIconKey(networkId, tsId, serviceId);
		var iconName    = getIconNameFromKey(iconKey);

	 	var catchUpItem = $(catchUpPVRScheduleItem);
	
		catchUpItem.find(".catchUpPVRScheduleItem").attr("data-index", index);
		catchUpItem.find(".channelName").html(channelName);
		catchUpItem.find(".displayName").html(displayName);
		catchUpItem.find(".channelIcon").attr("src", "./img/" + iconName + ".png");
		
        var startTime = new Date(startYear + "/" + startMonth + "/" + startDay + " " + startHour + ":" + startMinute + ":0");
        	startTime = new Date(startTime.getTime() + offset);
        var endTime   = new Date(endYear + "/" + endMonth + "/" + endDay + " " + endHour + ":" + endMinute + ":0");
            endTime   = new Date(endTime.getTime() + offset);
        var timeLabel = startTime.format("yyyy-MM-dd hh:mm") + " - " + endTime.format("hh:mm");

		catchUpItem.find(".timeLabel").html(timeLabel);
		//xinjia
		//cuurentTime
	 	var nowTime     = new Date().getTime();
	 	var nowOffset	= new Date().getTimezoneOffset();
			nowOffset 	= nowOffset * 60 * 1000;
		 	currentTime = new Date(parseInt(nowTime) + parseInt(nowOffset) + utcdiff + offset);
			
		if(currentTime > endTime || !isValidPVRSchedule(networkId, tsId, serviceId)) {
			catchUpItem.find(".catchUpItemMaskDiv").remove();	
			catchUpItem.find(".catchUpPVRScheduleItem ").css("color","grey");
		}
		//xinjia end
		
	  	catchUpScheduleObj[index] = value;
	  	catchUpScheduleObj[index].startTime = startTime;
	  	catchUpScheduleObj[index].endTime = endTime;
		
	 	catchUpPVRScheduleList.append(catchUpItem);
	 });		
}

function initMergePage() {
    //init the remote pvr
    var remotePVRList = $("#syncList");
    remotePVRList.children().remove();
    remotePVRList.empty();
    
    $.each(catchUpConflictObj, function(index, value) {
        var channelName = value.ChannelName;
        var displayName = value.DisplayName;
        var networkId   = value.NetworkId;
        var tsId        = value.TsId;
        var serviceId   = value.ProgId;
        var iconKey     = getChannelIconKey(networkId, tsId, serviceId);
        var iconName    = getIconNameFromKey(iconKey);
           
        var conflictItem = $(conflictItemOrg);
    
        conflictItem.find(".channelName").html(channelName);
        conflictItem.find(".displayName").html(displayName);
        conflictItem.find(".channelIcon").attr("src", "./img/" + iconName + ".png");
        
        var startTime = value.startTime;
        var endTime   = value.endTime;
           
        var timeLabel = startTime.format("yyyy-MM-dd hh:mm") + " - " + endTime.format("hh:mm");
        conflictItem.find(".timeLabel").html(timeLabel);
        
        remotePVRList.append(conflictItem);
     });
    
    //init the local pvr
    var localPVRList = $("#localList");
    localPVRList.children().remove();
    localPVRList.empty();
    
    $.each(localConflictObj, function(index, value) {
        var channelName = value.ChannelName;
        var displayName = value.DisplayName;
        var networkId   = value.NetworkId;
        var tsId        = value.TsId;
        var serviceId   = value.ProgId;
        var iconKey     = getChannelIconKey(networkId, tsId, serviceId);
        var iconName    = getIconNameFromKey(iconKey);
           
        var conflictItem = $(conflictItemOrg);
    
        conflictItem.find(".channelName").html(channelName);
        conflictItem.find(".displayName").html(displayName);
        conflictItem.find(".channelIcon").attr("src", "./img/" + iconName + ".png");
           
        var startTime = value.startTime;
        var endTime   = value.endTime;
           
        var timeLabel = startTime.format("yyyy-MM-dd hh:mm") + " - " + endTime.format("hh:mm");
        conflictItem.find(".timeLabel").html(timeLabel);
        
        localPVRList.append(conflictItem);
     });
}

/*=======================================private function============================================*/
function findNowRecord(nowRecordId) {
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

function isValidPVRSchedule(networkId, tsId, serviceId) {
	var isValid = false;
	$.each(channelList, function(channelIndex, channel) {
			if(serviceId == channel.ServiceId &&
				networkId == channel.NetworkId &&
				tsId == channel.TsId ) {

				isValid = true;
		}
	});
	return isValid;
}
 
function showLoader(tips) {
    $.mobile.loading('show', {  
        text: '',
        textVisible: true,
        theme: 'a',
        textonly: false, 
        html: "<div><center><img src='./img/icon-loading.gif' /></center>" +
			"<h1>"+ tips+ "</h1>" +
			"</div>"
    });
}

function dynamicMergeLayout() {
    /* Some orientation changes leave the scroll position at something
     * that isn't 0,0. This is annoying for user experience. */
    scroll(0, 0);
    /* Calculate the geometry that our content area should take */
    var header = $("#mergeHeader");
    var content = $("#mergeContent");

    var viewportHeight = $(window).height();    
    var contentHeight = viewportHeight - header.outerHeight();
    contentHeight -= (content.outerHeight() - content.height());
    content.height(contentHeight);

    var mergeButton = $("#mergeButton");
    var temp = mergeButton.css("margin-top");
    var compareHeight = contentHeight - mergeButton.outerHeight() - temp.split("p")[0];
    compareHeight -= ($("#compareArea").height() - $("#compareArea").outerHeight());
    $("#compareArea").height(compareHeight);

    var maxHeight = (compareHeight - $("#tipsBar").height()) / 2.0;

    //Sync PVR Height
    var syncListHeight = $("#syncList").height();
    var syncShouldHeight = 0;
    if(syncListHeight < maxHeight) {
        syncShouldHeight = syncListHeight;
    } else {
        if($("#localList").height() >= maxHeight){
            syncShouldHeight = maxHeight;
        } else {
            maxHeight = maxHeight * 2 - $("#localList").height();
            syncShouldHeight = maxHeight < syncListHeight ? maxHeight : syncListHeight;
        }
    }
    $("#syncList").height(syncShouldHeight);
    $("#syncDiv").height(syncShouldHeight);

    //Sync PVR Height
    var localListHeight = $("#localList").height();
    maxHeight = (compareHeight - syncShouldHeight - $("#tipsBar").height());
    var localShouldHeight = 0;
    if(localListHeight < maxHeight) {
        localShouldHeight = localListHeight;
    } else {
        localShouldHeight = maxHeight;
    }
    $("#localList").height(localShouldHeight);
    $("#localDiv").height(localShouldHeight);
    
    compareHeight = $("#syncDiv").height() + $("#localDiv").height() +  $("#tipsBar").height();
    $("#compareArea").height(compareHeight);
  };

//this code just for android.
function preventTheDefaultEvent() {
    document.ontouchmove = function(event) {
        event.preventDefault();
    };
    
    $("[data-role='page']").on("pageshow pageinit", function(e, data) {

        $(this).bind("scroll", function(e, data) {
            var top = $(document).scrollTop() + data.distance.y;
            $.mobile.silentScroll(top);
        });
    });

    $("[data-role='page']").on("pagehide", function(e, data) {
        $(this).unbind("scroll");
        $(document).scrollTop(0);
        $.mobile.silentScroll(0);
    });

    $("[data-role='page']").on("pagebeforeshow", function(e, data) {
        $(this).unbind("scroll");
        $(document).scrollTop(0);
        $.mobile.silentScroll(0);
    });
}

function hideLoader()  
{
    $.mobile.loading('hide');  
}
  
function hideLoader()  
{  
    $.mobile.loading('hide');  
} 

function imgError(image) {
    image.onerror = "";
    image.src = "./img/video.png";
    return true;
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
	var tempWidth  = $(window).width();
	iframe.height(tempHeight);
	iframe.width(tempWidth);

	iframe.contents().find("a:not(.e-entry-content)").click(function() {
		return false;
	});

	iframe.contents().find(".e-entry-content a").click(function() {
		getPVRFromS3($(this).attr("href"));
		return false;
	});
}

function syncTwitterSchedual() {
    
    $.each(catchUpScheduleObj, function(index, catchUpSchedule) {
           var startTime = catchUpSchedule.startTime;
           var endTime   = catchUpSchedule.endTime;
           
           var conflictIndex = iftimeconflict(startTime, endTime, -1);
           
           if(conflictIndex >= 1) {
                catchUpConflictObj[catchUpConflictObj.length] = catchUpSchedule;
                localConflictObj[localConflictObj.length] = pvrScheduleObj[conflictIndex - 1];
           } else {
                catchUpNoConflictObj[catchUpNoConflictObj.length] = catchUpSchedule;
           }
    });

    //sync the no conflict
    if(catchUpNoConflictObj.length > 0) {
        syncPVRScheduleList(catchUpNoConflictObj);
    }
    
    if(catchUpConflictObj.length > 0) {
        initMergePage();
        $.mobile.changePage("#mergePage",  { transition: "none"});
        dynamicMergeLayout();
    }
}

// Yang begin
function syncPVRScheduleList(objectList) {
    var jsonStrArray = [];
    var recordItemId = new Date().getTime();
    
    $.each(objectList, function(catchUpScheduleIndex, catchUpScheduleItem) {
           
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
            StartYear	: startTime.getFullYear(),
            StartMonth	: startTime.getMonth() + 1,
            StartDay	: startTime.getDate(),
            StartHour	: startTime.getHours(),
            StartMinute	: startTime.getMinutes(),
            StartSecond : startTime.getSeconds(),
            EndYear		: endTime.getFullYear(),
            EndMonth	: endTime.getMonth() + 1,
            EndDay		: endTime.getDate(),
            EndHour		: endTime.getHours(),
            EndMinute	: endTime.getMinutes(),
            EndSecond	: endTime.getSeconds(),
            ProgId		: catchUpScheduleItem.ProgId,
            NetworkId	: catchUpScheduleItem.NetworkId,
            TsId		: catchUpScheduleItem.TsId,
            Version		: catchUpScheduleItem.Version,
            ChannelName	: catchUpScheduleItem.ChannelName,
            DisplayName	: catchUpScheduleItem.DisplayName,
            EventId		: 0,
            RecordItemId: parseInt(recordItemId / 1000) + catchUpScheduleIndex,
            PidArray	: pidArray,
            Bandwidth	: bandwidth,
            Frequency	: frequency
        };
           
        jsonStrArray.push(jsonstr);
    });
    addRecItem(JSON.stringify(jsonStrArray));
}
// Yang end

/*=======================================JQuery Binding============================================*/
/*===================================delect record and documents===================================*/
$(document).ready(function () {
    $("#delButton_PVR").click(function() {
		if($('.pvrScheduleListli').length > 0) {
			var pvrScheduleListdiv = $("#pvrScheduleList li>div")
			if(pvrScheduleListdiv.length > 0) {
				if (pvrFileEditStatus == false) {
					pvrFileEditStatus = true;
					
					$("#delButton_PVR").removeClass("ui-icon-custom-edit");
					$("#delButton_PVR").addClass("ui-icon-custom-delete");

					pvrScheduleListdiv.fadeIn(200);
					$("#cancelpvrselect").fadeIn(200);
					$(".pvrScheduleAddItem").fadeOut(200);
					$("#pvrPage").unbind("swipeleft").unbind("swiperight");

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

					$(".pvrScheduleAddItem").fadeIn(200);

					$("#pvrPage").on("swiperight",function(){
						$.mobile.changePage("#catchUpTopicPage",  { transition: "slide", reverse:true});
						resizecatchUpTopicList();
					});

					$("#pvrPage").on("swipeleft",function(){
						$.mobile.changePage("#recFilesPage",  { transition: "slide" });
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
			resizecatchUpTopicList();
		});
		$("#pvrPage").on("swipeleft",function(){
			$.mobile.changePage("#recFilesPage",  { transition: "slide" });
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
				$("#recFilesPage").unbind("swipeleft").unbind("swiperight");;

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
		});
	});

/*=======================================Sliding============================================*/
    $("#pvrPage").on("swiperight",function(){
        $.mobile.changePage("#catchUpTopicPage",  { transition: "slide", reverse:true});
		resizecatchUpTopicList();
    });
    $("#pvrPage").on("swipeleft",function(){
        $.mobile.changePage("#recFilesPage",  { transition: "slide" });
		resizeRecordFileList();
    });
    $("#catchUpTopicPage").on("swipeleft",function(){
        $.mobile.changePage("#pvrPage",  { transition: "slide"});
		resizepvrScheduleList();
    });
    $("#recFilesPage").on("swiperight",function(){
        $.mobile.changePage("#pvrPage",  { transition: "slide", reverse:true});
		resizepvrScheduleList();
    });

    var formTime = {
        preset	   : 'datetime',
        theme	   : 'android-ics', 
        display	   : 'modal', 
        mode	   : 'Scroller', 
        dateFormat : 'yy-mm-dd', 
        dateOrder  : 'yymmdd', 
        startYear  : 2010,
        endYear    : 2050,
        animate	   : "slideup",
		timeFormat : 'HH:ii',
		height     : 30,
		showOnFocus: false
    };

    var toTime = {
        preset     : 'datetime',
        theme	   : 'android-ics', 
        display	   : 'modal', 
        mode	   : 'Scroller', 
        dateFormat : 'yy-mm-dd', 
        dateOrder  : 'yymmdd', 
        startYear  : 2010,
        endYear	   : 2050,
        animate	   : "slideup",
		timeFormat : 'HH:ii',
		height	   : 30,
		showOnFocus: false
    };
    $("#formTimeSelect").textinput();
	$("#toTimeSelect").textinput();
    $("#formTimeSelect").mobiscroll(formTime);
    $("#toTimeSelect").mobiscroll(toTime);
});

$(function() {
    headerHeight = $("#pvrHeader").height();

    $("body").on("click", ".channelItem", function() {
        var channelName = $(this).html();
        var preCheck    = $("#channelList").find("[data-icon=check]");
		
        preCheck.attr("data-icon", "false");
        preCheck.removeClass("ui-btn-icon-right ui-icon-custom-check");

        $(this).attr("data-icon", "check");
        $(this).addClass("ui-btn-icon-right ui-icon-custom-check");
		$("#channelName_recItemEdit").attr("data-index",$(this).attr("data-index"));
        $("#channelName_recItemEdit").html(channelName);
    });

    $("body").on("click", ".recordFileItem", function() {
        playFile($(this).attr("data-path"));
    });

    $("body").on("click", "#recordEditItemPage", function() {
		if(currentTime == 0){
			return;
		}

		$("#formTimeSelect").css({"background-color":"transparent"});
		$("#toTimeSelect").css({"background-color":"transparent"});
        var pvrScheduleItemObj = pvrScheduleObj[$(this).attr("data-PVRIndex")];
		 $("#recItemIndex").val($(this).attr("data-PVRIndex"));
		 $("#channelName_recItemEdit").attr("data-index","-1");
		 $("#channelName_recItemEdit").html(pvrScheduleItemObj.ChannelName);
		 $("#channelName_recItemEdit").attr("href","#");
         $("#displayName_recItemEdit").val(pvrScheduleItemObj.DisplayName);
         $("#formTimeSelect").val(pvrScheduleItemObj.startTime);
         $("#toTimeSelect").val(pvrScheduleItemObj.endTime);
		 var pvrItemRecDiv=$(this).find(".pvrItemRecDiv");
		if(pvrItemRecDiv.attr("data-recordId") == nowRecordId){
			$("#formTimeSelect").textinput("disable");
		}else{
			$("#formTimeSelect").textinput("enable");
		}
		$.mobile.changePage("#recordItemPage",  { transition: "slide" });
    });
	
	$("body").on("click", ".pvrScheduleAddItem", function() {
		if(currentTime == 0){
			return;
		}

		$("#formTimeSelect").css({"background-color":"transparent"});
		$("#toTimeSelect").css({"background-color":"transparent"});
		$("#recItemIndex").val('-1');
		$("#channelName_recItemEdit").attr("data-index","0");
		$("#channelName_recItemEdit").html(channelList[0].ChannelName);
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
	$(".twitterBack").click(function(){
		$("#twitterContent").empty();
		$("#twitter-wjs").remove();
		$("iframe").empty();

		$.mobile.changePage("#catchUpTopicPage",  { transition: "slide"});
		resizecatchUpTopicList();
	});

    $("body").on("click", ".catchUpTopicListLi:not(:last)", function() {
		var twitterAccount = $(this).find(".catchUpTopicItemDiv").attr("data-account");
		var twitterId 	   = $(this).find(".catchUpTopicItemDiv").attr("data-id");
		twitterIconName    = $(this).find(".catchUpTopicItemDiv").attr("data-img"); 
		
		$("#twitterContent").empty();
		$("#twitter-wjs").remove();
		$("iframe").empty();
		
        $.mobile.changePage("#twitterPage", {transition: "slide", reverse: true});
        $("#twitterContent").append('<a style="text-shadow:none; text-decoration:none; font-size:14px; font-weight:normal;" class="twitter-timeline" data-dnt="true" href="https://twitter.com/' + twitterAccount+'" data-widget-id="' + twitterId + '"><div style="text-align:center; margin-top:45%; width:100%;"><span style="font-size:1em;color:white;">' + loadingLabel + '...</span></div></a>');
		loadTwitter();
    });

	$("body").on("click",".catchUpTopicMaskDiv", function() {
		var checkBox = $(this).find(".catchUpTopicCheckBox");

		if (checkBox.attr("data-isCheck") == "false") {
			checkBox.removeClass("ui-icon-custom-unselect").addClass("ui-icon-custom-selected-blue");
			checkBox.attr("data-isCheck","true");

		} else {
			checkBox.removeClass("ui-icon-custom-selected-blue").addClass("ui-icon-custom-unselect");
			checkBox.attr("data-isCheck","false");
		}
		return false;
	});


	$(document).on("pagehide","#catchUpTopicPage",function(){
		var jsonArray = [];

		$.each($(".catchUpTopicListLi:not(:last)"), function(index, value) {
			var isCheckNow = $(this).find(".catchUpTopicCheckBox").attr("data-isCheck");
			var isCheckOld = catchUpTopicArray[index];
			var jsonStr    = {};
			var topicName  = "";
			var subscribed = "";

			if(isCheckNow != isCheckOld) {

				topicName = $(this).attr("data-topicName");

				if($(this).find(".catchUpTopicCheckBox").attr("data-isCheck") == "true") {
					subscribed = 1;
					catchUpTopicArray[index] = "true";
				} else {
					subscribed = 0;
					catchUpTopicArray[index] = "false";
				}

				jsonStr.TopicName  = topicName;
				jsonStr.Subscribed = subscribed;
				jsonArray.push(jsonStr);
			}
		});
		syncCatchUpTopic(JSON.stringify(jsonArray));
	});
	
	
	$("body").on("click", ".catchUpItemMaskDiv", function() {
		
        var checkBox = $(this).find(".catchUpItemCheckBox");

		if(checkBox.attr("data-isCheck") == "false") {
			checkBox.removeClass("ui-icon-custom-unselect");
			checkBox.addClass("ui-icon-custom-selected-blue");
			checkBox.attr("data-isCheck", "true");
			
    	}else{
			checkBox.removeClass("ui-icon-custom-selected-blue");
			checkBox.addClass("ui-icon-custom-unselect");
			checkBox.attr("data-isCheck", "false");
    	}
    });

	$("body").on("click", ".syncBtn", function() {
        var tempArray = new Array();
        var catchUpPVRScheduleLi = $(".catchUpPVRScheduleLi");
                 
        $.each(catchUpPVRScheduleLi, function(index, value) {
            var checkBox = $(this).find(".catchUpItemCheckBox");
            if(checkBox.attr("data-isCheck") == "true") {
               tempArray[tempArray.length] = catchUpScheduleObj[index];
            }
        });
                 
        catchUpScheduleObj = tempArray;
                 
		if(catchUpScheduleObj.length >= 1) {
            catchUpConflictObj   = new Array();
            localConflictObj     = new Array();
            catchUpNoConflictObj = new Array();
                 
            syncTwitterSchedual();
		}
	});

    // merge js begin
    $("body").on("click","#syncDiv, .syncPVRLabel",function() {
        $(".syncPVRLabel").css("background-color","darkorange");
        $(".localPVRLabel").css("background-color","grey");
        $("#syncDiv").css("border","2px solid darkorange");
        $("#syncDiv").find(".tangle").addClass("selected");
        $("#localDiv").css("border","2px solid grey");
        $("#localDiv").find(".tangle").removeClass("selected");
    });

    $("body").on("click","#localDiv, .localPVRLabel",function() {
        $(".localPVRLabel").css("background-color","darkorange");
        $(".syncPVRLabel").css("background-color","grey");
        $("#localDiv").css("border","2px solid darkorange");
        $("#localDiv").find(".tangle").addClass("selected");
        $("#syncDiv").css("border","2px solid grey");
        $("#syncDiv").find(".tangle").removeClass("selected");
    });
  
  $("body").on("click", "#mergeButton", function() {
        var whichModuleSeleted = $("#compareArea").find(".selected").parent().attr("id");
               
        if(whichModuleSeleted == "syncDiv") {
            //s1: delete the local related pvr
            //s2: add catchup pvr.
            var tempArray = new Array();
            $.each(localConflictObj, function(index, value){
                tempArray[tempArray.length] = value.RecordItemId;
            });
               
            deletePvr(tempArray);
            setTimeout("syncPVRScheduleList(catchUpConflictObj)", 100);
            
               
        } else if(whichModuleSeleted == "localDiv") {
            //nothin: beacase local is already exist.
        }
        
               
        $.mobile.changePage("#pvrPage",  { transition: "none"});
  });

    // merge js end
	
	$("body").on("click", "#btnOk", function() {
		syncDialogWithOk();
		
		$.mobile.changePage("#pvrPage",  { transition: "none"});
	});
    // Yang end
});


$(function(){
	
	$("#formTimeSelect").click(function(){
		$("#formTimeSelect").css({"background-color":"transparent"});
		$("#toTimeSelect").css({"background-color":"transparent"});
	});

	$("#toTimeSelect").click(function(){
		$("#formTimeSelect").css({"background-color":"transparent"});
		$("#toTimeSelect").css({"background-color":"transparent"});
	});
	
    $("#toTimeSelect").change(function(){
		if($("#toTimeSelect").val() !="" && $("#formTimeSelect").val() != ""){
			var starttime = new Date($("#formTimeSelect").val().replace(/-/g, '/'));
			var endtime   = new Date($("#toTimeSelect").val().replace(/-/g, '/'));
			if(endtime <= currentTime){
				$("#formTimeSelect").css({"background-color":"#ff6464"});
				$("#toTimeSelect").css({"background-color":"#ff6464"});
				return;
			}
			if(starttime >= endtime){
				$("#formTimeSelect").css({"background-color":"#ff6464"});
				$("#toTimeSelect").css({"background-color":"#ff6464"});
				return;
			}
			if(iftimeconflict(starttime,endtime,$("#recItemIndex").val())){
				$("#formTimeSelect").css({"background-color":"#ff6464"});
				$("#toTimeSelect").css({"background-color":"#ff6464"});
				return;
			}
			$("#formTimeSelect").css({"background-color":"transparent"});
			$("#toTimeSelect").css({"background-color":"transparent"});
		}
	});

	$("#formTimeSelect").change(function(){
		if($("#toTimeSelect").val() != "" && $("#formTimeSelect").val() != ""){
			var starttime = new Date($("#formTimeSelect").val().replace(/-/g, '/'));
			var endtime   = new Date($("#toTimeSelect").val().replace(/-/g, '/'));
			if(endtime<=currentTime){
				$("#formTimeSelect").css({"background-color":"#ff6464"});
				$("#toTimeSelect").css({"background-color":"#ff6464"});
				return;
			}
			if(starttime>=endtime){
				$("#formTimeSelect").css({"background-color":"#ff6464"});
				$("#toTimeSelect").css({"background-color":"#ff6464"});
				return;
			}
			if(iftimeconflict(starttime,endtime,$("#recItemIndex").val())){
				$("#formTimeSelect").css({"background-color":"#ff6464"});
				$("#toTimeSelect").css({"background-color":"#ff6464"});
				return;
			}
			$("#formTimeSelect").css({"background-color":"transparent"});
			$("#toTimeSelect").css({"background-color":"transparent"});
		}
	});

	$("#applyButton").click(function(){
		
		if(currentTime == 0){
			return;
		}

		if($("#channelName_recItemEdit").html() == "" || $("#channelName_recItemEdit").html() == "　"){
			return;
		}
		/*if($("#displayName_recItemEdit").val()==""){
			$("#displayName_recItemEdit").css({"background-color":"#ff6464","color":"#fff"});
			return;
		}*/
		if($("#formTimeSelect").val() == ""){
			$("#formTimeSelect").css({"background-color":"#ff6464"});
			return;
		}

		if($("#toTimeSelect").val() == ""){
			$("#toTimeSelect").css({"background-color":"#ff6464"});
			return;
		}

		var starttime=new Date($("#formTimeSelect").val().replace(/-/g, '/'));
		var endtime=new Date($("#toTimeSelect").val().replace(/-/g, '/'));
		if(endtime <= currentTime){
			$("#formTimeSelect").css({"background-color":"#ff6464"});
			$("#toTimeSelect").css({"background-color":"#ff6464"});
			return;
		}
		if(starttime >= endtime){
			$("#formTimeSelect").css({"background-color":"#ff6464"});
			$("#toTimeSelect").css({"background-color":"#ff6464"});
			return;
		}
		if(iftimeconflict(starttime,endtime,$("#recItemIndex").val())){
			$("#formTimeSelect").css({"background-color":"#ff6464"});
			$("#toTimeSelect").css({"background-color":"#ff6464"});
			return;
		}
		var json = [];		
		json.StartYear   = starttime.getFullYear();
		json.StartMonth  = starttime.getMonth()+1;
		json.StartDay	 = starttime.getDate();
		json.StartHour	 = starttime.getHours();
		json.StartMinute = starttime.getMinutes();
		json.StartSecond = starttime.getSeconds();
		json.EndYear	 = endtime.getFullYear();
		json.EndMonth	 = endtime.getMonth() + 1;
		json.EndDay		 = endtime.getDate();
		json.EndHour	 = endtime.getHours();
		json.EndMinute	 = endtime.getMinutes();
		json.EndSecond	 = endtime.getSeconds();
		json.EventId	 = 0;
		
		var now = new Date().getTime();
		json.RecordItemId = parseInt((parseInt(now)+parseInt(utcdiff))/1000);
		
		if($("#channelName_recItemEdit").attr("data-index")!="-1"){
			var channel = channelList[parseInt($("#channelName_recItemEdit").attr("data-index"))];
			json.ChannelName = channel.ChannelName;
			json.ProgId		 = channel.ServiceId;
			json.Bandwidth	 = channel.Bandwidth;
			json.NetworkId	 = channel.NetworkId;
			json.TsId		 = channel.TsId;
			json.PidArray	 = channel.PidArray;
			json.Frequency	 = channel.Frequency;
			json.Version	 = 4;
		}

		if($("#recItemIndex").val()!= "-1"){
			var pvrScheduleItemObj = pvrScheduleObj[$("#recItemIndex").val()];
			json.RecordItemId	   = pvrScheduleItemObj.RecordItemId;
			json.ChannelName	   = pvrScheduleItemObj.ChannelName;
			json.EventId		   = pvrScheduleItemObj.EventId;
			json.ProgId			   = pvrScheduleItemObj.ProgId;
			json.Bandwidth		   = pvrScheduleItemObj.Bandwidth;
			json.NetworkId		   = pvrScheduleItemObj.NetworkId;
			json.TsId			   = pvrScheduleItemObj.TsId;
			json.PidArray		   = pvrScheduleItemObj.PidArray;
			json.Frequency		   = pvrScheduleItemObj.Frequency;
			json.Version		   = pvrScheduleItemObj.Version;
		}

		var jsonstr = {StartDay:json.StartDay,
					EndMonth	: json.EndMonth,
					StartMonth	: json.StartMonth,
					EventId		: json.EventId,
					ChannelName	: json.ChannelName,
					DisplayName	: $("#displayName_recItemEdit").val(),
					RecordItemId: json.RecordItemId,
					EndMinute	: json.EndMinute,
					StartHour	: json.StartHour,
					ProgId		: json.ProgId,
					Bandwidth	: json.Bandwidth,
					EndSecond	: json.EndSecond,
					EndHour		: json.EndHour,
					StartYear	: json.StartYear,
					NetworkId	: json.NetworkId,
					TsId		: json.TsId,
					StartMinute	: json.StartMinute,
					EndDay		: json.EndDay,
					StartSecond	: json.StartSecond,
					PidArray	: json.PidArray,
					EndYear		: json.EndYear,
					Frequency	: json.Frequency,
					Version		: json.Version};

		if($("#recItemIndex").val()!= "-1") {
			modifyRecItem(JSON.stringify(jsonstr));

		} else {
			var jsonstrarray = [];
			jsonstrarray.push(jsonstr);
			addRecItem(JSON.stringify(jsonstrarray));
		}
	});
});


function iftimeconflict(starttime,endtime,recItemIndex){
    data = pvrScheduleObj
    flag = 0;
    $.each(data, function(index,value) {
        if(index != recItemIndex) {
           localstarttime = value.startTime;
           localendtime   = value.endTime;
           
           if(starttime >= localstarttime&&starttime<=localendtime){
               flag = index + 1;
               return;
           }
           
           if(endtime >= localstarttime&&endtime<=localendtime){
               flag = index + 1;
               return;
           }
           
           if(localstarttime >= starttime&&localstarttime<=endtime){
               flag = index + 1;
               return;
           }
           
           if(localendtime >= starttime&&localendtime<=endtime){
               flag = index + 1;
               return;
           }
        }
    });
    return flag;
}


var divwidth=272;

var resizeRecordFileList = function(){
	if($('.recFilesListli').length > 0){
		var windowwidth=$("#recFilesList").width();
		//var marginleft=$('.recFilesListli').css("margin-left").substring(0,$('.recFilesListli').css("margin-left").indexOf('px'));
		var marginleft=0;
		//var marginright=$('.recFilesListli').css("margin-right").substring(0,$('.recFilesListli').css("margin-right").indexOf('px'));
		var marginright = 0;
		var divallwidth = parseInt(divwidth)+parseInt(marginleft)+parseInt(marginright);
		var multiple	= parseInt(windowwidth/divallwidth);
		var needwidth	= parseInt(windowwidth/multiple)-parseInt(marginleft)-parseInt(marginright);
		$('.recFilesListli').width(needwidth);
	}
}
var resizepvrScheduleList = function(){
	if($('.pvrScheduleListli').length > 0){	
		var windowwidth=$('#pvrScheduleList').width();
		//var marginleft=$('.pvrScheduleListli').css("margin-left").substring(0,$('.recFilesListli').css("margin-left").indexOf('px'));
		var marginleft = 0;
		//var marginright=$('.pvrScheduleListli').css("margin-right").substring(0,$('.recFilesListli').css("margin-right").indexOf('px'));
		var marginright = 0;
		var divallwidth = parseInt(divwidth)+parseInt(marginleft)+parseInt(marginright);
		var multiple	= parseInt(windowwidth/divallwidth);
		var needwidth	= parseInt(windowwidth/multiple)-parseInt(marginleft)-parseInt(marginright);
		$('.pvrScheduleListli').width(needwidth);
	}
}

var resizecatchUpTopicList = function(){
	if($('.catchUpTopicListLi').length > 0){	
		var windowwidth=$('#catchUpTopicList').width();
		//var marginleft=$('.pvrScheduleListli').css("margin-left").substring(0,$('.recFilesListli').css("margin-left").indexOf('px'));
		var marginleft = 0;
		//var marginright=$('.pvrScheduleListli').css("margin-right").substring(0,$('.recFilesListli').css("margin-right").indexOf('px'));
		var marginright = 0;
		var divallwidth	= parseInt(divwidth)+parseInt(marginleft)+parseInt(marginright);
		var multiple	= parseInt(windowwidth/divallwidth);
		var needwidth	= parseInt(windowwidth/multiple)-parseInt(marginleft)-parseInt(marginright);
		$('.catchUpTopicListLi').width(needwidth);
	}
}

$(window).resize(function(){
	resizepvrScheduleList();
	resizeRecordFileList();
	resizecatchUpTopicList();
});


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
		"S"  : this.getMilliseconds()  
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

