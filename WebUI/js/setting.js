//Hotspot
var passwordPlaceHolder = "Password";
var passwordInvalidMsg  = "8~63 characters, Only A~Z,a~z,0-9 allowed.";		
var ssidListLoaded 		= false;


/*=======================================Init function============================================*/
function init() {
	window.location = "native://SettingInit";
}


/*=======================================public slot============================================*/
function onDataWithJSON(data,key) {	
	var temp;
	if(browser.versions.android) {
 		temp = eval( "(" + data + ")" );
	} else {
		temp = data;
	}
	
	if(key == "SettingInit"){
		if(key == "SettingInit"){
			$.mobile.changePage("#settingPage",  { transition: "none"});
		}
		
		var aboutObj   = temp.About;
		var wlanObj    = temp.WLAN;
		var hotspotObj = temp.HotSpot; 

		$("#settingLabel_Setting").text(temp.Setting);
		
		initWLAN(wlanObj);
		initHotspot(hotspotObj);
		initAbout(aboutObj);
	}
}


/*=======================================Init function============================================*/
function initWLAN(data) {
	var wlanLabel       = data.WLAN;
	var connectLabel    = data.Join;
	var ssidLabel       = data.SSID;
	var passwordLabel   = data.Password;
	var ssidTable       = data.ssidTable;
	var rebootTips      = data.SettingHint;
	var ssidNoEmptyTips = data.SsidNotEmptyMsg

	$("#wlanLabel_Setting").text(wlanLabel);
	$("#wlanLabel_connectToWlan").text(wlanLabel);

	$("#connectToWLANButton").val(connectLabel);
	$("#SSIDHeader_Wlan").html(ssidLabel);
	$("#ssid_WLAN").attr("placeholder",ssidLabel);
	$("#passwd_WLAN").attr("placeholder", passwordLabel);
	$("#ssidNoEmptyPopupDialog_WLAN p").text(ssidNoEmptyTips);
	$("#rebootPopupDialog_WIFI p").text(rebootTips);
	$("#rebootPopupDialog_WLAN p").text(rebootTips);
	
	if(!ssidListLoaded){
		var ssidList = $("#ssidList");
	
		ssidList.children("li").remove();
		ssidList.empty();

		$.each(ssidTable,function(index,value){
			ssidList.append($('<li data-icon="false" class="ssidItem" value="' + value + '">' + value + '</li>'));
		});
	
		if (ssidList.children().length <= 0) {
			$("#search_connectToWlan").hide();
			$("#ssid_WLAN").parent().css("marginRight", "0px");
		}
		ssidListLoaded = true;
	}

	//ssidList.listview('refresh');
}

function initHotspot(data) {
	var hotspotLabel        = data.HotSpot;
	var wifiChannelLabel    = data.WiFiChannel;
	var secretModeLabel     = data.SecureModeLabel;
	var applyLabel          = data.Apply;
	var secureMode          = data.SecureMode;
	var wiFiChannelValue    = data.WiFiChannelValue;
		passwordPlaceHolder = data.Password;
	    passwordInvalidMsg  = data.PasswordInvalidMsg;  //global

	$("#hotspotLabel_Setting").html(hotspotLabel);
	$("#hotspotLabel_Hotspot").html(hotspotLabel);
	$("#ChannelLabel_Hotspot").html(wifiChannelLabel);
	$("#SecretModeLabel_Hotspot").html(secretModeLabel);

	$("#ChannelLabel_WifiChannel").html(wifiChannelLabel);
	$("#SecretModeLabel_WifiSecret").html(secretModeLabel);
	$("#applyButton").val(applyLabel);

	$("#popupDialog_WIFI p").text(passwordInvalidMsg);

	setWiFiChannel(wiFiChannelValue);
	setWifiSecretMode(secureMode);
}

function initAbout(data) {
	var about          = data.About;
	var versionLabel   = data.Version;
	var version        = data.VersionValue;
	var deviceLabel    = data.Device;
	var device         = data.DeviceValue;
	var ssidLabel      = data.SSID;
	var ssid           = data.SSIDValue;
	var availableLabel = data.Available;
	var available      = data.AvailableValue;
	var totalLabel     = data.Total;
	var total          = data.TotalValue;
	
	$("#aboutLabel_Setting").text(about);
	$("#about").html(about);
	$("#versionLabel").html(versionLabel);
	$("#version").html(version);
	$("#deviceLabel").html(deviceLabel);
	$("#device").html(device);
	$("#ssidLabel").html(ssidLabel);
	$("#ssid").html(ssid);
	$("#availableLabel").html(availableLabel);
	$("#available").html(available);
	$("#totalLabel").html(totalLabel);
	$("#total").html(total);
}


/*=======================================public signal============================================*/
function setWlan() {
	var ssid = $("#ssid_WLAN").val();
	var pwd  = $("#passwd_WLAN").val();

	window.location = "native://SetWLAN?" + ssid +  "&" + pwd;
}

