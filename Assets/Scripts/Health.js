#pragma strict

public var health : int = 1; 								// Global parameter for health
public var isEnemy : boolean = false;						// Global parameter for enemy - player recognition

function Damage (damage : int) {							// Reduction of health and destroying object if it below zero
	health -= damage;
	if (health <= 0) {
		Destroy(gameObject);
	}
}

function OnTriggerEnter2D (otherCollider : Collider2D) {	// Checking collision of shot and object
	var shot : ShotParameters = new otherCollider.gameObject.GetComponent.<ShotParameters>();
	if (shot != null) {
		if (isEnemy != shot.isEnemyShot) {
			Damage(shot.damage);
			Destroy(shot.gameObject);
		}
	}
}