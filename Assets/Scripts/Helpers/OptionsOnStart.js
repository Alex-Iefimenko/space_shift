#pragma strict

function Awake () {
	// Load options if thex existed previously
	if (PlayerPrefs.HasKey("Music")) {
		Options.LoadOptions();
	} else {
		Options.SaveOptions();
	}
	Options.ApplyOptions();
	// Detect current game progress
	if (PlayerPrefs.HasKey("Video_11") == false) {
		PlayerPrefs.SetInt("Video_11", 1);
		PlayerPrefs.SetInt("Zone_1", 1);
	} 
}

function Update () {
    if (Input.GetKeyDown("escape")) {
    	Return();
	}
}

function OnDestroy () {
	Options.SaveOptions();
}

function Return () {
	var buttons : Component[];
	buttons = GetComponentsInChildren.<MenuButtons>();
	for (var button : MenuButtons in buttons) {
		if (button.gameObject.name == "Return") button.DisplayGuiSet();
	}
}