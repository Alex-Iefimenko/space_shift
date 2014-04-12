#pragma strict

public var speed = new Vector2(20, 20); 				// Global variable for speed adjusment
private var movement : Vector2;							// Private variable for providing position changes

function Start () {

}

function Update () {
	var inputX : float = Input.GetAxis("Horizontal"); 	// Getting input on 0X axis
	var inputY : float = Input.GetAxis("Vertical");	  	// Getting input on 0Y axis
	                                                  	// For floating effect (smooth stop/go of ship) needed adjusment 
	                                                  	// gravity value to 0..1 (Project Settings -> Input -> Axis -> Gravity)
	movement = new Vector2(inputX * speed.x, inputY * speed.y);
}

function FixedUpdate () {
	rigidbody2D.velocity = movement; 					// Adding velocity to rigidbody2d component
}
