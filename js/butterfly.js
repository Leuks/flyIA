class Butterfly {

    constructor(position, width, height, directionsList, sketch){
        this.sketch = sketch;
        this.position = position;
        this.directionList = directionsList;
        this.id = sketch.ids++;
        this.distance = 0;
        this.died = false;

        //Define sphere
        let meshMaterial = new THREE.MeshBasicMaterial({ color : 0x000000, wireframe : true });
        let meshGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        let mesh = new THREE.Mesh(meshGeometry, meshMaterial);


        let loader = new THREE.OBJLoader();
        this.sphere = new THREE.Group;

        // load a resource

            loader.load('models/MONARCH.OBJ',

                function ( object ) {
                    for(let i = 0; i < object.children.length; i++){
                        let child = object.children[i];
                        if ( child.isMesh ){
                            child.rotateX(-1,5708);
                            child.scale.set(10,10,10)
                            console.log(child)
                            this.sphere.add(child);
                        }
                    }

                    this.sphere.position.copy(this.position);
                }.bind(this),

                function ( xhr ) {
                    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
                },

                function ( error ) {
                    console.log( 'An error happened' );
                }
            )


        //this.sphere = object;
        //Init NN
        this.brain = new NNModel(brain_input_size, brain_hidden_size, brain_output_size);
    }


    /**
     * Create a new random butterfly
     * @returns {Butterfly}
     */
    static createNewButterfly(sketch){
        let parameters = Butterfly.createInitParameters(sketch);
        return new Butterfly(...parameters);
    }

    /**
     * Create all parameters for a butterfly from an existing brain
     * @returns {*[]}
     */
    static createNewButterflyWithBrain(sketch, brain){
        let parameters = Butterfly.createInitParameters(sketch);
        let butterfly = new Butterfly(...parameters);
        butterfly.brain.dispose();
        butterfly.brain = brain;
        return butterfly;
    }

    /**
     * Create all parameters for a butterfly from existing weights
     * @returns {*[]}
     */
    static createNewButterflyWithWeights(sketch, inputWeights, outputWeights){
        let parameters = Butterfly.createInitParameters(sketch);
        let butterfly = new Butterfly(...parameters);
        butterfly.brain.dispose();
        butterfly.brain.inputWeights = inputWeights;
        butterfly.brain.outputWeights = outputWeights;
        return butterfly;
    }

    /**
     * Create all parameters for a butterfly
     * @returns {*[]}
     */
    static createInitParameters(sketch){
        let visionUnits = getGlobalVisionUnitsAtZ(dist_to_create_butterfly, sketch);
        let width = visionUnits["width"];
        let height = visionUnits["height"];

        let position = new THREE.Vector3(0, 0, -dist_to_create_butterfly)

        let directionsList = [{"name": "up", "direction": new THREE.Vector3(0, 1, 0)}, {"name": "upright", "direction": new THREE.Vector3(1, 1, 0)},{"name": "right", "direction": new THREE.Vector3(1, 0, 0)},
            {"name": "downright", "direction": new THREE.Vector3(1, -1, 0)},{"name": "down", "direction": new THREE.Vector3(1, -1, 0)},{"name": "downleft", "direction": new THREE.Vector3(-1, -1, 0)},
            {"name": "left", "direction": new THREE.Vector3(-1, 0, 0)},{"name": "upleft", "direction": new THREE.Vector3(-1, 1, 0)},
            {"name": "updiag", "direction": new THREE.Vector3(0, 1, -1)}, {"name": "uprightdiag", "direction": new THREE.Vector3(1, 1, -1)},{"name": "rightdiag", "direction": new THREE.Vector3(1, 0, -1)},
            {"name": "downrightdiag", "direction": new THREE.Vector3(1, -1, -1)},{"name": "downdiag", "direction": new THREE.Vector3(1, -1, -1)},{"name": "downleftdiag", "direction": new THREE.Vector3(-1, -1, -1)},
            {"name": "leftdiag", "direction": new THREE.Vector3(-1, 0, -1)},{"name": "upleftdiag", "direction": new THREE.Vector3(-1, 1, -1)},
            {"name": "front", "direction": new THREE.Vector3(0, 0, -1)}];

        return [position, width, height, directionsList, sketch];
    }

    setPositionFromCoordinates(x, y ,z){
        this.position.set(x, y, z);
        this.updateSpherePosition();
    }

    /**
     * Set butterfly position from a THREE.Vector3 and update sphere position
     * @param vector A THREE.Vector3 which is the new position
     */
    setPositionFromVector3(vector){
        this.position = vector.clone();
        this.updateSpherePosition();
    }

    /**
     * Modify butterfly position forwards
     * @param count The distance to reach
     */
    goForward(count){
        if(!this.died){
            this.distance = this.position.z - count;

            this.position.set(this.position.x, this.position.y, this.distance);

            this.think();
        }
    }

    /**
     * Modify butterfly position to left
     */
    goLeft(){
        this.position.x -= 0.1;
        }

    /**
     * Modify butterfly position to right
     */
    goRight(){
        this.position.x += 0.1;
    }

    /**
     * Modify butterfly position upwards
     */
    goUp(){
        this.position.y -= 0.1;
    }

    /**
     * Modify butterfly position downwards
     */
    goDown(){
        this.position.y += 0.1;
    }

    /**
     * Ask the brain to make a decision
     */
    think(){
        let intersections = this.updateIntersection();

        if (intersections.length == this.brain.inputSize) {
            let distances = [];
            Object.values(intersections).map(function(value) {
                let distance = value["ray"];
                if(distance < 0.1){
                    this.die();
                }
                distances.push(value["ray"]);
            }.bind(this));

            let pred = this.brain.predict(distances);

            let widthPred = pred[0];
            let heightPred = pred[1];

            let visionUnits = getGlobalVisionUnitsAtZ(dist_to_create_butterfly, this.sketch);
            let width = visionUnits["width"] - 1;
            let height = visionUnits["height"] - 1;

            if(widthPred > 0.5 && this.position.x < width){
                this.goRight();
            }
            else if(widthPred <= 0.5 && this.position.x > -width){
                this.goLeft();
            }

            if(heightPred > 0.5 && this.position.y > -height){
                this.goUp();
            }
            else if(heightPred <= 0.5 && this.position.y < height){
                this.goDown();
            }
        }

        this.updateSpherePosition();
    }

    /**
     * Update raycasts distances
     * @returns {Array} An array of raycasts objects {name, distance} for each
     */
    updateIntersection(){
        let collisions = [];
        for(let i=0; i < this.directionList.length; i++){
            let direction = this.directionList[i];
            let raycast = new THREE.Raycaster(this.position, direction["direction"]);

            let collisionResults = raycast.intersectObjects(this.sketch.blocList.map(bloc => bloc.cube), true);
            if(collisionResults.length > 0)
                collisions.push({"name": direction["name"], "ray": collisionResults[0].distance});
            else
                collisions.push({"name": direction["name"], "ray": default_distance_value});
        }

        return collisions;
    }

    /**
     * Update sphere position based on butterfly position
     */
    updateSpherePosition(){
        this.sphere.position.set(this.position.x, this.position.y, this.position.z);
    }

    /**
     * Make crossover with another butterfly
     * @param mate The butterfly to crossover with
     * @returns {Butterfly[]}
     */
    crossover(mate){
        let childsBrains = this.brain.crossover(mate.brain);
        return [Butterfly.createNewButterflyWithBrain(this.sketch, childsBrains[0]), Butterfly.createNewButterflyWithBrain(this.sketch, childsBrains[1])];
    }

    /**
     * Make brain mutation
     */
    mutate(){
        this.brain.mutate();
    }

    /**
     * Kill the butterfly
     */
    die(){
        this.died = true;
        this.sketch.disposeSceneChild(this.sphere);
    }

    /**
     * Reset the butterfly to initial values
     */
    reset(){
        let parameters = Butterfly.createInitParameters(this.sketch);
        this.setPositionFromVector3(parameters[0]);
        this.died = false;
        this.distance = 0;
    }

}