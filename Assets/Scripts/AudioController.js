#pragma strict
import System.Collections.Generic;

public var repairSound : AudioClip;
public var sheildSound : AudioClip;
public var powerUpSound : AudioClip;
public var slowMoSound : AudioClip;
public var newWeaponSound : AudioClip;
public var hitSound : AudioClip;
public var rocketHitSound : AudioClip;
public var bombLaunchSound : AudioClip;
public var destroySound : AudioClip;

@HideInInspector public var repairSoundSource : AudioSource;
@HideInInspector public var sheildSoundSource : AudioSource;
@HideInInspector public var powerUpSoundSource : AudioSource;
@HideInInspector public var slowMoSoundSource : AudioSource;
@HideInInspector public var newWeaponSoundSource : AudioSource;
@HideInInspector public var hitSoundSource : AudioSource;
@HideInInspector public var rocketHitSoundSource : AudioSource;
@HideInInspector public var bombLaunchSoundSource : AudioSource;
@HideInInspector public var destroySoundSource : AudioSource;

function Awake() {
	var i : int = 0;
	for (field in this.GetType().GetFields().ToList()) {
		if (field.GetValue(this) && field.GetValue(this).GetType() == AudioClip) {
			var val = GetType().GetField(field.Name + "Source");
			val.SetValue(this, AddAudio(field.GetValue(this), false, false, 1f, 300f));
		}
	}
}

function AddAudio(clip : AudioClip, loop : boolean, playAwake : boolean, vol : float, minDistance : float) : AudioSource { 
	// Added Audio Source with neccessary properties to gameObject
	var newAudio = gameObject.AddComponent(AudioSource); 
	newAudio.clip = clip; 
	newAudio.loop = loop; 
	newAudio.playOnAwake = playAwake; 
	newAudio.volume = vol; 
	newAudio.minDistance = minDistance;
	return newAudio; 
}

function PlayEffect (name : String) {
	var currentEffect = this.GetType().GetField(name + "Source").GetValue(this) as AudioSource;
	if (currentEffect && Options.sound) currentEffect.Play();
}