    var guiSkin: GUISkin;
    var nativeVerticalResolution = 400.0;
    var isPaused : boolean = false;
    var camera:GameObject;
    var gui: GameObject;
    var guipause: GameObject;
     
     
     
     
    function Update()
    {
     
    if(Input.GetKeyDown("escape") && !isPaused)
    {
    print("Paused");
    Time.timeScale = 0.0;
    isPaused = true;
    }
    else if(Input.GetKeyDown("escape") && isPaused)
    {
    print("Unpaused");
    Time.timeScale = 1.0;
    isPaused = false;
    }
    }
     
    function OnGUI ()
    {
     
     
    // Set up gui skin
    GUI.skin = guiSkin;
     
    // Our GUI is laid out for a 1920 x 1200 pixel display (16:10 aspect). The next line makes sure it rescales nicely to other resolutions.
    GUI.matrix = Matrix4x4.TRS (Vector3(0, 0, 0), Quaternion.identity, Vector3 (Screen.height / nativeVerticalResolution, Screen.height / nativeVerticalResolution, 1));
     
     
    
    if(isPaused)
    {
    Camera.main.GetComponent(Blur).enabled = isPaused; // Blur aplied
    Camera.main.GetComponent(Vignetting).enabled = isPaused; // Vignetting aplied
    gui.SetActive(false);//GUI hide
    guipause.SetActive(true);}//GUI pause unhide
    
    if(isPaused == false)//Blur disabled
    { 
    Camera.main.GetComponent(Blur).enabled = false;
    Camera.main.GetComponent(Vignetting).enabled = false; //Vignetting disabled
    gui.SetActive(true); //GUI unhide
    guipause.SetActive(false);} //GUI pause hide
    
     
    
     
     
    }
     
     
    @script AddComponentMenu ("GUI/Pause GUI")