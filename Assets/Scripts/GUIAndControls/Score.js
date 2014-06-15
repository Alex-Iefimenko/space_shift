#pragma strict

private var score : int = 0;

function Update () {
	guiText.text = "0" * (5 - score.ToString().length) + score.ToString();
}

function ScoreIncrease (newScore : int) {
	score += newScore;
}