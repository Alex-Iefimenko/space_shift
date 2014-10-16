﻿#pragma strict

//enum ButtonActionType { Continue, RestartLevel, MainMenu, LoadLevel}
//public var buttonAction : ButtonActionType = ButtonActionType.Continue;

public var pauseHendler : GameObject;

public var levelToLoad : String;
private var i : float = 0.0;

private var tutorialGUI : GameObject;
private var gui : GameObject; 

function Update () {
	if (tutorialGUI && Input.GetKeyDown("escape")) {
		Proceed();
	}
}

function LevelRestart () {
	Application.LoadLevel(Application.loadedLevelName);
	Time.timeScale = 1.0;
}

function Continue () {
	if (pauseHendler !=null) {
		Time.timeScale = 1.0;
		yield WaitForSeconds (0.1);
		pauseHendler.SendMessage("ButtonClick");
	}
}

function ToMainMenu () {
	Application.LoadLevel("MainMenu");
	Time.timeScale = 1.0;
}

function LoadLevel() {
	if (levelToLoad != null) {
		Time.timeScale = 1.0;
		Application.LoadLevel(levelToLoad);
		
	}
}

function Proceed () {
	Time.timeScale = 1.0;
	yield WaitForSeconds (0.1);
	Camera.main.GetComponent(Blur).enabled = false;
	Camera.main.GetComponent(Vignetting).enabled = false;
	gui.SetActive(true); 
	tutorialGUI.SetActive(false);
}

function SetTutorialVars (tutorial : GameObject, fullGUI : GameObject) {
	tutorialGUI = tutorial;
	gui = fullGUI;
}

function LoadNextLevel () {
	var nextLevel : int = int.Parse(Application.loadedLevelName[-2:]) + 1;
	var nextLevelName : String = "Level_" + nextLevel.ToString();
	Application.LoadLevel(nextLevelName);
}

function DisplayGuiSet () {
	yield WaitForSeconds (0.1);
	var curentGUI : GameObject = this.gameObject;
	while (curentGUI.name != "GUIMainMenu") {
		curentGUI = curentGUI.transform.parent.gameObject;
	}
	curentGUI.GetComponentsInChildren.<Transform>()[1].gameObject.SetActive(false);
	pauseHendler.SetActive(true); 
}

function ShareFBMain () {
	yield WaitForSeconds (0.1);
	var caption : String = "They are came for easy target! Not on my watch!";
	var description : String = "Hurricane shooter! 101% awesome experience! Hundreds of other praise shouts!";
	SocialShare.ShareFacebook(caption, description);
}

function ShareTwitterMain () {
	yield WaitForSeconds (0.1);
	var text : String = "Space Shift\n" + "They are came for easy target! Not on my watch!" + "\n" + "101% awesome experience!";
	var relatedAcc : String = "@SpaceShift";
	SocialShare.ShareTwitter(text, relatedAcc);
}

function ShareFBScore () {
	var score : int = this.gameObject.GetComponentInParent.<EndGame>().gameScore.GetScore();
	var level : String = (int.Parse(Application.loadedLevelName[-1:]) + 1).ToString();
	var zone : char = Application.loadedLevelName[-2:][0];
	var caption : String = "Who is your daddy?!";
	var description : String = "I've just finished Level " + level + " of Zone " + zone + " with score " + score.ToString() + ". Dare to challenge me?!";
	SocialShare.ShareFacebook(caption, description);
}

function ShareTwitterScore () {
	var score : int = this.gameObject.GetComponentInParent.<EndGame>().gameScore.GetScore();
	var level : String = (int.Parse(Application.loadedLevelName[-1:]) + 1).ToString();
	var zone : char = Application.loadedLevelName[-2:][0];
	var description : String = "I've just finished Level " + level + " of Zone " + zone + " with score " + score.ToString() + ". Dare to challenge me?!";
	var text : String = "Who is your daddy?!" + "\n" + description;
	var relatedAcc : String = "@SpaceShift";
	SocialShare.ShareTwitter(text, relatedAcc);
}