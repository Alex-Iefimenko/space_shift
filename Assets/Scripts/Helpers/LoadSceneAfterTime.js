#pragma strict

public var timer : float  = 10f;
public var sceneName : String;

function Start () {
	Invoke("Load", timer);
}

function Load () {
	Application.LoadLevel(sceneName);
}