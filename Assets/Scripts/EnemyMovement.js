#pragma strict

// movementPattern variable describes different movement types for enemies:
// For correct movement usage variable should be equal to one of the next integers:
//	0 - Absence of movement. Angular velocity added (so the object will be slowly rotated during time).
// 	1 - Streight forward moving
//	2 - COS movement pattern : f(x) = sin(x)
// 	3 - x ** 1/2 movement pattern
//	4 - switched up side down x ** 1/2 movement pattern
//	5 - x *** 1/3 movement pattern
//	6 - switched up side down x *** 1/3 movement pattern
//	7 - Movement in place, where player was in the moment of enemy activation
// 	8 - Foloving (moving to target) the player
//	9 - "Hanging" after appearing in camera
// 	10 - "Hanging" after appearing in camera and following Player on 0Y axis
public var movementPattern : int;

public var speed = new Vector2(10, 10); 				// Global variable for speed adjusment
public var frequency : float = 5;						// Global variable for COS function
public var amplitude : float = 10;						// Global variable for COS and x *** 1/3 function
														// Important! 
														// Recommended value for COS: amplitude about 10
														// Recommended value for (x ** 1/2): amplitude about 3.5
														// Recommended value for (x *** 1/3): amplitude <= 4.5

public var isForbidenLeaveCamera : boolean = false; 	// To forbid to leave cemara on vertical axis.

private var xPosition : float = 0;							// Private variable for changing x position during movement
private var yPosition : float = 0;							// Private variable for changing y position during movement
private	var rotateDirection : int;						// Private helper variable for rotation movement. Direction
private	var rotateSpeed :float;							// Private helper variable for rotation movement. Speed


private var index : float;								// Helper variable for Math
private var target : GameObject;						// Helper variable for setting target in moving-to-target patterns
private var targetFirstPosition : Vector3;				// Helper variable for 7th pattern
private var previousTargetPosition : Vector3;			// Helper variable for smooth mooving

// Helper variables for Working with camera:
private var dist : float;
private var rightBorder : float;
private var hangingPoint : Vector3;
private var limitMovementTimer : float;

// ShutDown
private var timer : float = 0f;

function Start () {
	if (movementPattern == 0) rotateDirection = (Random.Range(-1.0, 1.0) >= 0) ? 1 : -1;  	// Setting rnadom rotation for pattern 0
	if (movementPattern == 0) rotateSpeed = Random.Range(5.0, 30.0);						// Setting rnadom rotation speed for pattern 0
	if (movementPattern == 5 || movementPattern == 6) {index = -1.5f;}						// Setting base for function in pattern 5 and 6
	if (movementPattern == 7) { targetFirstPosition = GameObject.FindGameObjectWithTag("Player").transform.position;  } 										// Set target as player for pattern 7
}

