#pragma strict

public var damage : int = 1;							// Damage of shot
public var isEnemyShot : boolean = false;				// Global parameter for enemy - player recognition
public var speed = new Vector2(3, 3);					// Speed of shot
public var direction = new Vector2(1, 0);				// Direction of shot
public var blastRadius : float;
public var blastSpeed : float = 70;
public var blastWave : Sprite;

private var blastDistance : float;
private var isBlast : boolean = false;
private var cirCol : CircleCollider2D;

function Start () {
	var dist : float = (transform.position - Camera.main.transform.position).z;
	blastDistance = transform.position.x + (Camera.main.ViewportToWorldPoint(Vector3(1,0,dist)).x - transform.position.x) * 0.55;
	cirCol = this.GetComponent(CircleCollider2D);
	cirCol.enabled = false;
	if (blastRadius == 0) {
		blastRadius = Camera.main.ViewportToWorldPoint(Vector3(1,0,dist)).x - Camera.main.ViewportToWorldPoint(Vector3(0,0,dist)).x;
	}
	
}

function Update () {
	if (transform.position.x <= blastDistance) {
		var movement = new Vector3(speed.x * direction.x, speed.y * direction.y, 0);
		movement *= Time.deltaTime;
		transform.Translate(movement);
	} else if (transform.position.x >= blastDistance && isBlast == false) { 
		Blast();
	} else if (isBlast && renderer.bounds.size.x / 2 <= blastRadius) {
		transform.localScale += Vector3(blastSpeed * Time.deltaTime, blastSpeed * Time.deltaTime,0);
	} else if (renderer.bounds.size.x / 2 >= blastRadius) {
		Destroy(gameObject);
	}
}

function Blast() {
	isBlast =true;
	this.GetComponent(SpriteRenderer).sprite = blastWave;
	cirCol.enabled = true;
}

function OnTriggerEnter2D (otherCollider : Collider2D) {	// Checking collision of shot and object
	var enemy : Health = new otherCollider.gameObject.GetComponent.<Health>();
	if (enemy != null && RendererHelpers.IsVisibleFrom(enemy.transform.renderer, Camera.main)) {
		if (isEnemyShot != enemy.isEnemy) {
				enemy.Damage(damage);
		}
	}
}