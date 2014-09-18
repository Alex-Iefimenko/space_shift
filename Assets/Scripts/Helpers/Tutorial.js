#pragma strict


public var tutorialGUI : GameObject;
private var gui : GameObject;

function Start () {
	gui = GameObject.FindGameObjectWithTag("GUI");
}

function OnTriggerEnter2D (otherCollider : Collider2D) {			// Checking collision of Player and trigerzone
	var player : PlayerScript = new otherCollider.gameObject.GetComponent.<PlayerScript>();
	if (player != null) {
		Time.timeScale = 0.0;
		Camera.main.GetComponent(Blur).enabled = true; // Blur aplied
		Camera.main.GetComponent(Vignetting).enabled = true; // Vignetting aplied
		gui.SetActive(false); 
		tutorialGUI.SetActive(true);
		tutorialGUI.GetComponentInChildren.<MenuButtons>().SetTutorialVars(tutorialGUI, gui);
		
		Destroy(this.gameObject);
	}
}