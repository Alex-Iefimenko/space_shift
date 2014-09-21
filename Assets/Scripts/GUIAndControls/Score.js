#pragma strict

private var score : int = 0;
private var totalScore : int = 0;

function Start () {
	var alltargets : GameObject[] = GameObject.FindGameObjectsWithTag("Enemy");
	for (var enemy in alltargets) {
		totalScore += enemy.GetComponent(Health).scoreValue;
	}
}

function Update () {
	guiText.text = "0" * (5 - score.ToString().length) + score.ToString();
}

function ScoreIncrease (newScore : int) {
	score += newScore;
}

function GetScore () {
	return score;
}

function GetTotalScore () {
	return totalScore;
}

function IncreaseTotalScore (increaseValue : int) {
	totalScore += increaseValue;
	return totalScore;
}