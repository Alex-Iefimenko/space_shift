#pragma strict

public var damage : int;
public var attackRate : float;
private var atackCooldown : float;
private var isEnemy : boolean;

function Start () {
	isEnemy = this.gameObject.GetComponentInParent.<Health>().isEnemy;
}

function Update () {
	if (atackCooldown > 0f) atackCooldown -= Time.deltaTime;
}

function OnTriggerStay2D (otherCollider : Collider2D) {
	var targetHealth : Health = otherCollider.gameObject.GetComponent.<Health>();
	if (atackCooldown <= 0f && targetHealth.isEnemy != isEnemy) {
		targetHealth.Damage(damage);
		atackCooldown = attackRate;
	}
}


