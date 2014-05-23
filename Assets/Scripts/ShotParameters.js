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

public var currentLevel : int = 1;

private var activeTarget : GameObject;
private var lookRotation : Quaternion;

public var misslePrefab : Transform;					// Getting misle prefab

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
			Movement();
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

function OnDestroy () {
	switch (behaviourType) {
		case 0:											
			break;
		case 1:
			break;
		case 2:
			var number : float = 0;
			//while (number < 6.28) {
				var shotTransform = Instantiate(misslePrefab) as Transform;
				Debug.Log(shotTransform.position);
				shotTransform.position = transform.position;						// Getting current object position for Instantiated missle
				Debug.Log(shotTransform.position);
				var bullet : ShotParameters = new shotTransform.gameObject.GetComponent.<ShotParameters>();
    		//	if (bullet != null) {
    		//		bullet.transform.rotation.z = number;			
    		//		bullet.currentLevel = currentLevel;
			//	}
			//	number += (6.28 / (6 * currentLevel));
			//}	
			break;
	}
}