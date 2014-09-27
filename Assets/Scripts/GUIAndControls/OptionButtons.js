#pragma strict

public var newImageNormal : Texture;
public var newImageOver : Texture;
private var basicImageNormal : Texture;
private var basicImageOver : Texture;

// Graphics Settings
public var graphicsHigh : Texture;
public var graphicsHighActive : Texture;

public var graphicsMed : Texture;
public var graphicsMedActive : Texture;

public var graphicsLow : Texture;
public var graphicsLowActive : Texture;

private var graphicsLevels : Texture[];
private var graphicsLevelsActive : Texture[];

function Awake () {
	graphicsLevels = [graphicsLow, graphicsMed, graphicsHigh];
	graphicsLevelsActive = [graphicsLowActive, graphicsMedActive, graphicsHighActive];
}

function Start () {
	basicImageNormal = this.GetComponent(GUITexture).texture;
	basicImageOver = this.GetComponent.<ControllerGUIButton>().imageOver;
	
	switch (this.transform.name) {
		case "Graphics":
			this.GetComponent.<ControllerGUIButton>().SetImageNormal(graphicsLevels[Options.graphics], graphicsLevelsActive[Options.graphics]);
			this.GetComponent(GUITexture).texture = graphicsLevels[Options.graphics];

			break;
		case "Music":
			if (Options.music == false) {
				this.GetComponent(GUITexture).texture = newImageNormal;
				this.GetComponent.<ControllerGUIButton>().SetImageNormal(newImageNormal, newImageOver);
			}
			break;
		case "Sound":
			if (Options.sound == false) {
				this.GetComponent(GUITexture).texture = newImageNormal;
				this.GetComponent.<ControllerGUIButton>().SetImageNormal(newImageNormal, newImageOver);
			}
			break;
	}
}

function Music () {
	yield WaitForSeconds (0.1);
	Options.MusicOn(!Options.music);
	ChangeGuiTexture();
}

function Sound () {
	yield WaitForSeconds (0.1);
	Options.SoundOn(!Options.sound);
	ChangeGuiTexture();
}

function GraphicsLevel () {
	yield WaitForSeconds (0.1);
	var currentGraphicsLevel : int = Options.graphics;
	Options.GraphicsLevel((currentGraphicsLevel + 1) % 3);
	this.GetComponent.<ControllerGUIButton>().SetImageNormal(graphicsLevels[Options.graphics], graphicsLevelsActive[Options.graphics]);
	this.GetComponent(GUITexture).texture = graphicsLevels[Options.graphics];
}

function ResetProgress () {
	yield WaitForSeconds (0.1);
	PlayerPrefs.DeleteAll();
	PlayerPrefs.SetInt("Level_10", 1);
	PlayerPrefs.SetInt("Zone_1", 1);
	Options.SaveOptions();
}

private function ChangeGuiTexture () {
	if (this.GetComponent(GUITexture).texture == basicImageNormal) { 
		this.GetComponent(GUITexture).texture = newImageNormal;
		this.GetComponent.<ControllerGUIButton>().SetImageNormal(newImageNormal, newImageOver);
	} else {
		this.GetComponent(GUITexture).texture = basicImageNormal;
		this.GetComponent.<ControllerGUIButton>().SetImageNormal(basicImageNormal, basicImageOver);
	}
}