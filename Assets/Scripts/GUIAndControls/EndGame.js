#pragma strict

public var player : GameObject;
public var lastEnemy : GameObject;
public var gameOverGui : GameObject;
public var gameWinGui : GameObject;
public var ingameGui : GameObject;
//public var 
function Start () {

}

function Update () {
	if (player == null) {
		GameEnd(false);
	} else if (lastEnemy == null) {
		GameEnd(true);
	}
}

function GameEnd (isWin : boolean) {
	yield WaitForSeconds (3.0);
	Time.timeScale = 1.0;
	Camera.main.GetComponent(Blur).enabled = true; // Blur aplied
	Camera.main.GetComponent(Vignetting).enabled = true; // Vignetting aplied
	ingameGui.SetActive(false);
	if (isWin) {
		gameWinGui.SetActive(true);
	} else {
		gameOverGui.SetActive(true);
	}
}
