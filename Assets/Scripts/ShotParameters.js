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

private var currentLevel : int;

private var activeTarget : GameObject;
private var lookRotation : Quaternion;

public var misslePrefab : Transform;					// Getting misle prefab

private var destroyDist : float;

function Awake() {
	if (behaviourType == 2) {
		destroyDist = GetNearCameraBorder();
	}
}
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
			if (transform.position.x >= destroyDist) {
				Destroy(gameObject);
			}
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
			while (number < 360) {
				var shotTransform = Instantiate(misslePrefab) as Transform;
				shotTransform.position = transform.position;						// Getting current object position for Instantiated missle
				var bullet : ShotParameters = new shotTransform.gameObject.GetComponent.<ShotParameters>();
    			if (bullet != null) {
    				bullet.transform.Rotate(0,0, number);			
    				bullet.LevelPass(currentLevel);
				}
				number += (360 / (6 * currentLevel));
			}	
			break;
	}
}

function LevelPass(level : int) {
	currentLevel = level;
}

function GetNearCameraBorder() {
	// Setting current camera right border position
	var x : float = Random.Range(0.80, 0.95);
	var dist : float = (transform.position - Camera.main.transform.position).z;
	var rightBorder : float = Camera.main.ViewportToWorldPoint(Vector3(x,0,dist)).x;
	return rightBorder;
}