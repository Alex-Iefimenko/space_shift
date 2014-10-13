#pragma strict

// movementPattern variable describes different movement types for enemies:
// For correct movement usage variable should be equal to one of the next integers:
//	0 - Absence of movement. Angular velocity added (so the object will be slowly rotated during time).
// 	1 - Streight forward moving

//	2 - towards upper left angle
// 	3 - towards down left angle
//	4 - towards midle left
//	5 - towards up midle then midle left
//	6 - towards down midle then midle left
//  7 - Smooth movement on the right
//  8 - Smooth movement on the middle
//  9 - Smooth movement on the left
//  10 - Sinus like
//	11 - Movement in place, where player was in the moment of enemy activation
// 	12 - Foloving (moving to target) the player
//	13 - "Hanging" after appearing in camera
// 	14 - "Hanging" after appearing in camera and following Player on 0Y axis

public var movementPattern : int;

public var speed = new Vector2(10, 10); 				// Global variable for speed adjusment
public var frequency : float = 5;						// Global variable for COS function
public var amplitude : float = 0.5;						// Global variable for COS and x *** 1/3 function
														// Important! 
														// Recommended value for COS: amplitude about 10
														// Recommended value for (x ** 1/2): amplitude about 3.5
														// Recommended value for (x *** 1/3): amplitude <= 4.5

public var isForbidenLeaveCamera : boolean = false; 	// To forbid to leave cemara on vertical axis.

private var xPosition : float = 0;							// Private variable for changing x position during movement
private var yPosition : float = 0;							// Private variable for changing y position during movement
private	var rotateDirection : int;						// Private helper variable for rotation movement. Direction
private	var rotateSpeed :float;							// Private helper variable for rotation movement. Speed

private var target : GameObject;						// Helper variable for setting target in moving-to-target patterns
private var targetFirstPosition : Vector3;				// Helper variable for 7th pattern
private var previousTargetPosition : Vector3;			// Helper variable for smooth mooving
private var initPosition : Vector2;
private var deltaYspeed : float;

private var segment : float = 0f;
private var borderSegment : float = 0f;

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
	if (movementPattern == 11) { targetFirstPosition = GameObject.FindGameObjectWithTag("Player").transform.position;  } 										// Set target as player for pattern 7
	initPosition = transform.position;
}

