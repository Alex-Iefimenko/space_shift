#pragma strict

private var enemyMovement : EnemyMovement; 							// Getting attached EnemyMovement component
private var shots : Shooting[];										// Getting all attached Shooting component
private var health : Health;										// Getting attached Health component

private var isActive : boolean;										// Helper variable for enabling / disabling enemy

function Awake () {
	enemyMovement = GetComponent.<EnemyMovement>();					
	shots = GetComponentsInChildren.<Shooting>();
	health = GetComponent.<Health>();	
}

function Start () {	
	isActive = false;												// Disapling helper variable for enabling / disabling enemy
	enemyMovement.enabled = false;									// Disabling EnemyMovement component
	health.enabled = false;											// Disabling Health component
	for (var shot : Shooting in shots) {							// Disabling all Shooting component component
		shot.enabled = false;
	}
	
}

function Update () {
	if (isActive == false) {										// Check if object is seen by camera
		if (RendererHelpers.IsVisibleFrom(transform.renderer, Camera.main)) {
			IsActive();
		}
	}else{
		for (var shot : Shooting in shots) {						// Autofire for enemy
				if (shot != null && shot.CanAttack) {
		    	shot.Attack(true);
		    }
		}
		//Destriying enemy if it is outside the camera
		if (RendererHelpers.IsVisibleFrom(transform.renderer, Camera.main) == false) {
			Destroy(gameObject);
		}
	}
}

function IsActive () {	
	// Activating enemy components
	isActive = true;
	enemyMovement.enabled = true;
	health.enabled = true;
	for (var shot : Shooting in shots) {
		shot.enabled = true;
	}
}