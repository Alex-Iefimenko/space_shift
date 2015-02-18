#pragma strict

import System.Collections.Generic;

private var guiObjects : List.<GUITexture>;
private var guiObjectsTimers : List.<float> = new List.<float>();

function Start () {
	guiObjects = GetComponentsInChildren.<GUITexture>().OrderBy(function(a){return a.name;}).ToList();
	guiObjectsTimers.AddRange([0f] * guiObjects.Count);
}

function Update () {
	for (var object : GUITexture in guiObjects) {
	    if (guiObjectsTimers[guiObjects.IndexOf(object)] > 0f) guiObjectsTimers[guiObjects.IndexOf(object)] -= Time.deltaTime;
	    if (guiObjectsTimers[guiObjects.IndexOf(object)] <= 0f && object.enabled) { 
	    	object.gameObject.GetComponent.<Animator>().enabled = false;
	    	object.enabled = false;
	    }
	}
}

function StartShow (objectNumber : int, time : float) {
	guiObjectsTimers[objectNumber] = time;
	guiObjects[objectNumber].gameObject.GetComponent.<Animator>().enabled = true;
	guiObjects[objectNumber].enabled = true;

}