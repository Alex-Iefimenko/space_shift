#pragma strict

private var animator : Animator;
private var shieldTime : float = 0f;
private var render : SpriteRenderer;


function Awake () {
	animator = GetComponent.<Animator>();
	render = GetComponentInChildren.<SpriteRenderer>();
}


function Update () {
	if (shieldTime > 0) {
		shieldTime -= Time.deltaTime;
	}
	
	if (shieldTime > 0 && shieldTime <= 2.9f) {
		animator.SetInteger("State", 1);
	}
	
	if (shieldTime <= 0 && renderer.enabled == true) {
		StartShield (false);
	}
}

function Shield (shieldLength : float) {
	shieldTime = shieldLength;
	StartShield(true);
	animator.SetInteger("State", 0);
}

function StartShield (isEnabled : boolean) {
	renderer.enabled = isEnabled;
}
