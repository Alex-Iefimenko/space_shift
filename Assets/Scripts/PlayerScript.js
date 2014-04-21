#pragma strict
import System.Collections.Generic;
import System.Linq;

public var speed = new Vector2(20, 20); 					// Global variable for speed adjusment

public var gunLevel : int = 1;
private var currentGunLevel : int = 1;

private var movement : Vector2;								// Private variable for providing position changes
private var shots : List.<Shooting>;						// Getting all attached Shooting component

function Start () {
	shots = GetComponentsInChildren.<Shooting>().OrderBy(function(a){return a.name;}).ToList();
	GunEnabling(gunLevel);
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
    if (currentGunLevel != gunLevel) {
    	GunEnabling(gunLevel);
    }
    // Player shooting for initiating Shooting component
    var fire : boolean = Input.GetButtonDown("Fire1");
    if (fire){
    	for (var shot : Shooting in shots) {						
				if (shot != null && shot.enabled == true) {
		    	shot.Attack(false);
		    }
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
		playerHealth.Damage(1);
	}
}

function OnTriggerEnter2D (otherCollider : Collider2D) {		// Checking collision of Player and PowerUp
	var powerUp : PowerUp = new otherCollider.gameObject.GetComponent.<PowerUp>();
	if (powerUp != null) {
		gunLevel += powerUp.powerUpLevel;
		Destroy(powerUp.gameObject);
	}
}

function GunEnabling (level : int) {
	var gunNumberEnambleArray : List.<int> = new List.<int>(); 	// Creating Array with number of guns which will be enabled;
	for (var j : int = 0; j < level; j++) {
		gunNumberEnambleArray.Add(j);
	}
	for (var shot : Shooting in shots) {						// Disabling all current guns
		shot.enabled = false;
	}
	for (var x : int in gunNumberEnambleArray) {				// Enabling neccessary guns
		if (x < shots.Count) {
			shots[x].enabled = true;
		}
	}
	currentGunLevel = level;
}