function FixedUpdate () {
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
		case 2:											//	2 - towards upper left angle
			MoveTowardsYPoint(0f , 1f);
			break;
		case 3:											// 	3 - towards down left angle
			MoveTowardsYPoint(0f, 0f);
			break;
		case 4:											//	4 - towards midle left
			MoveTowardsYPoint(0f, 0.5f);
			break;
		case 5:											//	5 - towards up midle then midle left
			MoveTowardsTwoPoints(0.5f, 1f, 0f, 0.5f);
			break;
		case 6:											//	6 - switched up side down x *** 1/3 movement pattern
			MoveTowardsTwoPoints(0.5f, 0f, 0f, 0.5f);
			break;
		case 7:
			SmoothPositionChange (0.55, 0.3, 0.05);
			break;
		case 8:
			SmoothPositionChange (0.75, 0.5, 0.25);
			break;
		case 9: 
			SmoothPositionChange (0.95, 0.7, 0.45);
			break;
		case 10: 
			CosMovement(frequency, amplitude);
			break;
		case 11:											//	7 - Movement in place, where player was in the moment of enemy activation
			if (timer <= 0) MoveToTarget (targetFirstPosition);
			break;
		case 12:											// 	8 - Foloving (moving to target) the player
			GetTarget("Player");
			if (target != null) {
				if (timer <= 0) MoveToTarget (target.transform.position);
			} else {
				movementPattern = 1;
			}
			break;
		case 13:											//	9 - "Hanging" after appearing in camera
			GetCameraBorder ();
			hangingPoint = Vector3(rightBorder, transform.position.y, transform.position.z);
			if (timer <= 0) transform.position = Vector3.MoveTowards(transform.position, hangingPoint , speed.x * Time.deltaTime);
			break;
		case 14:										// 	10 - "Hanging" after appearing in camera and following Player on 0Y axis
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

function MoveTowardsYPoint (pointX : float, pointY : float) {
	var distance = (transform.position - Camera.main.transform.position).z;
	var targetPoint = Camera.main.ViewportToWorldPoint(Vector3(pointX, pointY, distance));
	targetPoint.z = transform.position.z;
	if (transform.position.x > targetPoint.x) {
		transform.position = Vector3.MoveTowards(transform.position, targetPoint, speed.x * Time.deltaTime);
	} else {
		if (initPosition.y > targetPoint.y) {
			targetPoint += Vector3(-1f, -0.6f, transform.position.z);
		} else {
			targetPoint += Vector3(-1f, 0.6f, transform.position.z);
		}
		transform.position = Vector3.MoveTowards(transform.position, targetPoint, speed.x * Time.deltaTime);
	}
}

function MoveTowardsTwoPoints(pointXFirst : float, pointYFirst : float, pointXSecond : float, pointYSecond : float) {
	var distance = (transform.position - Camera.main.transform.position).z;
	var targetPoint = Camera.main.ViewportToWorldPoint(Vector3(pointXFirst, pointYFirst, distance));
	if (transform.position.x > targetPoint.x ) {
		MoveTowardsYPoint (pointXFirst, pointYFirst);
	} else {
		MoveTowardsYPoint (pointXSecond, pointYSecond);
	}	
}

function SmoothPositionChange (xStart : float, xMiddle : float, xEnd : float) {
	var distance = (transform.position - Camera.main.transform.position).z;
	var dMax = Camera.main.ViewportToWorldPoint(Vector3(xStart, 1f, distance));
	var dMid = Camera.main.ViewportToWorldPoint(Vector3(xMiddle, 0.5, distance));
	var dMin = Camera.main.ViewportToWorldPoint(Vector3(xEnd, 0f, distance));
	if (deltaYspeed == 0f) GetDeltaYSpeed(xStart, xMiddle, xEnd, -1f);
	if (transform.position.x <= dMax.x && transform.position.x >= dMid.x) {
		speed.y += deltaYspeed;
	} else if (transform.position.x <= dMid.x && transform.position.x >= dMin.x) {
		speed.y -= deltaYspeed;
	} else if (transform.position.x >= dMin.x) {
		speed.y = 0;
	}
	xPosition = -speed.x*Time.deltaTime;
	yPosition = -speed.y*Time.deltaTime;
}

function GetDeltaYSpeed (xStart : float, xMiddle : float, xEnd : float, yAmlitude : float) {
	speed.y = 0;
	var distance = (transform.position - Camera.main.transform.position).z;
	var dMax = Camera.main.ViewportToWorldPoint(Vector3(xStart, 1f, distance));
	var dMid = Camera.main.ViewportToWorldPoint(Vector3(xMiddle, 0.5, distance));
	var dMin = Camera.main.ViewportToWorldPoint(Vector3(xEnd, 0f, distance));
	var coef : float = 1f;
	var yDist : float;
	if (yAmlitude == -1f) {
		yDist = Mathf.Abs(dMax.y + Mathf.Abs(dMin.y) - 2f * Mathf.Abs(initPosition.y - dMin.y));
		if (initPosition.y < dMid.y) coef = -1f;
	} else {
		yDist = (dMax.y + Mathf.Abs(dMin.y)) * amplitude;
		if (deltaYspeed < 0f) coef = -1f;
	}
	var cameraSpeed : float = GameObject.FindGameObjectWithTag("Player").GetComponent.<Scrolling>().speed.x;
	var timeAvail : float = (dMax.x - dMin.x) / (speed.x + cameraSpeed);
	var fixedYspeed : float = yDist / timeAvail;
	deltaYspeed = 4f * fixedYspeed / timeAvail * Time.deltaTime * coef;
}

function CosMovement(frequency : float, amplitude : float) {
	var distance = (transform.position - Camera.main.transform.position).z;
	var dborder = Camera.main.ViewportToWorldPoint(Vector3(borderSegment, 0.5, distance));
	if (deltaYspeed == 0) CosPhaseInit();
	if (dborder.x >= transform.position.x) CosPhaseDetection();
	SmoothPositionChange (borderSegment + segment, (borderSegment + segment + borderSegment) / 2f, borderSegment);
}

function CosPhaseDetection() {
	var distance = (transform.position - Camera.main.transform.position).z;
	var dMax = Camera.main.ViewportToWorldPoint(Vector3(1f, 0.5, distance));
	var dMin = Camera.main.ViewportToWorldPoint(Vector3(0f, 0.5, distance));	
	borderSegment -= segment;
	GetDeltaYSpeed (borderSegment + segment, (borderSegment + segment + borderSegment) / 2f, borderSegment, 0f);
	deltaYspeed *= -1f;
}

function CosPhaseInit () {
	var distance = (transform.position - Camera.main.transform.position).z;
	var dMax = Camera.main.ViewportToWorldPoint(Vector3(1f, 0.5, distance));
	var dMin = Camera.main.ViewportToWorldPoint(Vector3(0f, 0.5, distance));
	segment = 1f / (2 * frequency);
	borderSegment = 1f - segment;
	GetDeltaYSpeed (1f, (1f + 1f - segment) / 2f, 1f - segment, 0f);
}