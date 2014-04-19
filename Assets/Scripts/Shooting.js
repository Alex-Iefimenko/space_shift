#pragma strict

public var misslePrefab : Transform;					// Getting misle prefab
public var shootingRate : float = 0.25;					// Setting shooting rate	
private var shootCoolDown : float;						// Helper variable for checking shooting cooldwon

function Start () {
	shootCoolDown = 0f;
}

function Update () {
	if (shootCoolDown > 0) {							// Reduction of shootCoolDown in each frame
		shootCoolDown -= Time.deltaTime;
	}
}

function Attack (isEnemy : boolean) {
	if (CanAttack()) {									// Attacking by Instantiating necessary prefab
		shootCoolDown = shootingRate;
		var shotTransform = Instantiate(misslePrefab) as Transform;
		shotTransform.position = transform.position;	// Getting current object position for Instantiated missle
	}
}

function CanAttack () {									// Permission for attacked which depends on cooldown
	 if (shootCoolDown <= 0f) {
      	return true;
     } else {
      	return false;
     }
}