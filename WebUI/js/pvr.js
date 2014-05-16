//全局
var headerHeight          = 0;
var recordFileEditStatus  = false;
var pvrScheduleObj        = new Array();
var channelList           = 0;
var recordFileItem        = '<li data-icon="false">                                                                        \
                    <a href="#" class="recordFileItem" data-transition="slide" data-path="hellow.ts">                      \
                        <div class="ui-body ui-body-a ui-corner-all" style="padding:8px 8px;" data-role="button" >         \
                            <span style="font-size:17px;"><i><b id="channelName_recFile">CH: Fox News</b></i></span><br /> \
                            <div class="recFileItemInfoDiv">                                                               \
                                <ul>                                                                                       \
                                    <li><span style="font-size:16px;" id="programme_recFile">England vs. France</span></li>\
                                    <li><span id="recTime_recFile">2014.7.5, 18:00 ~ 20:00</span></li>                     \
                                    <li><span id="fileInfo_recFile">3rd Game of Group A</span></li>                        \
                                </ul>                                                                                      \
                            </div>                                                                                         \
                        </div>                                                                                             \
                    </a>                                                                                                   \
                    <div class="pvrItemMaskDiv">                                                                           \
                        <div class="pvrItemCheckBox">                                                                      \
                        <a href="#" class="checkButton">                                                                   \
                            <div class="checkImgDiv">                                                                      \
                                <img src="./img/icon-check.png" data-isCheck="false"/>                                     \
                            </div>                                                                                         \
                        </a>                                                                                               \
                        </div>                                                                                             \
                    </div>                                                                                                 \
                </li>'

var pvrScheduleItem = '<li data-icon="false">                                                                              \
                    <a href="#recordItemPage" data-transition="slide" data-PVRIndex="">                                    \
                        <div class="ui-body ui-body-a ui-corner-all" style="padding:8px 8px;" data-role="button" >         \
                        <span style="font-size:17px;" id="channelName_pvrShedule"><i><b>CH: Fox News</b></i></span><br />  \
                            <div class="pvrItemContent">                                                                   \
                                <div class="pvrItemInfoDiv"><ul>                                                           \
                                    <li><span style="font-size:16px;" id="programme_pvrShedule">England</span></li>        \
                                    <li><span id="startTime_pvrShedule">2014.7.5, 18:00 ~ 20:00</span></li>                \
                                    <li><span id="endTime_pvrShedule">3rd Game of Group A</span></li></ul>                 \
                                </div>                                                                                     \
                                <div class="pvrItemImgDiv"><img src="./img/a_cherie25.png"/></div>                         \
                            </div>                                                                                         \
                        </div>                                                                                             \
                    </a>                                                                                                   \
                    <div class="pvrItemMaskDiv">                                                                           \
                        <div class="pvrItemCheckBox">                                                                      \
                        <a href="#" class="checkButton">                                                                   \
                            <div class="checkImgDiv">                                                                      \
                                <img src="./img/icon-check.png" data-isCheck="false"/>                                     \
                            </div>                                                                                         \
                        </a>                                                                                               \
                        </div>                                                                                             \
                    </div>                                                                                                 \
                </li>'


var browser = {
    versions:function(){
            var u = navigator.userAgent, app = navigator.appVersion;
            return {         //移动终端浏览器版本信息
                 trident: u.indexOf('Trident') > -1, //IE内核
                presto: u.indexOf('Presto') > -1, //opera内核
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
                iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1, //是否iPad
                webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
            };
         }(),
         language:(navigator.browserLanguage || navigator.language).toLowerCase()
};


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

    if(key == "PVRInit"){
        var recordFilesArray = temp.PVR;
        var recordFilesLabel = temp.PVRLabel;
            pvrScheduleArray = temp.PVRSchedule;
        var pvrScheduleLabel = temp.PVRScheduleLabel;
            channelList      = temp.ChannelList;

        $("#pvrScheduleLabel_PVR").text(pvrScheduleLabel);
        $("#recordFilesLabel_RecordFile").text(recordFilesLabel);

        initPVRShedule(pvrScheduleArray);
        initRecordFiles(recordFilesArray);
        initChannelList(channelList);

    } else if(key == "UpdateRemoteFileList") {
        var recordFilesArray = temp.PVR;
        
        initRecordFiles(recordFilesArray);
    }
}


/*=======================================public signal============================================*/
function playFile(filePath) {
    window.location = "native://PlayFile?" + filePath;
}

function deleteFile(filesArray) {
    window.location = "native://DeleteFile?" + filesArray;
}


/*=======================================Init function============================================*/
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
    
    recFilesList.listview('refresh');  
}

