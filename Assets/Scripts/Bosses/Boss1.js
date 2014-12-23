#pragma strict
import System.Collections.Generic;
import System.Linq;

private var movement : EnemyMovement;
private var health : Health;
private var shots : List.<Shooting>;
private var letalShots : List.<Shooting> = new List.<Shooting>();
private var nonLetalShots : List.<Shooting> = new List.<Shooting>();
private var attackAlowed : boolean = true;
private var rendererComponent : SpriteRenderer;
private var isActive : boolean = false;
private var state : int = 2;
private var specialEffectsHendler : SpecialEffects;

// States sprites
public var stateChangeExpolosion : int = 1;
public var stateFullSpeed : int = 3;
public var stateFirstTreshhold : float = 0.6;
public var stateHalf : Texture2D;
public var stateHalfSpeed : int = 7;
public var stateSecondTreshhold : float = 0.25;
public var stateEnd : Texture2D;
public var stateEndSpeed : int = 10;

function Awake () {
	movement = GetComponent.<EnemyMovement>();					
	shots = GetComponentsInChildren.<Shooting>().ToList();
	health = GetComponent.<Health>();
	rendererComponent = GetComponent.<SpriteRenderer>();
	specialEffectsHendler = GameObject.FindGameObjectWithTag("HelperScripts").GetComponentInChildren.<SpecialEffects>();
	// Shots suites defined:
	for (var shot : Shooting in shots) {
		if (shot.gameObject.name.IndexOf('NonLetal') > -1) nonLetalShots.Add(shot);
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
}

function Update () {
	if (!isActive) {
		if (RendererHelpers.IsVisibleFrom(transform.renderer, Camera.main)) IsActive();
	} else {
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
	
	if (health.health <= health.GetMaxHealth() * stateSecondTreshhold) SwitchState();
}

function BossOneEnd () {


}

function IsActive () {	
	// Activating enemy components
	health.enabled = true;
	isActive = true;
	movement.enabled = true;
	movement.speed = Vector2(stateFullSpeed, stateFullSpeed);
	for (var shot : Shooting in shots) {
		shot.enabled = true;
	}
}

function SwitchState () {
	state -= 1;
	var placeCorrect : Vector2 = Vector3(0, rendererComponent.bounds.extents.y * 0.9, 0);
	specialEffectsHendler.ApplyEffect("enemyExplosion"+stateChangeExpolosion.ToString(), transform.position + placeCorrect, null);
	specialEffectsHendler.ApplyEffect("enemyExplosion"+stateChangeExpolosion.ToString(), transform.position - placeCorrect, null);
	switch (state) {
		case 1:
			rendererComponent.sprite = Sprite.Create(stateHalf, Rect(0, 0, stateHalf.width, stateHalf.height), Vector2(0.5f, 0.5f));
			break;
		case 0:
			rendererComponent.sprite = Sprite.Create(stateEnd, Rect(0, 0, stateEnd.width, stateEnd.height), Vector2(0.5f, 0.5f));
			transform.localScale = Vector3(stateHalf.width * transform.localScale.x / stateEnd.width, stateHalf.width * transform.localScale.y / stateEnd.width, 1);
			break;
	}	
}