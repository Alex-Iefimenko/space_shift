#pragma strict
import System.Collections.Generic;
import System.Linq;

public var health : int = 1; 								// Global parameter for health
public var isEnemy : boolean = false;						// Global parameter for enemy - player recognition
public var scoreValue : int;

private var scoreGUI : Score;

private var maxHealth : int;
private var isFreezed : boolean = false;
private var freezeTime : float; 

public var enemyExplosionVersion : int = 1;

private var specialEffectsHendler : SpecialEffects;
private var shield : Shield;
private var circleCollider : CircleCollider2D;
private var shiedlEnabled : boolean = false;
private var rollBackTime : float;
private var rollBackVector : Vector2 = Vector2(0,0);
public var isKamikadze : boolean = false;
public var kamikadzeDamage : int = 0;

// Enemy shield
public var shieldHealth : int = 0;

function Awake() {
	scoreGUI = GameObject.FindGameObjectWithTag("ScoreHendler").GetComponentInChildren.<Score>();
	specialEffectsHendler = GameObject.FindGameObjectWithTag("HelperScripts").GetComponentInChildren.<SpecialEffects>();
	
	shield = GetComponentInChildren.<Shield>();
	circleCollider = GetComponentInChildren.<CircleCollider2D>();
	maxHealth = health;
}

function Start () {
	if (shieldHealth > 0) Freeze(120f);
}

function Update () {
	if (freezeTime > 0) { freezeTime -= Time.deltaTime; }
	if (shiedlEnabled == true && freezeTime <= 0) { ShieldDiasble(); }
}

function FixedUpdate () {
	if (rollBackTime > 0) {
		transform.position += rollBackVector * Time.deltaTime;
		
		rollBackTime -= Time.deltaTime;
	}
}

function Damage (damage : int) {							// Reduction of health and destroying object if it below zero
	if (freezeTime <= 0) 
	{ 
		health -= damage;
	}
	if (health <= 0) {
		Destroy(gameObject);
		if (isEnemy) {
			scoreGUI.SendMessage("ScoreIncrease", scoreValue);
			specialEffectsHendler.ApplyEffect("enemyExplosion"+enemyExplosionVersion.ToString(), transform.position, this.gameObject);
		} else {
			var place : Vector3 = Vector3(transform.position.x + renderer.bounds.size.x/2, transform.position.y, transform.position.z);
			specialEffectsHendler.ApplyEffect("playerExplosion", place, this.gameObject);
		}
	} else if (health > 0 && freezeTime <= 0){
		specialEffectsHendler.ApplyEffect("hit", place, this.gameObject);
	}
}

function OnTriggerEnter2D (otherCollider : Collider2D) {	// Checking collision of shot and object
	var shot : ShotParameters = new otherCollider.gameObject.GetComponent.<ShotParameters>();
	if (shot != null) {
		if (isEnemy != shot.isEnemyShot) {
			if (shiedlEnabled) {
				shot.isEnemyShot = !shot.isEnemyShot;
				shot.transform.rotation.eulerAngles.z = Random.Range(-160.0, 160.0);
				if (this.gameObject.tag == "Enemy") { 
					shot.transform.rotation.eulerAngles.z -= 180;
					shieldHealth -= shot.damage;
					if (shieldHealth <= 0) ShieldDiasble();
				}
				shot.damage = Mathf.Floor(shot.damage / 4);

			} else {
				switch (shot.behaviourType) {
					case 4:
						TeleportToRandomPosition();
					break;
					case 6:
						ReduceMovementSpeed (shot.reduceCapabiliteisSec, 6);
					break;
					case 7:
						ReduceMovementSpeed (shot.reduceCapabiliteisSec, 7);					
					break;
					case 8:
						ReduceMovementSpeed (shot.reduceCapabiliteisSec, 8);
					break;
				}
				Damage(shot.damage);
				Destroy(shot.gameObject);
			}
		}
	}
	// Shield pullback
	var attackField : AttackField = new otherCollider.gameObject.GetComponent.<AttackField>();
	if (attackField != null && shiedlEnabled) {
		if (otherCollider.bounds.center.x > this.collider2D.bounds.center.x) {
			rollBackVector.x = -14.0;
		} else {
			rollBackVector.x = 7.0;
		}
		if (otherCollider.bounds.center.y > this.collider2D.bounds.center.y) {
			rollBackVector.y = -1.0;
		} else {
			rollBackVector.y = 1.0;
		}
		
		rollBackTime = 1.0;
	}

}

function Repair(amount : int) {
	if (health + amount <= maxHealth) {
		health += amount;
	} else {
		health = maxHealth;
	}
}

function Freeze(shieldLength : float) {
	freezeTime = shieldLength;
	shield.Shield(shieldLength);
	circleCollider.enabled = true;
	shiedlEnabled = true;
}

function GetMaxHealth () {
	return maxHealth;
}

function ShieldDiasble() {
	shiedlEnabled = false;
	circleCollider.enabled = false;
	freezeTime = 0f;
	if (this.gameObject.tag == "Enemy") shield.StartShieldEnd();
}

function GetScore () {
	return scoreGUI.GetScore();
}

function GetScriptHelper () {
	return specialEffectsHendler;
}

function TeleportToRandomPosition () {
	var distance = (transform.position - Camera.main.transform.position).z;
	var leftBorder = Camera.main.ViewportToWorldPoint(
      new Vector3(0.01, 0.03, distance)
    ).x;
    var rightBorder = Camera.main.ViewportToWorldPoint(
      new Vector3(0.90, 0.03, distance)
    ).x;
    var bottomBorder = Camera.main.ViewportToWorldPoint(
      new Vector3(0.03, 0.055, distance)
    ).y;
    var topBorder = Camera.main.ViewportToWorldPoint(
      new Vector3(0.03, 0.965, distance)
    ).y;
    this.transform.position = Vector2(Random.Range(leftBorder, rightBorder), Random.Range(bottomBorder, topBorder));
}

function ReduceMovementSpeed (time : float, type : int) {
	if (this.gameObject.tag == "Player") {
		var player : PlayerScript = this.gameObject.GetComponent.<PlayerScript>();
		player.StartCapabilityLimit (time, type);
	} else if (this.gameObject.tag == "Enemy") {
		if (type == 6) { 
			var enemyMove : EnemyMovement = this.gameObject.GetComponent.<EnemyMovement>(); 
			enemyMove.StartMovementLimit(time);
		} else if (type == 7) { var enemy : EnemyScript = this.gameObject.GetComponent.<EnemyScript>(); 
			enemy.StartFiringLimit(time);
		}
		
	}
}