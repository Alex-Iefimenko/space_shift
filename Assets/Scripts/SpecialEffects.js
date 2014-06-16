#pragma strict

public var enemyExplosion : GameObject;
public var takingLevel : GameObject;

function ApplyEffect (effect : String, position : Vector3) {
	var currentEffect : GameObject; 
	switch (effect) {
		case "enemyExplosion":
			currentEffect = enemyExplosion;
			break;
		case "takingLevel":
			currentEffect = takingLevel;
			break;
	}
	StartEffect(currentEffect, position);
}

private function StartEffect(effect : GameObject, position : Vector3 ){
	var newEffect = Instantiate(effect, position, effect.transform.rotation) as GameObject;
	var newEffectParticleSystem = newEffect.GetComponentInChildren.<ParticleSystem>();
	//print (newEffect);
	Destroy(newEffect, newEffectParticleSystem.startLifetime);
}