#pragma strict
import System.Collections.Generic;
import System.Linq;

public var speed = new Vector2(20, 20); 					// Global variable for speed adjusment

public var gunLevel : int = 1;
private var currentGunLevel : int = 1;

public var playerGun : int = 1;
private var currentPlayerGun : int = 1;

private var movement : Vector2;								// Private variable for providing position changes
private var guns : List.<GunTypeComplect>;					// Getting all attached GunTypeComplect components

function Awake () {
	guns = GetComponentsInChildren.<GunTypeComplect>().OrderBy(function(a){return a.name;}).ToList();
	GunEnabling(currentPlayerGun);
	GunLevelChange(currentGunLevel);
}

function Update () {
	var inputX : float = Input.GetAxis("Horizontal"); 		// Getting input on 0X axis
	var inputY : float = Input.GetAxis("Vertical");	  		// Getting input on 0Y axis
	                                                  		// For floating effect (smooth stop/go of ship) needed adjusment 
	                                                  		// gravity value to 0..3 (Project Settings -> Input -> Axis -> Gravity)
	movement = new Vector2(inputX * speed.x, inputY * speed.y);
	
	// Adding restriction to leave outside the main camera
	var distance = (transform.position - Camera.main.transform.position).z;
	var leftBorder = Camera.main.ViewportToWorldPoint(
      new Vector3(0.03, 0.03, distance)
    ).x;
    var rightBorder = Camera.main.ViewportToWorldPoint(
      new Vector3(0.97, 0.03, distance)
    ).x;
    var topBorder = Camera.main.ViewportToWorldPoint(
      new Vector3(0.03, 0.03, distance)
    ).y;
    var bottomBorder = Camera.main.ViewportToWorldPoint(
      new Vector3(0.03, 0.97, distance)
    ).y;
      
    transform.position = new Vector3(
      Mathf.Clamp(transform.position.x, leftBorder, rightBorder),
      Mathf.Clamp(transform.position.y, topBorder, bottomBorder),
      transform.position.z
    ); 
    										// Detection changes in gun load levels.
    if (currentPlayerGun != playerGun) {
    	GunEnabling(playerGun);
    }
    
    if (currentGunLevel != gunLevel) {
    	GunLevelChange(gunLevel);
    }
    
    var fire : boolean = Input.GetButton("Fire1");
    if (fire) {
    	for (var gun : GunTypeComplect in guns) {
    		if (gun != null && gun.enabled == true) { gun.Fire(false); }
    	}
    }
}

function FixedUpdate () {
	rigidbody2D.velocity = movement; 						// Adding velocity to rigidbody2d component
}

function OnCollisionEnter2D(collision : Collision2D) {		// Damaging player and enemy on collision
	var playerDamage : boolean = false;
	var enemy : EnemyScript = collision.gameObject.GetComponent.<EnemyScript>();
	if (enemy != null) {
		var enemyHealth : Health = enemy.GetComponent.<Health>();
		if (enemyHealth != null) {
			enemyHealth.Damage(enemyHealth.health);
		}
		playerDamage = true;
	}
	if (playerDamage) {
		var playerHealth : Health = this.GetComponent.<Health>();
		playerHealth.Damage(enemyHealth.health);
	}
}

function OnTriggerEnter2D (otherCollider : Collider2D) {		// Checking collision of Player and PowerUp
	var powerUp : PowerUp = new otherCollider.gameObject.GetComponent.<PowerUp>();
	if (powerUp != null) {
		switch (powerUp.powerUpType) {
			case 1: 												// Weapon change
				playerGun = powerUp.powerUpValue;
				break;
			case 2:													// Weapon improve
				gunLevel += powerUp.powerUpValue;
				break;
			case 3:													// Repair
				break;
			case 4:													// Shield
				break;
		}
		Destroy(powerUp.gameObject);
	}
	
}

function GunEnabling (type : int) {
	if (type <= guns.Count && type > 0) {							// Enabling neccessary gun
		for (var gun : GunTypeComplect in guns) {					// Disabling all current guns
			gun.enabled = false;
		}
		guns[type - 1].enabled = true;
	}
	currentPlayerGun = type;
	if (gunLevel >= 3) {
		gunLevel -= 2;
	} else {
		gunLevel = 1;
	}
}

function GunLevelChange(level : int) {
	if (level > 4) {
		level = 4;
		gunLevel = 4;
	}
	for (var gun : GunTypeComplect in guns) {
	   	if (gun != null && gun.enabled == true) { 
	   		gun.GunLevel(level);
	   		gun.currentLevel = level;
	   	}
	}
	currentGunLevel = level;

}