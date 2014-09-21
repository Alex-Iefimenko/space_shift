#pragma strict

function Awake () {
	// Load options if thex existed previously
	if (PlayerPrefs.HasKey("Music")) {
		Options.LoadOptions();
	} else {
		Options.SaveOptions();
	}
	Options.ApplyOptions();
	print (Options.graphics);
	print (QualitySettings.GetQualityLevel());
	// Detect current game progress
	if (PlayerPrefs.HasKey("Level_10") == false) {
		PlayerPrefs.SetInt("Level_10", 1);
		PlayerPrefs.SetInt("Zone_1", 1);
	} 
}

function Update () {
    /*
    var bomb : boolean = Input.GetButtonDown("Bomb");
    if (bomb) { 
    	//Application.LoadLevel("Level_10"); 
    	//Options.MusicOn(false);
    	Application.LoadLevel("Level_10");
    }
    */
}

function OnDestroy () {
	Options.SaveOptions();
}