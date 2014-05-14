#pragma strict
import System.Collections.Generic;
import System.Linq;

public var behaviourType : int = 0;						// Variable for selecting shot behaviour type:
														// 0 - basic behaviour(fly forward)
														// 1 - Moving to target
														// 2 - Flack behaviour
														
public var damage : int = 1;							// Damage of shot
public var isEnemyShot : boolean = false;				// Global parameter for enemy - player recognition
public var speed = new Vector2(10, 10);					// Speed of shot
public var direction = new Vector2(1, 0);				// Direction of shot

private var activeTarget : GameObject;
private var lookRotation : Quaternion;
function Update () {
	
	
	switch (behaviourType) {
		case 0:											// Flying forward
			Movement();
			break;
		case 1:
			Movement();
			if (activeTarget == null) {
				TargetCapture();
			} else {
				lookRotation = Quaternion.LookRotation(activeTarget.transform.position - transform.position, Vector3.up);
				lookRotation.x = 0f;
				lookRotation.y = 0f;	
				transform.rotation = Quaternion.Slerp(transform.rotation, lookRotation, Time.deltaTime * 10);
			}
			
			break;
		case 2:
			break;
	}
	
	
	// Destroying Shot if it is outside the camera
	if (RendererHelpers.IsVisibleFrom(transform.renderer, Camera.main) == false) {
		Destroy(gameObject);
	}
}

function TargetCapture () {
	var allTargets : List.<GameObject> = new List.<GameObject>();
	var visibleTargets : List.<GameObject> = new List.<GameObject>();
	allTargets.AddRange(GameObject.FindGameObjectsWithTag("Enemy"));
	for (target in allTargets) {
		if (RendererHelpers.IsVisibleFrom(target.transform.renderer, Camera.main)) {
			if (target != null) {
				visibleTargets.Add(target);
			}
		}
	}
	if (visibleTargets.Count > 0) {
		activeTarget = visibleTargets[Mathf.RoundToInt(Random.Range(0, visibleTargets.Count))];
	}
}

function Movement () {
			var movement = new Vector3(speed.x * direction.x, speed.y * direction.y, 0);
			movement *= Time.deltaTime;
			transform.Translate(movement);
}