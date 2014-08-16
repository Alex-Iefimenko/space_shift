#pragma strict

public var damage : int = 1;							// Damage of shot
public var isEnemyShot : boolean = false;				// Global parameter for enemy - player recognition

public var blastRadius : float;
public var blastSpeed : float = 70;
private var cirCol : CircleCollider2D;
private var blastDistance : float;

function Start () {
	cirCol = this.GetComponent(CircleCollider2D);
	var dist : float = (transform.position - Camera.main.transform.position).z;
	if (blastRadius == 0) {
		blastRadius = Camera.main.ViewportToWorldPoint(Vector3(1,0,dist)).x - Camera.main.ViewportToWorldPoint(Vector3(0,0,dist)).x;
	}
	
	transform.localScale = Vector3(0,0,1);
}

function Update () {
	if (cirCol.renderer.bounds.size.x / 2 <= blastRadius) {
		transform.localScale += Vector3(blastSpeed * Time.deltaTime, blastSpeed * Time.deltaTime,0);
	} else if (cirCol.renderer.bounds.size.x / 2 >= blastRadius) {
		Destroy(gameObject);
	}
}

function OnTriggerEnter2D (otherCollider : Collider2D) {	// Checking collision of shot and object
	var enemy : Health = new otherCollider.gameObject.GetComponent.<Health>();
	if (enemy != null && RendererHelpers.IsVisibleFrom(enemy.transform.renderer, Camera.main)) {
		if (isEnemyShot != enemy.isEnemy) {
				enemy.Damage(damage);
		}
	}
}