function initPVRShedule(data) {
    var pvrScheduleList = $("#pvrScheduleList");
    pvrScheduleList.children().remove();
    pvrScheduleList.empty();

    $.each(data, function(index,value) {
        var channelName    = value.ChannelName;
        var displayName    = value.DisplayName;
        var startTime      = value.StartYear + "-" + value.StartMonth + "-" + value.StartDay + " " + value.StartHour + ":" + value.StartMinute;
        var endTime        = value.EndYear + "-" + value.EndMonth + "-" + value.EndDay + " " + value.EndHour + ":" + value.EndMinute;
        var startTimeLabel = startTime.toLocaleString();
        var endTimeLabel   = endTime.toLocaleString();
        var sheduleItem    = $(pvrScheduleItem);

        sheduleItem.children("a").attr("data-PVRIndex", index);
        sheduleItem.find("#channelName_pvrShedule").text(channelName).attr("id", "channelName" + index + "_pvrShedule");
        sheduleItem.find("#programme_pvrShedule").html(displayName == "" ? "&nbsp" : displayName).attr("id", "programme" + index + "_pvrShedule");
        sheduleItem.find("#startTime_pvrShedule").text(startTime).attr("id", "startTime" + index + "_pvrShedule");
        sheduleItem.find("#endTime_pvrShedule").text(endTime).attr("id", "endTime" + index + "_pvrShedule");

        pvrScheduleObj[index] = value;
        pvrScheduleObj[index].startTime = startTime;
        pvrScheduleObj[index].endTime   = endTime;

        pvrScheduleList.append(sheduleItem);
    });
    
    pvrScheduleList.listview('refresh');
}

function initChannelList(data) {
    var channelList = $("#channelList");
    channelList.children().remove();
    pvrScheduleList.empty();
    
    $.each(data, function(index, value){
        channelList.append($('<li data-icon="false" class="channelItem" value="' + value + '">' + value + '</li>'));
    });

    channelList.listview('refresh');
}

/*=======================================private function============================================*/
function loadPVR(url) {
    // $.get("https://s3-eu-west-1.amazonaws.com/tvman/PVR+Schedule/1398311131021",function(data,status){
    //     alert("Data: " + data + "\nStatus: " + status);
    // });

// $.ajax({ url: "http://cdn.iknow.bdimg.com/static/common/lib/mod_4a8b07f.js", context: document.body, success: function(){
//         alert("sefsef"); 
//       }});

// $.ajax({
//     type: "GET",
//     cache: false,
//     url: 'http://cdn.iknow.bdimg.com/static/common/lib/mod_4a8b07f.js',
//     dataType: "text",
//     error: function(xhr, settings, exception){
//         alert('The update server could not be contacted.');
//     },
//     success: function(xml){
//         alert(xml);    
//         }
//     });
}

/*=======================================JQuery Binding============================================*/
 $(document).ready(function () {

    $("#delButton_PVR").click(function() {
        $("#pvrScheduleList li>div").fadeToggle(200);
    });

    $("#delButton_Record").click(function() {
        var recordFileItemList = $("#recFilesList li>div");

        if (recordFileEditStatus == false) {
            recordFileEditStatus = true;
            recordFileItemList.fadeIn(200);

        } else {
            recordFileEditStatus = false;
            recordFileItemList.fadeOut(200);

            recordFileItemList = recordFileItemList.find("img[data-isCheck=true]");
            var tempArray = new Array();
            $.each(recordFileItemList,function(index,temp){
                tempArray.push($(temp).parents("li").children("a").attr("data-path"));
            });
            deleteFile(tempArray);
        }
    }); 

    $("#pvrPage").on("swiperight",function(){
        $.mobile.changePage("#twitterPage",  { transition: "slide", reverse:true});
    });
    $("#pvrPage").on("swipeleft",function(){
        $.mobile.changePage("#recFilesPage",  { transition: "slide" });
    });

    $("#twitterPage").on("swipeleft",function(){
        $.mobile.changePage("#pvrPage",  { transition: "slide"});
    });


    $("#recFilesPage").on("swiperight",function(){
        $.mobile.changePage("#pvrPage",  { transition: "slide", reverse:true});
    });


    //初始化日期控件
    var formTime = {
        preset: 'datetime', //日期
        theme: 'android-ics', //皮肤样式
        display: 'modal', //显示方式 
        mode: 'Scroller', //日期选择模式
        dateFormat: 'yy-mm-dd', // 日期格式
        dateOrder: 'yymmdd', //面板中日期排列格式
        startYear:2012,
        endYear:2020,
        animate:"slideup"
    };

    var toTime = {
        preset: 'datetime', //日期
        theme: 'android-ics', //皮肤样式
        display: 'modal', //显示方式 
        mode: 'Scroller', //日期选择模式
        dateFormat: 'yy-mm-dd', // 日期格式
        dateOrder: 'yymmdd', //面板中日期排列格式
        startYear:2012,
        endYear:2020,
        animate:"slideup"
    };
    
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
        $("#channelName_recItemEdit").text(channelName);
    });

    $("body").on("click", ".recordFileItem", function() {
        playFile($(this).attr("data-path"));
    });

    $("body").on("click", "[href='#recordItemPage']", function() {

        var pvrScheduleItemObj = pvrScheduleObj[$(this).attr("data-PVRIndex")];

         $("#displayName_recItemEdit").val(pvrScheduleItemObj.DisplayName);
         $("#formTimeSelect").val(pvrScheduleItemObj.startTime);
         $("#toTimeSelect").val(pvrScheduleItemObj.endTime);
    });

    $("body").on("click", ".checkButton", function() {
        var imgCheck = $(this).find("img");
        imgCheck.toggle();
        if(imgCheck.css("display") == "none") {
            imgCheck.attr("data-isCheck", "false");
        } else {
            imgCheck.attr("data-isCheck", "true");
        }

    });


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

    iframe.contents().find(".e-entry-content a").click(function() {
        alert($(this).attr("title"));
        loadPVR($(this).attr("title"));
        return false;
    });
}
});
