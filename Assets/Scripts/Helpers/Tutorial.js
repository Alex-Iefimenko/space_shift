#pragma strict


public var tutorialGUI : GameObject;
private var gui : GameObject;
public var addBomb : boolean = false;

function Start () {
	gui = GameObject.FindGameObjectWithTag("GUI");
}

function OnTriggerEnter2D (otherCollider : Collider2D) {			// Checking collision of Player and trigerzone
	var player : PlayerScript = new otherCollider.gameObject.GetComponent.<PlayerScript>();
	if (player != null) {
		
		if (addBomb) {

			var playerBombTrashhold : int = player.bombTreshhold;
			var score : Score = GameObject.FindGameObjectWithTag("ScoreHendler").GetComponentInChildren.<Score>();
			score.ScoreIncrease(playerBombTrashhold);
			score.IncreaseTotalScore(playerBombTrashhold);
		}
				
		Time.timeScale = 0.0;
		Camera.main.GetComponent(Blur).enabled = true; // Blur aplied
		Camera.main.GetComponent(Vignetting).enabled = true; // Vignetting aplied
		gui.SetActive(false); 
		tutorialGUI.SetActive(true);
		tutorialGUI.GetComponentInChildren.<MenuButtons>().SetTutorialVars(tutorialGUI, gui);
		

		Destroy(this.gameObject);
	}
}