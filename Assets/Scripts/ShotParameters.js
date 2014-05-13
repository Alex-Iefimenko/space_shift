#pragma strict
import System.Collections.Generic;

public var damage : int = 1;							// Damage of shot
public var isEnemyShot : boolean = false;				// Global parameter for enemy - player recognition
public var speed = new Vector2(10, 10);					// Speed of shot
public var direction = new Vector2(1, 0);				// Direction of shot
public var behaviourType : int = 0;						// Variable for selecting shot behaviour type:
														// 0 - basic behaviour(fly forward)
														// 1 - Moving to target
														// 2 - Flack behaviour

private var allTargets : GameObject[];
private var visibleTargets : List.<GameObject>;
private var activeTarget : GameObject;

function Update () {

	// Destroying Shot if it is outside the camera
	switch (behaviourType) {
		case 0:											// Flying forward
			var movement = new Vector3(speed.x * direction.x, speed.y * direction.y, 0);
			movement *= Time.deltaTime;
			transform.Translate(movement);
			break;
		case 1:
			if (activeTarget != null) {
				TargetCapture();
			}
			//transform.position = Vector3.MoveTowards(transform.position, target, speed.x * Time.deltaTime);
			break;
		case 2:
			
			break;
	}
	if (RendererHelpers.IsVisibleFrom(transform.renderer, Camera.main) == false) {
		Destroy(gameObject);
	}
}

function TargetCapture () {
	allTargets = GameObject.FindGameObjectsWithTag("Enemy");
	for (target in allTargets) {
		if (RendererHelpers.IsVisibleFrom(target.transform.renderer, Camera.main) == false) {
			visibleTargets.Add(target);
		}
	}
	activeTarget = visibleTargets[Mathf.RoundToInt(Random.Range(0, visibleTargets.Count))];
}