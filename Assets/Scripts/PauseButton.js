#pragma strict

var camera:GameObject;
var gui: GameObject;
var guipause: GameObject;


private var isPaused : boolean = false;

function Update () {
	if (Input.GetKeyDown("escape")) {
    	ButtonClick();
	}

}

function ButtonClick () {
	if (!isPaused) {
	    Time.timeScale = 0.0;
	    isPaused = true;
    } else if (isPaused) {
	    Time.timeScale = 1.0;
	    isPaused = false;
    }
}

function OnGUI () {
    if(isPaused) {
	    Pause(isPaused);
    } else if (isPaused == false) {
    	Pause(isPaused);
    }
}

function Pause (isActive : boolean) {
	Camera.main.GetComponent(Blur).enabled = isActive; // Blur aplied
	Camera.main.GetComponent(Vignetting).enabled = isActive; // Vignetting aplied
	gui.SetActive(!isActive); //GUI hide
	guipause.SetActive(isActive); //GUI pause unhide
}