#pragma strict
import System.Collections.Generic;
import System.Linq;

public var misslePrefab : Transform;					// Getting misle prefab
public var shootingRate : float = 0.25;					// Setting shooting rate	
private var shootCoolDown : float;						// Helper variable for checking shooting cooldwon

public var isBurst : boolean;
public var burstLength : int = 10;
public var burstRate : float = 0.1;

private var currentLevel : int = 1;
public var isRocket : boolean;

private var bullets : List.<ShotParameters> = new List.<ShotParameters>();

function Start () {
	shootCoolDown = 0f;
}

function Update () {
	if (shootCoolDown > 0) {							// Reduction of shootCoolDown in each frame
		shootCoolDown -= Time.deltaTime;
	}
}

function Attack (isEnemy : boolean) {
	if (CanAttack(shootCoolDown)) {									// Attacking by Instantiating necessary prefab
		if (isBurst) {
			if (isRocket) {
				Burst(currentLevel, false);
				shootCoolDown = shootingRate + currentLevel * burstRate;
			} else {
				Burst(burstLength, true);
				shootCoolDown = shootingRate + burstLength * burstRate;
			}
		} else if (isBurst == false) {
			SingleShot ();
			shootCoolDown = shootingRate;
		}
	}
}

function CanAttack (coolDown : float) {									// Permission for attacked which depends on cooldown
	 if (coolDown <= 0f) {
      	return true;
     } else {
      	return false;
     }
}

function SingleShot () {
	var shotTransform = Instantiate(misslePrefab) as Transform;
	shotTransform.position = transform.position;						// Getting current object position for Instantiated missle
	var bullet : ShotParameters = new shotTransform.gameObject.GetComponent.<ShotParameters>();
	bullet.LevelPass(currentLevel);
	bullets.Add(bullet);
    if (bullet != null) {
    	bullet.transform.rotation = this.transform.rotation;			// towards in 2D space is the right of the sprite
    	bullet.LevelPass(currentLevel);
    }
}

function Burst (n : int, isRail : boolean) {
	bullets = new List.<ShotParameters>();
	var times : int = 0;
	while (times < n) {
		SingleShot();
		yield WaitForSeconds(burstRate);
		times++;
		if (isRail) {RailBehaviour();}
	}
}

function LevelPass(level : int) {
	currentLevel = level;
}

function RailBehaviour() {
	var target : Vector3 = GameObject.FindGameObjectWithTag("Player").transform.position;
	for (var i : ShotParameters in bullets) {
		if (i != null) {i.transform.position.y = target.y;}
	}
}