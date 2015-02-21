#pragma strict
import System.Collections.Generic;

public var manualControl : GameObject;
private var animators : List.<Animator>;
private var timeFromStart : float = 0f;
private var currentSlide : int = 0;
private var isManual : boolean = false;

function Start () {
	animators = this.GetComponentsInChildren.<Animator>().ToList();
	for (var i : Animator in animators) {
		i.gameObject.SetActive(false);
	}
	animators[0].gameObject.SetActive(true);
	manualControl.SetActive(false);
}

function Update () {
	if (!isManual && animators[currentSlide].GetCurrentAnimationClipState(0).Length > 0 && timeFromStart > animators[currentSlide].GetCurrentAnimationClipState(0)[0].clip.length) {
		currentSlide += 1;
		animators[currentSlide].gameObject.SetActive(true);
		timeFromStart = 0f;
	}
	
	if (!isManual) timeFromStart += Time.deltaTime;
	if (!isManual && (currentSlide == animators.Count() - 1 || Input.GetMouseButtonDown(0))) { 
		isManual = true;
		manualControl.SetActive(true);
	}
}

function SlideForward () {
	if (currentSlide == animators.Count() - 1) {
		var nextLevelName : String;
		if (Application.loadedLevelName[-2:][1] == "1") {
			nextLevelName = "Level_" + Application.loadedLevelName[-2:][0] + "0";
		} else if (Application.loadedLevelName[-2:][1] == "2") {
			nextLevelName = "Level_" + (parseInt(Application.loadedLevelName[-2:][0])- 48).ToString() + "9";
			print (nextLevelName);
		}
		// Level Progress save
		if (PlayerPrefs.HasKey(nextLevelName) == false) {
			PlayerPrefs.SetInt(nextLevelName, 1);
			PlayerPrefs.SetInt("Zone_" + nextLevelName[-2:][0], 1);
			PlayerPrefs.Save();
		} 
		Application.LoadLevel(nextLevelName);
	} else {
		currentSlide += 1;
		animators[currentSlide].gameObject.SetActive(true);		
	}
}

function SlideBackward () {
	if (currentSlide > 0) {
		animators[currentSlide].gameObject.SetActive(false);
		currentSlide -= 1;
	}
}