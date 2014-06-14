#pragma strict

enum ButtonActionType { Continue, RestartLevel, MainMenu}

public var buttonAction : ButtonActionType = ButtonActionType.Continue;

public var pauseHendler : GameObject;

function OnMouseDown () {
	switch (buttonAction) {
		case ButtonActionType.RestartLevel:
			LevelRestart();
			break;
		case ButtonActionType.Continue:
			Continue();
			break;
		case ButtonActionType.MainMenu:
			ToMainMenu();
			break;
		default:
			break;
	}
}

function LevelRestart () {
	Application.LoadLevel(Application.loadedLevelName);
	Time.timeScale = 1.0;
}

function Continue () {
	if (pauseHendler !=null) {
		pauseHendler.SendMessage("ButtonClick");
	}
}

function ToMainMenu () {

}