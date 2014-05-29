var browser = {
    versions:function(){
            var u = navigator.userAgent, app = navigator.appVersion;
            return {         //the WebView info
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android || linux
            };
         }(),
         language:(navigator.browserLanguage || navigator.language).toLowerCase()
};