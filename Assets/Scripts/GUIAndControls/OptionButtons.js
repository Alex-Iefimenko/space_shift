#pragma strict

public var newImageNormal : Texture;
public var newImageOver : Texture;
private var basicImageNormal : Texture;
private var basicImageOver : Texture;

private var graphicsNames : String[] = ["Low", "Medium", "High"];

function Start () {
	basicImageNormal = this.GetComponent(GUITexture).texture;
	basicImageOver = this.GetComponent.<ControllerGUIButton>().imageOver;
	
	switch (this.transform.name) {
		case "Graphics":
			this.GetComponentInChildren.<GUIText>().text = "Graphic Quality : " + graphicsNames[Options.graphics];
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
	this.GetComponentInChildren.<GUIText>().text = "Graphic Quality : " + graphicsNames[Options.graphics];
}

function About () {
	
}

function Reset () {
	yield WaitForSeconds (0.1);
	PlayerPrefs.DeleteAll();
	PlayerPrefs.SetInt("Level_10", 1);
	PlayerPrefs.SetInt("Zone_1", 1);
	PlayerPrefs.Save();
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