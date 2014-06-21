#pragma strict
import System.Collections.Generic;
import System.Linq;

private var healthBars : List.<GUITexture>;
private var playersHealth : Health;
private var currentHealth : int;
public var texture : Texture;
private var displayBars : int;

function Start () {
	var player : GameObject = GameObject.FindGameObjectWithTag("Player");
	playersHealth = player.GetComponent.<Health>();
	currentHealth = player.GetComponent.<Health>().health;
	
	healthBars = GetComponentsInChildren.<GUITexture>().OrderBy(function(a){return a.name;}).ToList();
	healthBars.Remove(this.guiTexture);
	HealthUpdate ();
}

function Update () {
	if (playersHealth.health != currentHealth) {
		HealthUpdate ();
	}
}

function HealthUpdate () {
	displayBars = playersHealth.health % (playersHealth.GetMaxHealth() + 1);
}

function OnGUI () {
	var scale : float = this.transform.localScale.x / this.transform.localScale.y;
	var livesFolder : Rect = this.guiTexture.GetScreenRect();

	for (var i : int = 0; i < displayBars; i++) {
		GUI.DrawTexture(Rect(livesFolder.xMin + Screen.height * transform.localScale.y * 0.5 + (Screen.height - livesFolder.center.y - livesFolder.height * 0.48) * i, 
						Screen.height - livesFolder.center.y - livesFolder.height * 0.16, 
						Screen.height * transform.localScale.y * 0.35 , 
						Screen.height * transform.localScale.y * 0.45), 
						texture) ;
	}
	
}