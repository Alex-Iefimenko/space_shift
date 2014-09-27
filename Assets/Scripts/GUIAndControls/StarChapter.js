#pragma strict

function OnEnable () {
	StarNumberCount();
}

function StarNumberCount () {

	var zoneName : String = this.transform.parent.gameObject.name;
	var zoneNumber : int = int.Parse(zoneName[-1:]);
	
	if (!PlayerPrefs.HasKey(zoneName) && PlayerPrefs.GetInt(zoneName) == 0) {
		this.gameObject.SetActive(false);
	} else {
		var totalStarNumber : int = Options.NumberOfStarsInZone(zoneNumber.ToString());
		var starTextToDisplay : String = "0" * (2 - totalStarNumber.ToString().length) + totalStarNumber.ToString() + "/30";
		this.GetComponentInChildren.<GUIText>().text = starTextToDisplay;
	}
}