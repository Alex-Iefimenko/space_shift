#pragma strict

public var fadeTime : float = 3f;
public var newMelody : AudioClip;
private var currentCollider : BoxCollider2D;
private var startFade : boolean = false;
private var cameraSound : AudioSource;
private var currentVolumeLevel : float;

function Start () {
	currentCollider = GetComponent.<BoxCollider2D>();
	cameraSound = Camera.main.GetComponent.<AudioSource>();
	currentVolumeLevel = cameraSound.volume;
}

function Update () {
	if (startFade) {
		if (cameraSound.volume > 0f && cameraSound.clip != newMelody) {
			cameraSound.volume -= currentVolumeLevel / fadeTime * Time.deltaTime;
		} else if (cameraSound.volume <= 0f && cameraSound.clip != newMelody) {
			cameraSound.clip = newMelody;
			cameraSound.Play();
		} else if (cameraSound.volume <= currentVolumeLevel && cameraSound.clip == newMelody) {
			cameraSound.volume += currentVolumeLevel / fadeTime * Time.deltaTime;
		}
	}
}

function OnTriggerEnter2D (otherCollider : Collider2D) {			// Checking collision of Player and trigerzone
	var player : PlayerScript = new otherCollider.gameObject.GetComponent.<PlayerScript>();
	if (player) {
		startFade = true;
	}
}