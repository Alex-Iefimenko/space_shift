#pragma strict

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
	pauseHendler.SetActive(true); 
	this.transform.parent.gameObject.SetActive(false);
}