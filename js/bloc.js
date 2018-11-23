
class Bloc{
    constructor(x, y, z, width, height, depth, color) {
        this.position = new THREE.Vector3(x, y ,z);

        //Define cube
        let meshMaterial = new THREE.MeshBasicMaterial({ color : color });
        let meshGeometry = new THREE.BoxGeometry(width, height, depth);
        let mesh = new THREE.Mesh(meshGeometry, meshMaterial);

        let edgeMaterial = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 2 } );
        let edgeGeometry = new THREE.EdgesGeometry(meshGeometry);
        let edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);

        mesh.add(edges);

        mesh.position.copy(this.position);

        this.cube = mesh;
    }

    static createRandomBloc(z) {
        let visionUnits = getGlobalVisionUnitsAtZ(dist_to_create_bloc);
        let width = visionUnits["width"];
        let height = visionUnits["height"];

        let randomWidth = Math.floor(Math.random() * width / 8) + width / 80;
        let randomHeight = Math.floor(Math.random() * height / 8) + height / 40;
        let randomDepth = Math.floor(Math.random() * 5) + 1;
        let randomX = Math.floor(Math.random() * width) - width / 2;
        let randomY = Math.floor(Math.random() * height) - height / 2;
        let randomColor = '#'+(Math.random()*0xFFFFFF<<0).toString(16);

        return new Bloc(randomX, randomY, z, randomWidth, randomHeight, randomDepth, randomColor);
    }

    setPosition(x, y ,z){
        this.position.set(x, y, z);
        this.cube.position.set(x, y, z);
    }

}
