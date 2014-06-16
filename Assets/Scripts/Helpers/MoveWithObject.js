#pragma strict

public var target : GameObject;

function Awake () {
	if (target == null) {
		target = GameObject.FindGameObjectWithTag("Player");
	}
}

function Update () {
	var place : Vector3 = Vector3(target.transform.position.x + renderer.bounds.size.x/2, 
									target.transform.position.y, 
									target.transform.position.z);
	transform.position = place;

}