var browser = {
    versions:function(){
		var u = navigator.userAgent,
			app = navigator.appVersion;
            return {         //the WebView info
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android || linux
            };
         }(),
         language:(navigator.browserLanguage || navigator.language).toLowerCase()
};

function decToHex4Char(dec) {
	var result	 = "";
	var temp 	 = dec.toString(16);
	var length 	 = temp.length;
	var nextChar = "";
	var index 	 = 3;
	
	for (index = 3; index >= 0; index--) {
		if (3 - index <= length - 1) {
			nextChar = temp.charAt(length - 1 - (3 - index));
			var reg  = /^[A-Za-z]+$/;
			if (reg.test(nextChar)) {
				nextChar = nextChar.toUpperCase();
			}
		}else {
			nextChar = "0";
		}
		result = nextChar + result;
	}
	return result;
}

function getChannelIconKey(networkid, tsid, serviceid) {
	var result = "";
	result = decToHex4Char(networkid) + decToHex4Char(tsid) + decToHex4Char(serviceid);
	return result;
}

var channelLogoXml = "";

$.ajax({  
	type:'GET',  
	url:'channel_logo.xml',  
	dataType:'xml', 
	success:function(docxml){
		channelLogoXml = docxml;
	}
});


function getIconNameFromKey(iconKey) {
	var iconName = "";

    $(channelLogoXml).find('entry').each(function(){  
        var key  = $(this).attr('key');
        var name = $(this).attr('name');
        if(iconKey == key) {
        	iconName = name;
        }
    });
    return iconName;
}