function Update () {
	switch (movementPattern) 
	{
		case 0:											//	0 - Absence of movement. Angular velocity added (so the object will be slowly rotated during time).
			xPosition = 0f;
			yPosition = 0f;
			transform.Rotate(0, 0, Time.deltaTime * rotateSpeed * rotateDirection);
			break;
		case 1:											// 	1 - Streight forward moving
			xPosition = -speed.x*Time.deltaTime;
			yPosition = 0f;
			break;
		case 2:											//	2 - COS movement pattern : f(x) = sin(x)
			index += Time.deltaTime;
			xPosition = -speed.x*Time.deltaTime;
			yPosition = amplitude*(Mathf.Cos(frequency * index))*Time.deltaTime;
			break;
		case 3:											// 	3 - x ** 1/2 movement pattern
			index += Time.deltaTime;					
			xPosition = -speed.x*Time.deltaTime;
			yPosition = -Mathf.Pow(index, amplitude)*Time.deltaTime;
			break;
		case 4:											//	4 - switched up side down x ** 1/2 movement pattern
			index += Time.deltaTime;
			xPosition = -speed.x*Time.deltaTime;
			yPosition = Mathf.Pow(index, amplitude)*Time.deltaTime;
			break;
		case 5:											//	5 - x *** 1/3 movement pattern
			index += Time.deltaTime;
			xPosition = -speed.x*Time.deltaTime;
			yPosition = (amplitude / (Mathf.Pow(index, 2) + 1))*Time.deltaTime;
			break;
		case 6:											//	6 - switched up side down x *** 1/3 movement pattern
			index += Time.deltaTime;
			xPosition = -speed.x*Time.deltaTime;
			yPosition = -(amplitude / (Mathf.Pow(index, 2) + 1))*Time.deltaTime;
			break;
		case 7:											//	7 - Movement in place, where player was in the moment of enemy activation
			if (timer <= 0) MoveToTarget (targetFirstPosition);
			break;
		case 8:											// 	8 - Foloving (moving to target) the player
			GetTarget("Player");
			if (target != null) {
				if (timer <= 0) MoveToTarget (target.transform.position);
			} else {
				movementPattern = 1;
			}
			break;
		case 9:											//	9 - "Hanging" after appearing in camera
			GetCameraBorder ();
			hangingPoint = Vector3(rightBorder, transform.position.y, transform.position.z);
			if (timer <= 0) transform.position = Vector3.MoveTowards(transform.position, hangingPoint , speed.x * Time.deltaTime);
			break;
		case 10:										// 	10 - "Hanging" after appearing in camera and following Player on 0Y axis
			GetCameraBorder ();
			GetTarget("Player");
			if (target != null) {
				hangingPoint = Vector3(rightBorder, target.transform.position.y, transform.position.z);
				if (timer <= 0) transform.position = Vector3.MoveTowards(transform.position, hangingPoint , speed.y * Time.deltaTime);
			} else {
				movementPattern = 1;
			}
			break;
	}	 
	if (limitMovementTimer > 0f) {
		xPosition *= 0.5;
		yPosition *= 0.5;
		limitMovementTimer -= Time.deltaTime;
	}
	
	if (timer <= 0) { 
		transform.Translate(xPosition, yPosition, 0, Space.World);
		if (this.rigidbody2D.velocity != Vector2(0, 0)) ResetVelosity();
	}
	else timer -= Time.deltaTime;
	
	// Set Object not to leave camera on upside and downside
	if (isForbidenLeaveCamera) {
		IsForbidenLeaveCamera ();
	}
}

private function MoveToTarget (currentTarget : Vector3) {
	// Setting movement to target and disable it when object is behind it

	if (transform.position.x > currentTarget.x + 1 && currentTarget != null) {
		transform.position = Vector3.MoveTowards(transform.position, currentTarget, 0.75 * speed.x * Time.deltaTime);
		xPosition = - 0.25 * speed.x * Time.deltaTime;
		previousTargetPosition = transform.position - currentTarget;
		previousTargetPosition.x = 0.25 * speed.x;
	} else {
		xPosition = - Mathf.Abs (previousTargetPosition.x * Time.deltaTime);
		
		if (previousTargetPosition.x < speed.x) { previousTargetPosition.x += speed.x * Time.deltaTime; }
		
		if (previousTargetPosition.y < 0) {
			yPosition =  Mathf.Abs (previousTargetPosition.y * Time.deltaTime );
			previousTargetPosition.y -= Time.deltaTime;
		} else {
			yPosition = - Mathf.Abs (previousTargetPosition.y * Time.deltaTime);
			previousTargetPosition.y += Time.deltaTime;
		}
		
	}
}

private function GetCameraBorder () {
	// Setting current camera right border position
	dist = (transform.position - Camera.main.transform.position).z;
	rightBorder = Camera.main.ViewportToWorldPoint(Vector3(0.8,0,dist)).x;
}

private function IsForbidenLeaveCamera () {
	// Adding restriction to leave outside the main camera
	var distance = (transform.position - Camera.main.transform.position).z;
    var topBorder = Camera.main.ViewportToWorldPoint(
      new Vector3(0.03, 0.03, distance)
    ).y;
    var bottomBorder = Camera.main.ViewportToWorldPoint(
      new Vector3(0.03, 0.97, distance)
    ).y;
      
    transform.position = new Vector3(
      transform.position.x,
      Mathf.Clamp(transform.position.y, topBorder, bottomBorder),
      transform.position.z
    ); 
}

private function GetTarget(tag : String) {
	if (target== null) {
		target = GameObject.FindGameObjectWithTag(tag);
	}
}

function StartMovementLimit (time : float) {
	limitMovementTimer = time;
}

function Push (direction : Vector2) {
	this.rigidbody2D.AddForce(direction, ForceMode2D.Force);
}

function ShutDown (time : float) {
	timer = time;
}

function ResetVelosity () {
	this.rigidbody2D.velocity = Vector2(0, 0);
	isForbidenLeaveCamera = false;
}