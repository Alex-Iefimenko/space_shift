//var scriptControllerGUI : ControllerGUI ;
private var scriptControllerGUI : MonoBehaviour;

private var imageNormal : Texture;

var functionOnTouchDown : String = null;

var imageOver : Texture;
var isOverImage : boolean = false;
var inactiveImage : Texture;

private var lastFingerId : int = -1;
private var guiTextureCurrent : GUITexture;

private var touch : Touch;
private var touchPositionFinger : Vector2;
private var isHitOnGui : boolean;
public var hasTouchOnGui: boolean;
private var isResetPreviously : boolean = true; //initially, system has already reset.
private var isActive : boolean = true;

function Awake (){
	guiTextureCurrent = this.guiTexture;
	imageNormal = guiTexture.texture;
}

function OnGUI () {
	if (isActive) { TouchControl(); }
}

function Reset()
{
	//nothing is touched
	lastFingerId = -1;
	if(imageNormal){ //Change back to normal image if there is already over image!
		this.guiTexture.texture = imageNormal; //normal image
		isOverImage = false;
	}
}

function TouchControl(){
	var touchCount : int = Input.touchCount;
	if ( touchCount > 0 ){
		isResetPreviously = false;
		hasTouchOnGui = false;
		for(var touchIndex:int = 0; touchIndex < touchCount; touchIndex++){
				touch = Input.GetTouch(touchIndex);			
				touchPositionFinger = touch.position;
				isHitOnGui = guiTexture.HitTest(touchPositionFinger);
				
				//Started Touch
				if( isHitOnGui && touch.phase == TouchPhase.Began && ( lastFingerId == -1 ) ){ 	 
					lastFingerId = touch.fingerId;
					hasTouchOnGui = true;
					
					if(imageOver){ //over image
						this.guiTexture.texture = imageOver; //over image
						isOverImage = true;
					}
					if(functionOnTouchDown != ""){
						gameObject.SendMessage(functionOnTouchDown);
					}
					
				}
				
				//Touched Previously and still inside the button
				else if ( isHitOnGui && (touch.phase == TouchPhase.Began ||touch.phase == TouchPhase.Moved || touch.phase == TouchPhase.Stationary) && ( lastFingerId == touch.fingerId ) ){ 
					hasTouchOnGui = true;
				}
				
				//Touched Previously and now touch is outside the button
				else if ( !isHitOnGui && (touch.phase == TouchPhase.Moved || touch.phase == TouchPhase.Stationary) && ( lastFingerId == touch.fingerId ) ){ 
					Reset();
					isResetPreviously = true;
				}
				
				//Touch Up Inside
				else if ( isHitOnGui &&  (touch.phase == TouchPhase.Ended || touch.phase == TouchPhase.Canceled) && ( lastFingerId == touch.fingerId ) ){
					Reset();
					isResetPreviously = true;
					
				}
				
				//Touch Up Outside
				else if ( !isHitOnGui &&  (touch.phase == TouchPhase.Ended || touch.phase == TouchPhase.Canceled) && ( lastFingerId == touch.fingerId ) ){ 
					Reset();
					isResetPreviously = true;
				}		
		}
			
		if(!hasTouchOnGui && !isResetPreviously){ // If there isn't touch or there was touch but not with given fingerid then we release the touched button 
			Reset();
			isResetPreviously = true;
		}
		else{ //There is touch on this button
			//do nothing
		}
	}
	else if(!isResetPreviously) //There is no touch, so we reset the button config (for performence optimization it is done once for each touch by flag isResetPreviously)
	{
		Reset();
		isResetPreviously = true;
	}
	else{

	}
}

function SetInactive (bol : boolean) {
	isActive = bol;
	if (isActive) { 
		Reset(); 
	} else {
		guiTexture.texture = inactiveImage; 
	}
	//print (isActive);
	//print (guiTexture.texture);
}