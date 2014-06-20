#pragma strict
public var percentOfScreenHeight : float = 0.1;

function Awake () {
	SetScale ();
}

function SetScale () {

	var widthHeightScreenRatio : float = (Screen.width * 1.0)/(Screen.height * 1.0);
	var textureHeight : float = guiTexture.texture.height * 1.0;
	var textureWidth : float = guiTexture.texture.width * 1.0;
	var widthHeightTextureRatio : float = textureWidth / textureHeight;
	var yScale : float =  percentOfScreenHeight; // textureHeight;
	
	this.transform.localScale = new Vector3 (yScale / widthHeightScreenRatio * widthHeightTextureRatio, yScale, 1);
}