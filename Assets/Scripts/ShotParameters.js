#pragma strict

public var damage : int = 1;							// Damage of shot
public var isEnemyShot : boolean = false;				// Global parameter for enemy - player recognition
public var speed = new Vector2(10, 10);					// Speed of shot
public var direction = new Vector2(1, 0);				// Direction of shot

function Update () {
	// Adding movement for shot
	var movement = new Vector3(speed.x * direction.x, speed.y * direction.y, 0);
	movement *= Time.deltaTime;
	transform.Translate(movement);
	// Destroying Shot if it is outside the camera
	if (RendererHelpers.IsVisibleFrom(transform.renderer, Camera.main) == false) {
			Destroy(gameObject);
	}
}