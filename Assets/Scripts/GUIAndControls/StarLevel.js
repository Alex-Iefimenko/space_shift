#pragma strict

import System.Collections.Generic;
import System.Linq;

function OnEnable () {
	StarNumberCount();
}

function StarNumberCount () {
	
	var levelName : String = this.transform.parent.gameObject.name;
	if (!PlayerPrefs.HasKey(levelName) && PlayerPrefs.GetInt(levelName) == 0) {
		var currentLevel : GameObject = this.transform.parent.gameObject;
		var allStars : List.<Transform> = currentLevel.GetComponentsInChildren.<Transform>().ToList();
		allStars.Remove(currentLevel.transform);
		for (star in allStars) {
			star.gameObject.SetActive(false);
		}
	} else {
		var isLevelOpened : boolean = PlayerPrefs.HasKey(levelName) && PlayerPrefs.GetInt(levelName) == 1;
		var stars : List.<Transform> = this.GetComponentsInChildren.<Transform>().OrderBy(function(a){return a.name;}).ToList();
		stars.RemoveAt(3);
		var starsReceived = PlayerPrefs.GetInt("Stars" + levelName);
		
		for (star in stars) {
			if (starsReceived <= 0) star.gameObject.SetActive(false);
			starsReceived--;
		}
	}
}