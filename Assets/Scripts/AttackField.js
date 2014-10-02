#pragma strict

public var damage : int;
public var attackRate : float;
private var atackCooldown : float;

function Update () {
	if (atackCooldown > 0f) atackCooldown -= Time.deltaTime;
}

function OnTriggerStay2D (otherCollider : Collider2D) {
	var playerHealth : Health = otherCollider.gameObject.GetComponent.<Health>();
	if (atackCooldown <= 0f && playerHealth.isEnemy == false) {
		playerHealth.Damage(damage);
		atackCooldown = attackRate;
	}
}


