    var guiSkin: GUISkin;
    var nativeVerticalResolution = 400.0;
    var isPaused : boolean = false;
    var camera:GameObject;
    var gui: GameObject;
     
     
     
     
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
    gui.SetActive(false);}//GUI hide
    
    if(isPaused == false)//Blur disabled
    { 
    Camera.main.GetComponent(Blur).enabled = false;
    Camera.main.GetComponent(Vignetting).enabled = false; //Vignetting disabled
    gui.SetActive(true);} //GUI unhide
    
     if(isPaused)
     {
    // RenderSettings.fogDensity = 1;
    if(GUI.Button (Rect((Screen.width)/2,260,80,20), "Quit", "button2"))
    {
    print("Quit!");
    Application.Quit();
    }
    if(GUI.Button (Rect((Screen.width)/2,360,80,20), "Restart", "button2"))
    {
    print("Restart");
    Application.LoadLevel("weapon_testing");
    Time.timeScale = 1.0;
    isPaused = false;
    }
    if(GUI.Button (Rect((Screen.width)/2,460,80,20), "Continue", "button2"))
    {
    print("Continue");
    Time.timeScale = 1.0;
    isPaused = false;
    }
    }
     
     
    }
     
     
    @script AddComponentMenu ("GUI/Pause GUI")