#pragma strict

private var enemyMovement : EnemyMovement; 							// Getting attached EnemyMovement component
private var shots : Shooting[];										// Getting all attached Shooting component
private var health : Health;										// Getting attached Health component

private var isActive : boolean;										// Helper variable for enabling / disabling enemy
private var limitFiringTimer : float;
private var attackAlowed : boolean = true;
public var activateOnHit : boolean = true;
private var engines : ParticleRenderer[];

// bifurcation behaviour
public var isBifurcation : boolean = false;
public var newShips : GameObject;

function Awake () {
	enemyMovement = GetComponent.<EnemyMovement>();					
	shots = GetComponentsInChildren.<Shooting>();
	health = GetComponent.<Health>();
	if (activateOnHit) engines = this.gameObject.GetComponentsInChildren.<ParticleRenderer>();
}

function Start () {	
	isActive = false;												// Disapling helper variable for enabling / disabling enemy
	enemyMovement.enabled = false;									// Disabling EnemyMovement component
	health.enabled = false;											// Disabling Health component
	for (var shot : Shooting in shots) {							// Disabling all Shooting component component
		shot.enabled = false;
	}
	if (activateOnHit && engines.Count() > 0) { 
		for (var engine : ParticleRenderer in engines) {
			engine.enabled = false;
		}
	}
}

function Update () {
	if (isActive == false) {										// Check if object is seen by camera
		if (RendererHelpers.IsVisibleFrom(transform.renderer, Camera.main)) {
			IsActive();
		}
	} else {
		for (var shot : Shooting in shots) {						// Autofire for enemy
				if (shot != null && shot.CanAttack && limitFiringTimer <= 0f && attackAlowed) {
		    	shot.Attack(true);
		    }
		}
	}
	if (limitFiringTimer >= 0f) limitFiringTimer -= Time.deltaTime;
	if (activateOnHit && health.health < health.GetMaxHealth()) activateOnHit = false;
	if (((activateOnHit && health.enabled) || isActive) && RendererHelpers.IsVisibleFrom(transform.renderer, Camera.main) == false) Destroy(gameObject);
}

function IsActive () {	
	// Activating enemy components
	health.enabled = true;
	if (!activateOnHit) {
		isActive = true;
		enemyMovement.enabled = true;
		for (var shot : Shooting in shots) {
			shot.enabled = true;
		}
		if (engines != null && engines.Count() > 0) { 
			for (var engine : ParticleRenderer in engines) {
				engine.enabled = true;
			}
		}
	}
}

function StartFiringLimit(time : float) {
	limitFiringTimer = time;
}

function AllowAttack (allow : boolean) {
	attackAlowed = allow;
}

function OnDestroy () {
	if (isBifurcation) Bifurcate ();
}

function Bifurcate () {
	var ySize : float = this.renderer.bounds.extents.y;
	var initialPositionAdjust : Vector3[] = [Vector3(0, ySize, 0), Vector3(0, -1.0 * ySize, 0)];
	var forceVectors : Vector2[] = [Vector2(75, 75), Vector2(75, -75)];
	for (var i : int = 0; i < 2; i++) {
		var ship : GameObject = Instantiate(newShips, this.transform.position + initialPositionAdjust[i], Quaternion.identity) as GameObject;
		var enemyMovement : EnemyMovement = ship.GetComponent.<EnemyMovement>();
		enemyMovement.isForbidenLeaveCamera = true;
		enemyMovement.ShutDown(1.75);
		enemyMovement.Push(forceVectors[i]);
	}
}