
class Butterfly {

    constructor(width, height){
        this.position = new THREE.Vector3(width / 2, height / 2, -dist_to_create_butterfly);
        this.velocity = 0.2;
        this.gravity = 0.7;
        this.wingsSize = 40;

        //Define sphere
        let meshMaterial = new THREE.MeshBasicMaterial({ color : 0x000000, wireframe : true });
        let meshGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        let mesh = new THREE.Mesh(meshGeometry, meshMaterial);

        mesh.position.copy(this.position);

        this.sphere = mesh;
    }

    static createNewButterfly(){
        let visionUnits = getGlobalVisionUnitsAtZ(dist_to_create_butterfly);
        let width = visionUnits["width"];
        let height = visionUnits["height"];

        return new Butterfly(width, height);
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

}