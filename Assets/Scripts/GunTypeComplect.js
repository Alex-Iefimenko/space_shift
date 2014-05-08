#pragma strict

private var shots : List.<Shooting>;						// Getting all attached Shooting component
private var firing : PlayerScript;

function Start () {
	shots = GetComponentsInChildren.<Shooting>().OrderBy(function(a){return a.name;}).ToList();
}

function Update () {
	//firing = GetComponent.<PlayerScript>();
    //if (firing.fire) {
    //	
    //}
}

function Fire (isEnemy : boolean) {
	for (var shot : Shooting in shots) {						
		if (shot != null && shot.enabled == true) {
	   		shot.Attack(isEnemy);
	   	}
	}
}