function setHotspot() {
	var temp        = $("#password_Hotspot").val();
	var pwd         = temp == undefined ? "" : temp;
	var secMode     = $("#currentWifiSecret").text() == "NONE" ? 0 : 1;
	var wifiChannel = $("#currentWifiChannel").text().split(" ")[1];

	window.location = "native://SetHotspot?" + secMode + "&" + pwd + "&" + wifiChannel;
}


/*=======================================private function============================================*/
function setWiFiChannel(channelValue) {
	var preCheck = $("#wifiChannelList").find("[data-icon=check]");
	preCheck.attr("data-icon", "false");
	preCheck.removeClass("ui-btn-icon-right ui-icon-custom-check");

	var tempStr     = "CH " + channelValue;
	var channelItem = $("#wifiChannelList li:contains(" + tempStr + ")").first();

	channelItem.attr("data-icon", "check");
	channelItem.addClass("ui-btn-icon-right ui-icon-custom-check");
	$("#currentWifiChannel").text(channelItem.html());
}

function setWifiSecretMode(secretMode) {
	var preCheck = $("#wifiSecretList").find("[data-icon=check]");
	preCheck.attr("data-icon", "false");
	preCheck.removeClass("ui-btn-icon-right ui-icon-custom-check");

	var tempStr    = secretMode == 0 ? "NONE" : "WPA";
	var secretItem = $("#wifiSecretList li:contains(" + tempStr + ")");

	secretItem.attr("data-icon", "check");
	secretItem.addClass("ui-btn-icon-right ui-icon-custom-check");
	$("#currentWifiSecret").html(secretItem.html());
}

function setWLanSSID(ssid) {
	var preCheck = $("#ssidList").find("[data-icon=check]");
	preCheck.attr("data-icon", "false");
	preCheck.removeClass("ui-btn-icon-right ui-icon-check");

	var currentSSIDItem = $("#ssidList").find("[value='" + ssid + "']");
	if (currentSSIDItem.length > 0) {
		currentSSIDItem.attr("data-icon", "check");
		currentSSIDItem.addClass("ui-btn-icon-right ui-icon-custom-check");
	}
}

function isValidWifiPassword(password) {
	var reg = new RegExp("^[a-z,A-Z,0-9]{8,63}$");
	if(!reg.test(password)){     
		return false;
    }
	return true;
}

/*=======================================JQuery Binding============================================*/
$(function() {
	$("body").on("click", ".ssidItem", function() {
		var ssidValue = $(this).text();

		var preCheck = $("#ssidList").find("[data-icon=check]");
		preCheck.attr("data-icon", "false");
		preCheck.removeClass("ui-btn-icon-right ui-icon-custom-check");

		$(this).attr("data-icon", "check");
		$(this).addClass("ui-btn-icon-right ui-icon-custom-check");
		$("#ssid_WLAN").val(ssidValue);

	});
});


$(document).ready(function() {

	$("#ssid_WLAN").blur(function() {
		var ssidValue = $(this).val();
		setWLanSSID(ssidValue);
	});

	$("#connectToWLANButton").click( function() {
		var ssid = $("#ssid_WLAN").val();
		if (ssid == "") {
			$("#popupDialog_WLAN").popup("open", {transition:"pop"});
			return;
		}

		setWlan();
	});

	$("#applyButton").click( function() {
		var isSecret = $("#password_Hotspot").length;

		if (isSecret) {
			var pwd = $("#password_Hotspot").val();

			if (!isValidWifiPassword(pwd)) {
				$("#popupDialog_WIFI").popup("open", {transition:"pop"});
				return;
			}
		}

		setHotspot();
	});

	$("#wifiChannelList li").click(function() {
		var preCheck = $("#wifiChannelList").find("[data-icon=check]");
		preCheck.attr("data-icon", "false");
		preCheck.removeClass("ui-btn-icon-right ui-icon-custom-check");

		$(this).attr("data-icon", "check");
		$(this).addClass("ui-btn-icon-right ui-icon-custom-check");
		$("#currentWifiChannel").html($(this).html());
	});

	$("#wifiSecretList li").click(function() {
		var preCheck = $("#wifiSecretList").find("[data-icon=check]");
		preCheck.attr("data-icon", "false");
		preCheck.removeClass("ui-btn-icon-right ui-icon-custom-check");

		$(this).attr("data-icon", "check");
		$(this).addClass("ui-btn-icon-right ui-icon-custom-check");
		$("#currentWifiSecret").html($(this).html());

		if($(this).html() == "WPA") {
			if($("#passwordItem_Hotspot").length <= 0) {
				var passwordItem = $('<li id="passwordItem_Hotspot" class="ui-last-child"><div class="ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset"><input type="password" \
					placeholder="' + passwordPlaceHolder + '" id="password_Hotspot"></div><p id="passwordInvalidMsg">' + passwordInvalidMsg +'</p></li>');
				passwordItem.appendTo('#hotspotList');
			}
		} else {
			var preCheck = $("#passwordItem_Hotspot").remove();
		};
		$('#hotspotList').listview('refresh');
	});

});
