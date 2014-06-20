#pragma strict
import System.Collections.Generic;
import System.Linq;

private var healthBars : List.<GUITexture>;
private var playersHealth : Health;
private var currentHealth : int;

function Start () {
	var player : GameObject = GameObject.FindGameObjectWithTag("Player");
	playersHealth = player.GetComponent.<Health>();
	currentHealth = player.GetComponent.<Health>().health;
	
	healthBars = GetComponentsInChildren.<GUITexture>().OrderBy(function(a){return a.name;}).ToList();
	healthBars.Remove(this.guiTexture);
}

function Update () {
	if (playersHealth.health != currentHealth) {
		HealthUpdate ();
	}
}

function HealthUpdate () {
	var displayBars : int = playersHealth.health % playersHealth.GetMaxHealth();
	
	for (var healthBar : GUITexture in healthBars) {
		healthBar.enabled = false;
	}
	for (var i : int = 0; i < displayBars; i++) {
		healthBars[i].enabled = true;
	}
	
	currentHealth = playersHealth.health;
}