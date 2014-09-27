#pragma strict
import System.Collections.Generic;
import System.Linq;

//function Start () {
//	LevelDetection ();
//}

function OnEnable () {
	LevelDetection ();
}

function LevelDetection () {
	var levels : List.<MenuButtons> = this.GetComponentsInChildren.<MenuButtons>().OrderBy(function(a){return a.name;}).ToList();
	for (var level : MenuButtons in levels) {
		if (PlayerPrefs.HasKey(level.name) && PlayerPrefs.GetInt(level.name) == 1) {
			if (level.name.Contains("Level")) {
					level.GetComponent.<ControllerGUIButton>().functionOnTouchDown = "LoadLevel";
					level.levelToLoad = level.name;
				}
		} else if (level.gameObject.name.Contains("Video")) {
			var videoIndex = level.gameObject.name[-2:][1];
			var lastLevel = "Level_" + level.gameObject.name[-2:][0] + "9";
			if (videoIndex == "2" && !(PlayerPrefs.HasKey(lastLevel) && PlayerPrefs.GetInt(lastLevel) == 1)) {
				level.GetComponent.<ControllerGUIButton>().SetInactive(false);
			}
		
		} else if (level.gameObject.name.Contains("Bonus")) {
			var currentZone = level.gameObject.name[-1:];
			var totalStarNumber : int = Options.NumberOfStarsInZone(currentZone.ToString());
			if (totalStarNumber < 30) level.GetComponent.<ControllerGUIButton>().SetInactive(false);
		} else {
			level.GetComponent.<ControllerGUIButton>().SetInactive(false);
		}
	}
}