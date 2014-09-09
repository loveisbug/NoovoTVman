function clearSelected() {
	$("#LiveTVButton").removeClass("ui-icon-custom-nav-liveTV-selected");
	$("#EPGButton").removeClass("ui-icon-custom-nav-epg-selected");
	$("#PVRButton").removeClass("ui-icon-custom-nav-pvr-selected");
	$("#SettingButton").removeClass("ui-icon-custom-nav-setting-selected");

	$("#LiveTVButton").addClass("ui-icon-custom-nav-liveTV");
	$("#EPGButton").addClass("ui-icon-custom-nav-epg");
	$("#PVRButton").addClass("ui-icon-custom-nav-pvr");
	$("#SettingButton").addClass("ui-icon-custom-nav-setting");
}

var loadProcess = 0;
function check() {
	if(loadProcess == 3) {
		window.location = "liveTV.html";
	}
}

$.ajax({  
    url:"liveTV.html",     
    success:function(data){   
        loadProcess++;
        check();
    },  
    error:function(){  
        alert("过账失败");  
    }  
});
$.ajax({  
    url:"PVR.html",     
    success:function(data){   
        loadProcess++; 
        check();
    },  
    error:function(){  
        alert("过账失败");  
    }  
});

$.ajax({  
    url:"setting.html",     
    success:function(data){   
        loadProcess++; 
        check();
    },  
    error:function(){  
        alert("过账失败");  
    }  
});

$(document).on("pageshow","[data-role=page]",function(event, ui){
	$("#" + event.target.id).find("[data-role=footer]").load("footer.html", function(){
    	$("#" + event.target.id).find("[data-role=navbar]").navbar();
    });
});

$(document).ready(function () {
	$("#nav").listview('refresh');
	$(".tabItem").click(function() {
		clearSelected();
		var tabIndex = $(this).parent().index();
		switch(tabIndex) {
			case 0:
			$("#LiveTVButton").addClass("ui-icon-custom-nav-liveTV-selected");
			break;
			case 1:
			$("#EPGButton").addClass("ui-icon-custom-nav-epg-selected");
			break;
			case 2:
			$("#PVRButton").addClass("ui-icon-custom-nav-pvr-selected");
			break;
			case 3:
			$("#SettingButton").addClass("ui-icon-custom-nav-setting-selected");
			break;
			default:
		}
	});
});