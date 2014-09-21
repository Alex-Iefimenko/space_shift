#pragma strict
import System.Collections.Generic;
import System.Linq;

function Start () {
	var levels : List.<MenuButtons> = this.GetComponentsInChildren.<MenuButtons>().OrderBy(function(a){return a.name;}).ToList();
	for (var level : MenuButtons in levels) {
		if (PlayerPrefs.HasKey(level.name) && PlayerPrefs.GetInt(level.name) == 1) {
			if (level.name.Contains("Level")) {
					level.GetComponent.<ControllerGUIButton>().functionOnTouchDown = "LoadLevel";
					level.levelToLoad = level.name;
				}
		} else {
			level.GetComponent.<ControllerGUIButton>().SetInactive(false);
		}
	}
}