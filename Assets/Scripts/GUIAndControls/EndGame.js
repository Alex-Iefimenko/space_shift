#pragma strict
import System.Collections.Generic;
import System.Linq;

public var player : GameObject;
public var lastEnemy : GameObject;
public var gameOverGui : GameObject;
public var gameWinGui : GameObject;
public var ingameGui : GameObject;
public var gameScore : Score;
private var scoreCounters : List.<GUIText>;
private var currentScore : int = 0;

private var gameEnd : boolean = false;

function Start () {
}

function Update () {
	if (gameEnd == false) {
		if (player == null) {
			GameEnd(false);
		} else if (lastEnemy == null) {
			GameEnd(true);
		}
	}
	if (scoreCounters != null && scoreCounters.Count > 0) {
		for (i in scoreCounters) {
			if (currentScore + 20 < gameScore.GetScore()) { currentScore += 20; }
			if (currentScore + 1 <= gameScore.GetScore()) { currentScore += 1; }
			i.text = "0" * (5 - currentScore.ToString().length) + currentScore.ToString();;
		}
	}
}

function GameEnd (isWin : boolean) {
	gameEnd = true;
	yield WaitForSeconds (3.0);
	Time.timeScale = 1.0;
	Camera.main.GetComponent(Blur).enabled = true; // Blur aplied
	Camera.main.GetComponent(Vignetting).enabled = true; // Vignetting aplied
	ingameGui.SetActive(false);
	if (isWin) {
		gameWinGui.SetActive(true);
		StarActivation();
	} else {
		gameOverGui.SetActive(true);
	}
	scoreCounters = gameObject.GetComponentsInChildren.<GUIText>().ToList();	
}

function StarActivation () {
	var stars : List.<Animator> = gameObject.GetComponentsInChildren.<Animator>().OrderBy(function(a){return a.name;}).ToList();
	if ( gameScore.GetScore() * 1.0 / gameScore.GetTotalScore() * 1.0 <= 0.7 && stars[1]) { stars[1].gameObject.SetActive(false); }
	if ( gameScore.GetScore() * 1.0 / gameScore.GetTotalScore() * 1.0 <= 0.9 && stars[2]) { stars[2].gameObject.SetActive(false); }
}
