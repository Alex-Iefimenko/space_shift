#pragma strict
import GoogleMobileAds;
import GoogleMobileAds.Api;

public var adUnitIDIntersatial : String;
private var interstitial : InterstitialAd;
private var isShown : boolean = true;

function Awake () {
	// Initialize an InterstitialAd.
	interstitial = new InterstitialAd(adUnitIDIntersatial);
	// Create an empty ad request.
	var request : AdRequest = new AdRequest.Builder().Build();
	// Load the interstitial with the request.
	interstitial.LoadAd(request);
}

function Update () {
	if (interstitial != null && interstitial.IsLoaded() && isShown && Options.InterstatialShow()) {
		interstitial.Show(); 
		isShown = false;
	}
}
