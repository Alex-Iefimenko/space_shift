#pragma strict

public var enemyExplosion : GameObject;
public var playerExplosion : GameObject;
public var hit : GameObject;
public var takingWeapon : GameObject;
public var takingLevel : GameObject;

private var targetObject : GameObject;
private var newEffect : GameObject;
private var newEffectParticleSystem : ParticleSystem;

function Update () {
	if (targetObject != null && newEffect != null) {
		newEffect.transform.position = targetObject.renderer.bounds.center;
		newEffectParticleSystem.transform.position = targetObject.renderer.bounds.center;
	}
}

function ApplyEffect (effect : String, position : Vector3, target : GameObject) {
	var currentEffect : GameObject; 
	switch (effect) {
		case "enemyExplosion":
			currentEffect = enemyExplosion;
			break;
		case "playerExplosion":
			currentEffect = playerExplosion;
			break;
		case "hit":
			currentEffect = hit;
			break;
		case "takingWeapon":
			currentEffect = takingWeapon;
			break;
		case "takingLevel":
			currentEffect = takingLevel;
			break;
	}
	targetObject = target;
	StartEffect(currentEffect, position);
}

private function StartEffect(effect : GameObject, position : Vector3 ){
	newEffect = Instantiate(effect, position, effect.transform.rotation) as GameObject;
	newEffectParticleSystem = newEffect.GetComponentInChildren.<ParticleSystem>();
	Destroy(newEffect, newEffectParticleSystem.startLifetime);
}