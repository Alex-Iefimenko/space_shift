#pragma strict

// Twitter credentials
static private var twitterURL : String = "http://twitter.com/intent/tweet";


// Facebook credentials
static private var facebookURL : String = "https://www.facebook.com/dialog/feed";
static private var fbAppId : String = "1494367707480840";
static private var fbPictureLink : String = "https://fbcdn-sphotos-g-a.akamaihd.net/hphotos-ak-xpa1/v/t1.0-9/p75x225/1620638_721777074538040_8907078418473211792_n.jpg?oh=ffd4ad8403b634327e9239f41c39622d&oe=54AB1B17&__gda__=1421149944_54ec133c22766af648a5aeebf58d295d";

static private var appGroupLink : String = "https://www.facebook.com/groups/581962205249172/";


static function ShareFacebook() {

	Application.OpenURL(facebookURL +
		"?app_id=" + fbAppId + 
        "&link=" + WWW.EscapeURL(appGroupLink)+ 
        //"&picture=" + WWW.EscapeURL(fbPictureLink) + 
        "&name=" + WWW.EscapeURL("SpaceShift") + 
        "&caption=" + WWW.EscapeURL("Coolest of coolest!") + 
        "&description=" + WWW.EscapeURL("Coolest of coolest!") + 
        "&redirect_uri=" + WWW.EscapeURL("http://www.facebook.com/"));
}

static function ShareTwitter (text : String, url : String, relatedAcc : String) {
    Application.OpenURL(twitterURL + 
        "?text=" + WWW.EscapeURL(text) + 
        "&url=" + WWW.EscapeURL(url) + 
        "&related=" + WWW.EscapeURL(relatedAcc) + 
        "&lang=en");
}
