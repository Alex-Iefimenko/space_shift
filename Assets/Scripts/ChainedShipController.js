#pragma strict
import System.Collections.Generic;
import System.Linq;

public var stableSpeed : Vector2 = Vector2(5, 5);

private var ships : List.<Health>;
private var chain : PolygonCollider2D;
private var chainSprite : Transform;
private var awakeDistanceX : float;
private var awakeDistanceY : float;
private var defaultMovement : int;
private var isAlive : boolean = true;
private var isEnabled : boolean = false;
private var isActive : boolean = false;
private var leftShip : GameObject;

function Start () {
	// Set Ships
	// [0] - lower
	// [1] - upper
	ships = this.gameObject.GetComponentsInChildren.<Health>().OrderBy(function(a){return a.gameObject.transform.position.y;}).ToList();
	for (var ship : Health in ships) {
		defaultMovement = ship.gameObject.GetComponent.<EnemyMovement>().movementPattern;
		ship.gameObject.GetComponent.<EnemyMovement>().movementPattern = 20;
		ship.gameObject.GetComponent.<EnemyScript>().AllowAttack(true);
	}
	if (ships[0].transform.position.x > ships[1].transform.position.x) leftShip = ships[1].gameObject;
	if (ships[0].transform.position.x <= ships[1].transform.position.x) leftShip = ships[0].gameObject;
	// Set Chains collider
	chain = this.gameObject.GetComponentInChildren.<PolygonCollider2D>();
	chain.gameObject.SetActive(false);
	// Set Sprite position and scale
	var chainSprites : Transform[] = this.gameObject.GetComponentsInChildren.<Transform>();
	for (var sprite : Transform in chainSprites) {
		if (sprite.gameObject.name == "ChainSprite") chainSprite = sprite;
	}
	chainSprite.gameObject.SetActive(false);
	//Set Awake distance
	var dist : float = (transform.position - Camera.main.transform.position).z;
	awakeDistanceY = Camera.main.ViewportToWorldPoint(Vector3(0,1,dist)).y - Camera.main.ViewportToWorldPoint(Vector3(0,0.5,dist)).y;
	awakeDistanceX = ships[0].renderer.bounds.size.x;
	
}

function Update () {
	var dist : float = (transform.position - Camera.main.transform.position).z;
	var cameraBorderRight = Camera.main.ViewportToWorldPoint(Vector3(1,0,dist)).x;
	if (!isActive && leftShip.renderer.bounds.min.x <= cameraBorderRight) {
		isActive = true;
	}
	if (isActive) {
		ShipsStateCheck();
		if (!isEnabled && isAlive) ChainEnableCheck();
		if (isAlive) {
			MoveShips();
			if (isEnabled) UpdateChainPosition();
			if (isEnabled) UpdateChainColliderPosition();

		}
	}
}

function UpdateChainColliderPosition () {
	var shipSizeQuart : float = 0.5 * ships[0].renderer.bounds.extents.x;
	
	var newPoints : Vector2[] = [
								Vector2(ships[0].transform.localPosition.x - shipSizeQuart, ships[0].transform.localPosition.y), 
								Vector2(ships[0].transform.localPosition.x + shipSizeQuart, ships[0].transform.localPosition.y),
								Vector2(ships[1].transform.localPosition.x + shipSizeQuart, ships[1].transform.localPosition.y),
								Vector2(ships[1].transform.localPosition.x - shipSizeQuart, ships[1].transform.localPosition.y)
								];
	chain.points = newPoints;
}

function UpdateChainPosition () {
	var middle : Vector2 = Vector2((ships[0].transform.localPosition.x + ships[1].transform.localPosition.x) / 2.0, 
								 	(ships[0].transform.localPosition.y + ships[1].transform.localPosition.y) / 2.0);
	chainSprite.localPosition = middle;
	var currentSize : Vector2 = Vector2(chainSprite.renderer.bounds.size.x, chainSprite.renderer.bounds.size.y);
	var neccessarySizeY : float = Vector2.Distance(ships[0].renderer.bounds.center, ships[1].renderer.bounds.center);
	chainSprite.localScale = chainSprite.localScale * (neccessarySizeY / currentSize.y);	
	
	var direction : Vector3 = middle - ships[0].transform.localPosition;
	var angle : float = Vector3.Angle(direction, transform.up);
	chainSprite.transform.rotation.eulerAngles.z = angle;
}

function MoveShips () {
	var movementShip1 : Vector2 = Vector2(0, 0);
	var movementShip2 : Vector2 = Vector2(0, 0);
	// Set x movement
	if (ships[0].transform.localPosition.x > ships[1].transform.localPosition.x) { 
		movementShip1.x = -1.4 * stableSpeed.x * Time.deltaTime;
		movementShip2.x = -0.8 * stableSpeed.x * Time.deltaTime;
	} else if (ships[0].transform.localPosition.x < ships[1].transform.localPosition.x) { 
		movementShip1.x = -0.8 * stableSpeed.x * Time.deltaTime;
		movementShip2.x = -1.4 * stableSpeed.x * Time.deltaTime;
	} else if (ships[0].transform.localPosition.x == ships[1].transform.localPosition.x) {
		movementShip1.x = -1.0 * stableSpeed.x * Time.deltaTime;
		movementShip2.x = -1.0 * stableSpeed.x * Time.deltaTime;		
	}
	
	// Set y movement
	var yDistance : float = Mathf.Abs(ships[0].transform.position.y - ships[1].transform.position.y);
	if ( yDistance > awakeDistanceY ) { 
		movementShip1.y = stableSpeed.y * Time.deltaTime;
		movementShip2.y = -1.0 * stableSpeed.y * Time.deltaTime;
	} else if ( awakeDistanceY - yDistance >  awakeDistanceY * 0.05 ) { 
		movementShip1.y = -1.0 * stableSpeed.y * Time.deltaTime;
		movementShip2.y = stableSpeed.y * Time.deltaTime;
	}
	ships[0].transform.Translate(movementShip1);
	ships[1].transform.Translate(movementShip2);
}

function ShipsStateCheck () {
	var copyShips : List.<Health> = new List.<Health>(ships);
	for (var ship : Health in copyShips) {
		if (ship == null) ships.Remove(ship);
	}
	
	if (ships.Count() == 1 && isAlive) {
		isAlive = false;
		ships[0].gameObject.GetComponent.<EnemyMovement>().movementPattern = defaultMovement;
		ships[0].gameObject.GetComponent.<EnemyScript>().AllowAttack(true);
		Destroy(chainSprite.gameObject);
		Destroy(chain.gameObject);
	} else if (ships.Count() == 0) {
		isAlive = false;
		Destroy(this.gameObject);
	}
}

function ChainEnableCheck () {
	var yDistance : float = Mathf.Abs(ships[1].transform.position.y - ships[0].transform.position.y);
	var xDistance : float = Mathf.Abs(ships[0].transform.position.x - ships[1].transform.position.x);
	if (xDistance <= awakeDistanceX && yDistance <= awakeDistanceY ) {
		isEnabled = true;
		ships[0].gameObject.GetComponent.<EnemyScript>().AllowAttack(false);
		ships[1].gameObject.GetComponent.<EnemyScript>().AllowAttack(false);
		chainSprite.gameObject.SetActive(true);
		chain.gameObject.SetActive(true);
	}
}