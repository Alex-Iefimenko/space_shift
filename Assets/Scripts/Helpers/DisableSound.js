#pragma strict

private var sounds : AudioSource[];

function Awake () {
	sounds = GetComponents.<AudioSource>();
	if (!Options.sound && sounds) {
		for (var sound in sounds) sound.enabled = false;
	}
}