
class Butterfly {

    constructor(position, width, height, raycastList){
        this.position = position;
        this.velocity = 0.2;
        this.gravity = 0.7;
        this.wingsSize = 40;

        //Define sphere
        let meshMaterial = new THREE.MeshBasicMaterial({ color : 0x000000, wireframe : true });
        let meshGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        let mesh = new THREE.Mesh(meshGeometry, meshMaterial);

        mesh.position.copy(this.position);

        this.sphere = mesh;

        this.raycasts = raycastList;
    }

    static createNewButterfly(){
        let visionUnits = getGlobalVisionUnitsAtZ(dist_to_create_butterfly);
        let width = visionUnits["width"];
        let height = visionUnits["height"];

        let position = new THREE.Vector3(width / 2, height / 2, -dist_to_create_butterfly)

        let directionsList = [{"name": "up", "direction": new THREE.Vector3(0, 1, 0)}, {"name": "upright", "direction": new THREE.Vector3(1, 1, 0)},{"name": "right", "direction": new THREE.Vector3(1, 0, 0)},
            {"name": "downright", "direction": new THREE.Vector3(1, -1, 0)},{"name": "down", "direction": new THREE.Vector3(1, -1, 0)},{"name": "downleft", "direction": new THREE.Vector3(-1, -1, 0)},
            {"name": "left", "direction": new THREE.Vector3(-1, 0, 0)},{"name": "upleft", "direction": new THREE.Vector3(-1, 1, 0)},
            {"name": "updiag", "direction": new THREE.Vector3(0, 1, -1)}, {"name": "uprightdiag", "direction": new THREE.Vector3(1, 1, -1)},{"name": "rightdiag", "direction": new THREE.Vector3(1, 0, -1)},
            {"name": "downrightdiag", "direction": new THREE.Vector3(1, -1, -1)},{"name": "downdiag", "direction": new THREE.Vector3(1, -1, -1)},{"name": "downleftdiag", "direction": new THREE.Vector3(-1, -1, -1)},
            {"name": "leftdiag", "direction": new THREE.Vector3(-1, 0, -1)},{"name": "upleftdiag", "direction": new THREE.Vector3(-1, 1, -1)},
            {"name": "front", "direction": new THREE.Vector3(0, 0, -1)}];

        var raycastList = [];
        for(let i=0; i < directionsList.length; i++){
            let direction = directionsList[i];
            raycastList.push({"name": direction["name"], "ray": new THREE.Raycaster(position, direction["direction"])});
        }

        return new Butterfly(position, width, height, raycastList);
    }

    setPosition(x, y ,z){
        this.position.set(x, y, z);
        this.sphere.position.set(x, y, z);
    }

    goForward(count){
        this.position.set(this.position.x, this.position.y, this.position.z - count);
        this.sphere.position.set(this.position.x, this.position.y, this.position.z - count);
    }

    goLeft(){
        this.x -= 20;
    }

    goRigth(){
        this.x += 20;
    }

    goUp(){
        this.y -= 20;
    }

    goDown(){
        this.y += 20;
    }

    updateIntersection(){
        var collisions = [];
        for(let i=0; i < this.raycasts.length; i++){
            let raycast = this.raycasts[i];
            let collisionResults = raycast["ray"].intersectObjects(blocList.map(bloc => bloc.cube), true);
            if(collisionResults.length > 0)
                collisions.push({"name": raycast["name"], "ray": collisionResults[0].distance});
        }
        return collisions;
    }

}