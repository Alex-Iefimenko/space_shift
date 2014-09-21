#pragma strict

public var NewState : Texture;
private var BasicSate : Texture;

function Start () {
	BasicSate = this.GetComponent(GUITexture).texture;
	
}

function Update () {
    var bomb : boolean = Input.GetButtonDown("Bomb");
    if (bomb) { 
    	//Application.LoadLevel("Level_10"); 
    	//Options.MusicOn(false);
    	Music ();
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
}

function About () {
	
}

function Reset () {
	yield WaitForSeconds (0.1);
	PlayerPrefs.DeleteAll();
	PlayerPrefs.SetInt("Level_10", 1);
	PlayerPrefs.SetInt("Zone_1", 1);
}

private function ChangeGuiTexture () {
	if (this.GetComponent(GUITexture).texture == BasicSate) { 
		this.GetComponent(GUITexture).texture = NewState;
	} else {
		this.GetComponent(GUITexture).texture = BasicSate;
	}
}