#pragma strict

static public var music : boolean = true;
static public var sound : boolean = true;
static public var graphics : int = 1;
static public var interstatialIndx : int = 0;

static function MusicOn (bol : boolean) {
	music = bol;
	Camera.main.GetComponent(AudioSource).mute = !bol;
}

static function SoundOn (bol : boolean) {
	sound = bol;
}

static function GraphicsLevel (level : int) {
	graphics = level;
	QualitySettings.SetQualityLevel(level, true);
}

static function SaveOptions () {
	PlayerPrefs.SetInt("Graphics", graphics);
	PlayerPrefs.SetString("Music", music.ToString());
	PlayerPrefs.SetString("Sound", sound.ToString());
	PlayerPrefs.SetInt("Interstatial", interstatialIndx);
	PlayerPrefs.Save();
}

static function LoadOptions () {
	music = boolean.Parse(PlayerPrefs.GetString("Music"));
	sound = boolean.Parse(PlayerPrefs.GetString("Sound"));
	graphics = PlayerPrefs.GetInt("Graphics");
	interstatialIndx = PlayerPrefs.GetInt("Interstatial");
}

static function ApplyOptions () {
	MusicOn(music);
	SoundOn(sound);
	GraphicsLevel(graphics);
}

static function NumberOfStarsInZone(zone : String) {
	var totalStarNumber : int = 0;
	for (var i = 0; i < 10; i++) {
		var scoreLevelName : String = "StarsLevel_" + zone + i.ToString();
		if (PlayerPrefs.HasKey("Level_" + zone + i.ToString())) {
			totalStarNumber += PlayerPrefs.GetInt(scoreLevelName);
		}
	}
	return totalStarNumber;
}

static function InterstatialShow () {
	interstatialIndx = (interstatialIndx + 1) % 2;
	var result : boolean;
	if (interstatialIndx == 1) result = true;
	return result;
}