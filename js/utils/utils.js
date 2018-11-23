function getGlobalVisionUnitsAtZ(z) {
    vFOV = THREE.Math.degToRad(camera.fov); // convert vertical fov to radians
    height = 2 * Math.tan(vFOV / 2) * z; // visible height
    width = height * camera.aspect;

    return {"fov": vFOV, "height": height, "width": width};
}