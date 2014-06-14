#pragma strict

private var score : int = 0;
private var scoreDisplay : String;

public var scoreGuiStyle : GUIStyle;

function OnGUI () {
	scoreDisplay = GUI.TextField (Rect (Screen.width / 2 - 25, Screen.height / 10 - 30, 50, 30), score.ToString(), 50);
}

function ScoreIncrease (newScore : int) {
	score += newScore;
}