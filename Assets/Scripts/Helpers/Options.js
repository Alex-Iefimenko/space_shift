#pragma strict

static public var music : boolean = true;
static public var sound : boolean = true;
static public var graphics : int = 1;

static function MusicOn (bol : boolean) {
	music = bol;
	Camera.main.GetComponent(AudioSource).mute = !bol;
}

static function SoundOn (bol : boolean) {
	sound = bol;
}

static function GraphicsLevel (level : int) {
	graphics = level;
}

static function SaveOptions () {

}