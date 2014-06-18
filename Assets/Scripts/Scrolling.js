#pragma strict
import System.Collections.Generic;
import System.Linq;

public var speed = new Vector2(5, 5);								// Scrolling speed variable
public var direction = new Vector2(-1, 0);							// Scrolling direction variable
public var isLinkedToCamera : boolean = false;						// Variable for detecting whether camera will move with object
public var isLooping : boolean = false;  							// should have at least 2 child Renderer objects
public var hasParallax : boolean = false;							// Variable for adding paralax in object looping
private var backgroundParts : List.<Transform>;						// Helper variable for getting list of objects

function Start () {
	if (isLooping) {												// Getting list of renerer (can be visible) objects and sorting them 
		backgroundParts = new List.<Transform>();					// in oreder of position in x
		for (var i = 0; i < transform.childCount; i++) {
			var child : Transform = transform.GetChild(i);
			if (child.renderer != null) {
				backgroundParts.Add(child);
			}
		}
		backgroundParts = backgroundParts.OrderBy(function(a){return a.position.x;}).ToList();
	}
}

function Update () {
	var movement = new Vector3(										// Adding movement for object
		speed.x * direction.x,
		speed.y * direction.y,
		0);
	movement *= Time.deltaTime;
	transform.Translate(movement);
	
	if (isLinkedToCamera) {											// Move camera with object if its variable is enable
		Camera.main.transform.Translate(movement);
	}
	
	if (isLooping) {												// Adding looping transformation
		if (backgroundParts.Count >= 2) {
			var firstChild : Transform = backgroundParts.FirstOrDefault();
			var secondChild : Transform = backgroundParts[1];
			var lastChild : Transform = backgroundParts.LastOrDefault();			
			
			var horizontalParalax : float = 0;
			var verticalParalax : float = 0;
			if (firstChild != null) {								// Setting distance from first to second child objects
				var firstSecondDistance = secondChild.position.x - firstChild.position.x;
				
				if (hasParallax) {									// Adding random paralax to objects if it is needed
				    horizontalParalax = Random.Range(				// Random position between last and second objects 
						-0.5*(firstSecondDistance - firstChild.renderer.bounds.extents.x - secondChild.renderer.bounds.extents.x), 
						0.5*(firstSecondDistance - firstChild.renderer.bounds.extents.x - secondChild.renderer.bounds.extents.x)
					);
					verticalParalax = Random.Range(					// Random position in camera vertival size
						Camera.main.ViewportToWorldPoint(new Vector3(0.0, 0.0, 0.5)).y - firstChild.position.y, 
						Camera.main.ViewportToWorldPoint(new Vector3(1.0, 1.0, 0.5)).y - firstChild.position.y
					);
				}
				// Moving object to new position if it is not visible from Camera
				var verticalSeen : float  = Camera.main.orthographicSize * 2.0f;
        		var horizontalSeen : float = verticalSeen * Screen.width / Screen.height;
				
				if (firstChild.renderer.bounds.max.x < (Camera.main.transform.position.x - horizontalSeen / 2)) {
					if (RendererHelpers.IsVisibleFrom(firstChild.renderer, Camera.main) == false) {
										
						firstChild.position = new Vector3 (
						lastChild.position.x + firstSecondDistance + horizontalParalax, 
						firstChild.position.y + verticalParalax, 
						firstChild.position.z
						);
						backgroundParts.Remove(firstChild);
	            		backgroundParts.Add(firstChild);
					}	
				}
			}
		}
	}
}
