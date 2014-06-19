#pragma strict
public var textureRatio : Vector2 = Vector2(0.5, 0.5);

function Awake () {
	SetScale ();
}

function SetScale () {

	var widthHeightScreenRatio : float = (Screen.width * 1.0)/(Screen.height * 1.0);
	var textureHeight : float = guiTexture.texture.height * 1.0;
	var textureWidth : float = guiTexture.texture.height * 1.0;
	var widthHeightTextureRatio : float = textureWidth / textureHeight;
	var yScale : float = (Screen.height * 0.08) / textureHeight;
	
	print (Screen.width);
	print (Screen.height);
	
	print (widthHeightScreenRatio);
	print (textureHeight);
	print (textureWidth);
	print (widthHeightTextureRatio);
	print (yScale);
	
	this.transform.localScale = new Vector3 (yScale / widthHeightScreenRatio * widthHeightTextureRatio, yScale, 1);
}