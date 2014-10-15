#pragma strict

private var adMobPlugin : AdMobPlugin;

function Start () {
	adMobPlugin = this.gameObject.GetComponent.<AdMobPlugin>();
}

function OnGUI () {
	GetAdSize ();
}

function GetAdSize () {
	var x : float = 0f;
	var y : float = 0f;
	var width : float = 0f;
	var height : float = 0f;
	
	switch(adMobPlugin.size) {
			case AdSize.BANNER:
				width	= 320;
				height	= 50;
				break;
			case AdSize.IAB_BANNER:
				width	= 300;
				height	= 250;
				break;
			case AdSize.IAB_LEADERBOARD:
				width	= 486;
				height	= 60;
				break;
			case AdSize.IAB_MRECT:
				width	= 728;
				height	= 90;
				break;
			case AdSize.SMART_BANNER:
				width	= Screen.width;
				height	= width / 6.4f;
				break;
	}
	if (width > Screen.width){
		width = Screen.width;
	}
	if (height > Screen.height){
		height = Screen.height;
	}
	switch(adMobPlugin.horizontalPosition){
		case AdHorizontalPosition.CENTER_HORIZONTAL:
			x = (Screen.width / 2) - (width / 2);
			break;
		case AdHorizontalPosition.LEFT:
			x = 0;
			break;
		case AdHorizontalPosition.RIGHT:
			x = Screen.width - width;
			break;
	}
	switch(adMobPlugin.verticalPosition){
		case AdVerticalPosition.CENTER_VERTICAL:
			y = (Screen.height / 2) - (height / 2);
			break;
		case AdVerticalPosition.TOP:
			y = 0;
			break;
		case AdVerticalPosition.BOTTOM:
			y = Screen.height - height;
			break;
	}
	var backgroundRect : Rect = Rect(x, y, width, height);
}