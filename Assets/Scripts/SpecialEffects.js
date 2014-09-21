#pragma strict

public var enemyExplosion1 : GameObject;
public var enemyExplosion2 : GameObject;
public var enemyExplosion3 : GameObject;
public var enemyExplosion4 : GameObject;
public var playerExplosion : GameObject;
public var hit : GameObject;
public var takingWeapon : GameObject;
public var takingLevel : GameObject;
public var takingRepair : GameObject;
public var takingFreeze : GameObject;
public var takingSlomo : GameObject;

private var targetObject : GameObject;
private var newEffect : GameObject;
private var newEffectParticleSystem : ParticleSystem;
private var speed : float = 4;

function Awake () {
	Options.ApplyOptions();
}

function Update () {
	if (targetObject != null && newEffect != null) {
		//newEffect.transform.position = targetObject.renderer.bounds.center;
		//newEffectParticleSystem.transform.position = targetObject.renderer.bounds.center;
		
		newEffect.transform.position = Vector3.MoveTowards(newEffect.transform.position, targetObject.renderer.bounds.center, speed * Time.deltaTime);
		newEffectParticleSystem.transform.position = Vector3.MoveTowards(newEffectParticleSystem.transform.position, targetObject.renderer.bounds.center, speed * Time.deltaTime);
		speed += Time.deltaTime;
	}
}

function ApplyEffect (effect : String, position : Vector3, target : GameObject) {
	var currentEffect : GameObject; 
	currentEffect = this.GetType().GetField(effect).GetValue(this) as GameObject;
	targetObject = target;
	StartEffect(currentEffect, position);
}

private function StartEffect(effect : GameObject, position : Vector3 ){
	newEffect = Instantiate(effect, position, effect.transform.rotation) as GameObject;
	newEffectParticleSystem = newEffect.GetComponentInChildren.<ParticleSystem>();
	StartEffectPosition();
	Destroy(newEffect, newEffectParticleSystem.startLifetime);
}

function StartEffectPosition() {
	if (targetObject != null && newEffect != null) {
		newEffect.transform.position = targetObject.renderer.bounds.center;
		newEffectParticleSystem.transform.position = targetObject.renderer.bounds.center;
	}
}

