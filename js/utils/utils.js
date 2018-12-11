function getGlobalVisionUnitsAtZ(z, sketch) {
    vFOV = THREE.Math.degToRad(sketch.camera.fov); // convert vertical fov to radians
    height = 2 * Math.tan(vFOV / 2) * z; // visible height
    width = height * sketch.camera.aspect;

    return {"fov": vFOV, "height": height, "width": width};
}