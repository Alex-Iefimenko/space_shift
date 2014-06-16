#pragma strict

//enum ButtonActionType { Continue, RestartLevel, MainMenu, LoadLevel}
//public var buttonAction : ButtonActionType = ButtonActionType.Continue;

public var pauseHendler : GameObject;

public var levelToLoad : String;
private var i : float = 0.0;

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
		Application.LoadLevel(levelToLoad);
		Time.timeScale = 1.0;
	}
}

