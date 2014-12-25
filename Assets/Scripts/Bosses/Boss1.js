#pragma strict
import System.Collections.Generic;
import System.Linq;

private var movement : EnemyMovement;
private var health : Health;
private var stateSwitchAnim : boolean = false;
private var shots : List.<Shooting>;
private var colliders : PolygonCollider2D[];
private var letalShots : List.<Shooting> = new List.<Shooting>();
private var nonLetalShots : List.<Shooting> = new List.<Shooting>();
private var attackAlowed : boolean = true;
private var rendererComponent : SpriteRenderer;
private var isActive : boolean = false;
private var state : int = 2;
private var specialEffectsHendler : SpecialEffects;

// Weapon update
private var usualBomb : Shooting;
private var selfGuidedBomb : Shooting;
private var railGun : Shooting;

// States sprites
public var stateChangeExpolosion : int = 1;
public var stateFullSpeed : int = 3;
public var stateFirstTreshhold : float = 0.6;
public var stateHalf : Texture2D;
public var stateHalfSpeed : int = 7;
public var stateHalfShieldHP = 50;
public var stateSecondTreshhold : float = 0.25;
public var stateEnd : Texture2D;
public var stateEndSpeed : int = 10;

function Awake () {
	movement = GetComponent.<EnemyMovement>();					
	shots = GetComponentsInChildren.<Shooting>().ToList();
	health = GetComponent.<Health>();
	rendererComponent = GetComponent.<SpriteRenderer>();
	colliders = GetComponents.<PolygonCollider2D>();
	specialEffectsHendler = GameObject.FindGameObjectWithTag("HelperScripts").GetComponentInChildren.<SpecialEffects>();
	// Shots suites defined:
	for (var shot : Shooting in shots) {
		if (shot.gameObject.name.IndexOf('NonLetal') > -1) nonLetalShots.Add(shot);
		else if (shot.gameObject.name.IndexOf('UsualBomb') > -1) usualBomb = shot;
		else if (shot.gameObject.name.IndexOf('SelfGuidedBomb') > -1) selfGuidedBomb = shot;
		else if (shot.gameObject.name.IndexOf('RailGun') > -1) railGun = shot;
		else letalShots.Add(shot);
	}
}

function Start () {
	isActive = false;												// Disapling helper variable for enabling / disabling enemy
	movement.enabled = false;									    // Disabling EnemyMovement component
	health.enabled = false;											// Disabling Health component
	for (var shot : Shooting in shots) {							// Disabling all Shooting component component
		shot.enabled = false;
	}
	movement.speed = Vector2(stateFullSpeed, stateFullSpeed);
}

function Update () {
	if (!isActive && !stateSwitchAnim) {
		if (RendererHelpers.IsVisibleFrom(transform.renderer, Camera.main)) IsActive(true);
	} else if (health.enabled) {
		switch (state) {
			case 2: 
			BossOneFull();
				break;
			case 1:
			BossOneHalf();
				break;		
			case 0:
			BossOneEnd();
				break;
		}
	}
}


function BossOneFull () {
	for (var shot : Shooting in letalShots) {
		if (shot != null) shot.Attack(true);
	}
	nonLetalShots[Mathf.RoundToInt(Random.Range(0, nonLetalShots.Count))].Attack(true);
	for (var shot : Shooting in nonLetalShots) {
		if (shot.GetShotCoolDown() <= 0f) shot.UpdateShotCoolDown(shot.shootingRate);
	}
	if (health.health <= health.GetMaxHealth() * stateFirstTreshhold) SwitchState();
}

function BossOneHalf () {
	
	for (var shot : Shooting in letalShots) {
		if (shot != null) shot.Attack(true);
	}
	if (health.health <= health.GetMaxHealth() * stateSecondTreshhold) SwitchState();
}

function BossOneEnd () {
	// Railgun Apply
	if (railGun.GetShotCoolDown() <= 0f || movement.speed == Vector2(stateFullSpeed, stateFullSpeed) ) {
		movement.speed = Vector2(stateFullSpeed, stateFullSpeed);
		railGun.Attack(true);
		yield WaitForSeconds (railGun.burstLength * railGun.burstRate * 2.5f);		
		movement.speed += Vector2(stateEndSpeed, stateEndSpeed) * Time.deltaTime;
	} else {
		for (var shot : Shooting in letalShots) {
			if (shot != null) shot.Attack(true);
		}
		if (movement.speed.x < stateFullSpeed) movement.speed += Vector2(stateEndSpeed, stateEndSpeed) * Time.deltaTime;
	}

}

function IsActive (bol : boolean) {	
	// Activating enemy components
	health.enabled = bol;
	isActive = bol;
	movement.enabled = bol;
	for (var shot : Shooting in shots) {
		shot.enabled = bol;
	}
}

function SwitchState () {
	// Dicativate
	IsActive(false);
	stateSwitchAnim = true;
	// State update
	state -= 1;
	// Apply state switch effects
	for (var i : int = 0; i < 10; i++) {
		var placeCorrect1 : Vector2 = Vector3(rendererComponent.bounds.extents.x * Random.Range(0.1, 0.9), rendererComponent.bounds.extents.y * Random.Range(0.7, 1.0), 0);
		var placeCorrect2 : Vector2 = Vector3(rendererComponent.bounds.extents.x * Random.Range(0.1, 0.9), rendererComponent.bounds.extents.y * Random.Range(0.7, 1.0), 0);
		specialEffectsHendler.ApplyEffect("enemyExplosion"+stateChangeExpolosion.ToString(), transform.position + placeCorrect1, null);
		specialEffectsHendler.ApplyEffect("enemyExplosion"+stateChangeExpolosion.ToString(), transform.position - placeCorrect2, null);
		yield WaitForSeconds (0.25);
	}
	// Call State behaviour cange
	SwitchStateBehaviour (state);
	// Activate
	IsActive(true);
	stateSwitchAnim = false;
}

function SwitchStateBehaviour (state : int) {

	switch (state) {
		case 1:
			health.health = health.GetMaxHealth() * stateFirstTreshhold;
			rendererComponent.sprite = Sprite.Create(stateHalf, Rect(0, 0, stateHalf.width, stateHalf.height), Vector2(0.5f, 0.5f));
			health.shieldHealth = stateHalfShieldHP;
			health.Freeze(180f);
			letalShots.RemoveAt(0);
			letalShots.RemoveAt(letalShots.Count - 1);
			letalShots.Add(usualBomb);
			movement.speed = Vector2(stateHalfSpeed, stateHalfSpeed);
			colliders[0].enabled = false;
			colliders[1].enabled = true;			
			break;
		case 0:
			health.health = health.GetMaxHealth() * stateSecondTreshhold;
			rendererComponent.sprite = Sprite.Create(stateEnd, Rect(0, 0, stateEnd.width, stateEnd.height), Vector2(0.5f, 0.5f));
			transform.localScale = Vector3(stateHalf.width * transform.localScale.x / stateEnd.width, stateHalf.width * transform.localScale.y / stateEnd.width, 1);
			movement.speed = Vector2(stateEndSpeed, stateEndSpeed);
			letalShots.Remove(usualBomb);
			colliders[1].enabled = false;
			colliders[2].enabled = true;
			// Weapon update
			for (var i : int = 0; i < 2; i++) {
				letalShots[i].isBurst = true;
				letalShots[i].shootingRate = 1.0f;
				letalShots[i].transform.position = nonLetalShots[i].transform.position;
			}
			letalShots.Add(selfGuidedBomb);
			railGun.UpdateShotCoolDown(railGun.shootingRate);
			break;
	}	
}