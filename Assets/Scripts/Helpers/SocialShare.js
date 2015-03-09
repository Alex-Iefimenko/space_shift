#pragma strict

// Twitter credentials
static private var twitterURL : String = "http://twitter.com/intent/tweet";


// Facebook credentials
static private var facebookURL : String = "https://www.facebook.com/dialog/feed";
static private var fbAppId : String = "1494367707480840";
static private var fbPictureLink : String = "https://static1.squarespace.com/static/50d6e96ae4b0af22418d55b4/t/54f19c8be4b01184f2b0658d/1425120400719/?format=1000w&storage=local";
// Link to appstore
static private var appGroupLink : String = "https://play.google.com/store/apps/details?id=com.BEARDYBIRD.SPACESHIFT";


static function ShareFacebook(caption : String, description : String) {

	Application.OpenURL(facebookURL +
		"?app_id=" + fbAppId + 
        "&link=" + WWW.EscapeURL(appGroupLink)+ 
        "&picture=" + WWW.EscapeURL(fbPictureLink) + 
        "&name=" + WWW.EscapeURL("Space Shift") + 
        "&caption=" + WWW.EscapeURL(caption) + 
        "&description=" + WWW.EscapeURL(description) + 
        "&redirect_uri=" + WWW.EscapeURL("http://www.facebook.com/"));
}

static function ShareTwitter (text : String, relatedAcc : String) {
    Application.OpenURL(twitterURL + 
        "?text=" + WWW.EscapeURL(text) + 
        "&url=" + WWW.EscapeURL(appGroupLink) + 
        "&related=" + WWW.EscapeURL(relatedAcc) + 
        "&lang=en");
}
