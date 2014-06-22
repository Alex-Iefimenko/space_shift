#pragma strict
import System.Collections.Generic;
import System.Linq;

public var texturelLivesContainers : Texture;
public var texturelLivesBars : Texture;

private var playersHealth : Health;
private var currentHealth : int;
private var displayBars : int;

private var liveContainerX : float; 
private var liveContainerY : float; 
private var liveContainerW : float; 
private var liveContainerH : float; 

function Start () {
	var player : GameObject = GameObject.FindGameObjectWithTag("Player");
	playersHealth = player.GetComponent.<Health>();
	currentHealth = player.GetComponent.<Health>().health;
	HealthUpdate ();
	OnGUIStartsPosition ();
}

function Update () {
	if (playersHealth.health != currentHealth) {
		HealthUpdate ();
	}
	
}

function HealthUpdate () {
	displayBars = Mathf.CeilToInt((playersHealth.health * 1.0) / (playersHealth.GetMaxHealth() * 1.0) * 10.0);
}

function OnGUI () {
	GUI.DrawTexture(Rect(liveContainerX, 
						liveContainerY, 
						liveContainerW, 
						liveContainerH), 
						texturelLivesContainers);
	
	for (var i : int = 0; i < displayBars; i++) {
		GUI.DrawTexture(Rect(liveContainerX + liveContainerW * 0.15 + (liveContainerH * 0.33) * 0.65 * i, 
						liveContainerY + liveContainerH * 0.33, 
						liveContainerH * 0.34, 
						liveContainerH * 0.5), 
						texturelLivesBars) ;
	}
}

function OnGUIStartsPosition () {
	liveContainerX = this.transform.position.x * Screen.width; 
	liveContainerY = (1 - this.transform.position.y) * Screen.height; 
	liveContainerW = Screen.width * 0.13; 
	liveContainerH = Screen.width * 0.13 / (texturelLivesContainers.width / texturelLivesContainers.height);
}