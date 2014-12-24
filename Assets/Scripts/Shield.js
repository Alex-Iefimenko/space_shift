#pragma strict

private var animator : Animator;
private var shieldTime : float = 0f;
private var render : SpriteRenderer;
private var master : String;

function Awake () {
	animator = GetComponent.<Animator>();
	render = GetComponentInChildren.<SpriteRenderer>();
	master = gameObject.GetComponentInParent.<Health>().tag;
}


function Update () {
	if (shieldTime > 0) {
		shieldTime -= Time.deltaTime;
	}
	
	if (shieldTime > 0 && shieldTime <= 2.9f && master == "Player") {
		animator.SetInteger("State", 1);
	}
	
	if (shieldTime <= 0 && renderer.enabled == true) {
		StartShield (false);
	}
}

function Shield (shieldLength : float) {
	shieldTime = shieldLength;
	StartShield(true);
	if (animator) animator.SetInteger("State", 0);
}

function StartShield (isEnabled : boolean) {
	renderer.enabled = isEnabled;
}

function OnTriggerEnter2D (otherCollider : Collider2D) {
	var attackField : AttackField = new otherCollider.gameObject.GetComponent.<AttackField>();
	if (attackField != null) {
		var player : GameObject = this.gameObject.GetComponentInParent.<PlayerScript>().gameObject;
		var direction : Vector2 = Vector2(-1, 0);
		player.rigidbody2D.AddForce(direction, ForceMode2D.Impulse);
	}
}

function StartShieldEnd () {
	if (animator) animator.SetInteger("State", 1);
	if (this.gameObject.tag == "Player") shieldTime = 2.9f;
	else shieldTime = 0f;
}