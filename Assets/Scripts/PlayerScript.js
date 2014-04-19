#pragma strict

public var speed = new Vector2(20, 20); 				// Global variable for speed adjusment
private var movement : Vector2;							// Private variable for providing position changes

private var shots : Shooting[];							// Getting all attached Shooting component

function Start () {
	shots = GetComponentsInChildren.<Shooting>();
}

function Update () {
	var inputX : float = Input.GetAxis("Horizontal"); 	// Getting input on 0X axis
	var inputY : float = Input.GetAxis("Vertical");	  	// Getting input on 0Y axis
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
    
    // Player shooting for initiating Shooting component
    var fire : boolean = Input.GetButtonDown("Fire1");
    if (fire){
    	for (var shot : Shooting in shots) {						
				if (shot != null) {
		    	shot.Attack(false);
		    }
        }
    }
}

function FixedUpdate () {
	rigidbody2D.velocity = movement; 					// Adding velocity to rigidbody2d component
}

function OnCollisionEnter2D(collision : Collision2D) {	// Damaging player and enemy on collision
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
