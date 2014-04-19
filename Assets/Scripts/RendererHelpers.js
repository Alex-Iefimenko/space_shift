#pragma strict

// Helper function for detection if object is visible from camera
static function IsVisibleFrom(renderer : Renderer, camera : Camera) : boolean
{
    var planes = GeometryUtility.CalculateFrustumPlanes(camera);
	return GeometryUtility.TestPlanesAABB(planes, renderer.bounds);
}