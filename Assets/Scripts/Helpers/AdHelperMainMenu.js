#pragma strict
import GoogleMobileAds;
import GoogleMobileAds.Api;

public var adUnitIDSmall : String;
public var adUnitIDIntersatial : String;
private enum  SizeOfAd{Banner, MediumRectangle, IABBanner, Leaderboard, SmartBanner};
public var sizeOfAd : SizeOfAd;

private var interstitial : InterstitialAd;
private var currentAd : AdSize;
private var button : GUITexture;
private var timer : float;
private var interstatialTimer : float = 45f;
private var bannerView : BannerView;
private var isShown : boolean = false;
private var isLoaded : boolean = false;

// Main Menu parts
public var mainMenu : GameObject;
public var options : GameObject;
public var zoneList : GameObject;
public var zone1 : GameObject;
public var zone2 : GameObject;
public var zone3 : GameObject;
public var zone4 : GameObject;
public var credits : GameObject;

function Awake () {
	SetCurrentAd ();
	// Create a 320x50 banner at the top of the screen.
	bannerView = new BannerView(adUnitIDSmall, currentAd, AdPosition.Top);
	// Create an empty ad request.
	var request : AdRequest = new AdRequest.Builder().Build();
	// Load the banner with the request.
	bannerView.LoadAd(request);
	button = this.gameObject.GetComponentInChildren.<GUITexture>();
	button.enabled = false;
	SetButtonScale();
	SetButtonPosition();
}


function FixedUpdate () {
	if (!isLoaded) bannerView.AdLoaded += LoadComplete;
	if (timer > 0f) timer -= Time.deltaTime;
	if (timer <= 0f && !isShown && isLoaded) Show();
	if (interstatialTimer >= 0f) interstatialTimer -= Time.deltaTime;
	if (interstatialTimer < 0f) StartInterstatial();
	if (interstitial != null && interstitial.IsLoaded()) interstitial.Show();
	ShownOnDifferentMenus ();
}

function GetAdSize() {
	var x : float = 0f;
	var y : float = 0f;
	var width : float = currentAd.Width;
	var height : float = currentAd.Height;
	var dpi : float = GetDPI();
	if (dpi == 0) dpi = 160f;
	width = width * (dpi / 160.0);
	height = height * (dpi / 160.0);	
	
	if (width > Screen.width) width = Screen.width;
	if (height > Screen.height)	height = Screen.height;

	x = (Screen.width / 2f) - (width / 2f);
	y = 0f;
	var adRect : Rect = Rect(x, y, width, height);
	return adRect;
}

function Hide () {
	timer = 15f;
	bannerView.Hide();
	button.enabled = false;
	isShown = false;
}

function Show () {
	bannerView.Show();
	button.enabled = true;
	isShown = true;
}

function SetButtonPosition () {
	var adSize : Rect = GetAdSize();
	guiTexture.pixelInset.x = Screen.width - adSize.x + 2f * guiTexture.texture.width * transform.localScale.x;
	guiTexture.pixelInset.y = Screen.height - (adSize.y + adSize.height + 2f * guiTexture.texture.height * transform.localScale.y);	
}

function SetButtonScale () {
	var adSize : Rect = GetAdSize();
	var sizeControl : SizeControlls = this.gameObject.GetComponent.<SizeControlls>();
	sizeControl.percentOfScreenHeight = (adSize.height * 0.4) / (Screen.height * 1.0);;
	sizeControl.SetScale();
}

function LoadComplete () {
	isLoaded = true;
	button.enabled = true;
}

function SetCurrentAd () {
	switch(sizeOfAd) {
		case SizeOfAd.Banner:
			currentAd = AdSize.Banner;
			break;
		case SizeOfAd.MediumRectangle:
			currentAd = AdSize.MediumRectangle;
			break;
		case SizeOfAd.IABBanner:
			currentAd = AdSize.IABBanner;
			break;
		case SizeOfAd.Leaderboard:
			currentAd = AdSize.Leaderboard;
			break;
		case SizeOfAd.SmartBanner:
			currentAd = AdSize.SmartBanner;
			break;
	}
}

function GetDPI() {
	var realDPI : float = Screen.dpi;
	var weightedDPI : float;
	if (realDPI >= 580) weightedDPI = 640f;
	else if (realDPI >= 400) weightedDPI = 480f;
	else if (realDPI >= 290) weightedDPI = 320f;
	else if (realDPI >= 220) weightedDPI = 240f;
	else if (realDPI >= 140) weightedDPI = 160f;
	else if (realDPI >= 80) weightedDPI = 120f;
	else weightedDPI = 0f;
	return weightedDPI;
}

function StartInterstatial () {
	interstatialTimer = 45f;
	// Initialize an InterstitialAd.
	interstitial = new InterstitialAd(adUnitIDIntersatial);
	// Create an empty ad request.
	var request : AdRequest = new AdRequest.Builder().Build();
	// Load the interstitial with the request.
	interstitial.LoadAd(request);
}

function ShownOnDifferentMenus () {
	if (!isShown && mainMenu.activeSelf && isLoaded && timer <= 0f) Show(); 
	if (!isShown && options.activeSelf && isLoaded && timer <= 0f) Show();
	if (isShown && zoneList.activeSelf) Hide();
	if (isShown && zone1.activeSelf) Hide();
	if (isShown && zone2.activeSelf) Hide();
	if (isShown && zone3.activeSelf) Hide();
	if (isShown && zone4.activeSelf) Hide();
	if (isShown && credits.activeSelf) Hide();	
}


function OnDestroy () {
	bannerView.Destroy();
}