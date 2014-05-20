#pragma strict
import System.Collections.Generic;
import System.Linq;

public var currentLevel : int = 1;
private var shots : List.<Shooting>;						// Getting all attached Shooting component
private var firing : PlayerScript;

function Awake () {
	shots = GetComponentsInChildren.<Shooting>().OrderBy(function(a){return a.name;}).ToList();
}

function Fire (isEnemy : boolean) {
	for (var shot : Shooting in shots) {						
		if (shot != null && shot.enabled == true) {
	   		shot.Attack(isEnemy);
	   	}
	}
}

function GunLevel (level : int) {
	var gunNumberEnambleArray = new int[0]; 					// Creating Array with number of guns which will be enabled;
	switch (level) {											// Setting array
		case 0:
			gunNumberEnambleArray = [];
			break;
		case 1: 
			gunNumberEnambleArray = [0];
			break;
		case 2:	
			gunNumberEnambleArray = [0, 1];
			break;
		case 3:
			gunNumberEnambleArray = [2, 3, 4];
			break;
		case 4:
			gunNumberEnambleArray = [0, 1, 3, 4];
			break;
		//default:
		//	gunNumberEnambleArray = [0, 1, 3, 4];
		//	break;
	}
	for (var shot : Shooting in shots) {						// Disabling all current guns
		shot.enabled = false;
	}
	for (var x : int in gunNumberEnambleArray) {				// Enabling neccessary guns
			if (shots.Count > x) {
				if (shots[x] != null) {
					shots[x].enabled = true;
					shots[x].currentLevel = level;
				}
			}
	}
}