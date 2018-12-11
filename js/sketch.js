//window.addEventListener("DOMContentLoaded", function () {setup();}, false);

class Sketch{
    constructor(numberOfgens, butPerGen){
        let mainContainer = $("#main");
        let appBar = $("#appbar");

        //Remove welcome message
        let mainContainerChild = mainContainer.children();
        mainContainerChild.remove();

        //Define canvas size
        let width = window.innerWidth;
        let height = window.innerHeight - appBar.height();

        //Init scene and camera
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xffffff);
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

        //Init renderer
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(width, height);
        mainContainer.append(this.renderer.domElement);

        //Globals vars high level
        this.frameCount = 0;
        this.blocList = [];
        this.ids = 0;
        this.stop = false;
        this.appBarText = $("#appbar-text");

        //Init genetic algorithm
        this.ga = new GeneticAlgorithm(numberOfgens, butPerGen, this);
    }

    /**
     * Create GA first population and add it to simulation before that
     */
    start(){
        this.stop = false;
        this.ga.generateFirstPopulation()
        this.resetSketch();
        this.animate();
    }

    stop(){
        this.stop = true;
    }

    animate () {
        if(this.stop)
            return;

        this.frameCount ++;

        //Limit bloc creation
        if(this.frameCount % 2 == 0){
            this.generateNewBloc(this.camera.position.z - dist_to_create_bloc);
        }

        //#### BLOC ###
        //Generate new bloc in front of the butterfly

        //Removes blocks that are no longer visible
        let blocToRemove = this.blocList.filter(bloc => bloc.position.z > this.camera.position.z);
        for(let i = 0; i < blocToRemove.length ; i++){
            let bloc = blocToRemove[i];
            this.blocList.splice(this.blocList.indexOf(bloc), 1);
            this.disposeSceneChild(bloc.cube)
        }


        //#### GA Butterfly ###
        //Move forward
        let population = this.ga.currentPopulation;
        for(let i = 0; i < population.length; i++){
            let elem = population[i];
            elem.goForward(0.1);
        }

        this.adjustCameraPosition();

        //Test for next generation
        if(this.ga.isPopulationDied()){
            this.ga.generateNextGeneration();
            this.resetSketch();
        }

        this.updateText();

        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame( this.animate.bind(this) );
    }

    /**
     * Generate a new random bloc and add it to the scene
     * @param z The distance to instantiate bloc
     * @returns {THREE.Mesh} The bloc's cube mesh
     */
    generateNewBloc(z) {
        let bloc = Bloc.createRandomBloc(z, this);

        this.blocList.push(bloc)
        this.scene.add(bloc.cube);

        return bloc.cube
    }


     //Adjust the camera position relative to butterflies

     adjustCameraPosition(){
        /*var max = 0;
        var index = 0;
        var population = ga.currentPopulation;
        for(let i = 0; i < population.length; i++){
            elem = population[i];
            if(elem.distance > max){
                max = elem.distance;
                index = i;
            }
        }

        let butterfly = population[index];
        camera.position.set(butterfly.position.x, butterfly.position.y, butterfly.position.z + dist_for_observation);*/
        this.camera.position.z -= 0.1;
    }

    disposeSceneChild(child){
        this.scene.remove(child);
        child.geometry.dispose();
        child.material.dispose();
        child = undefined;
    }

    /**
     * Remove all elements from the sketch and add new population from GA
     */
    resetSketch(){
        //Clear scene
        while(this.scene.children.length > 0){
            this.scene.remove(this.scene.children[0]);
        }

        //Clear bloc list and frame count
        this.frameCount = 0;
        this.blocList = [];

        //Add population to scene
        this.ga.currentPopulation.map(elem => this.scene.add(elem.sphere))

        //Reset camera
        this.camera.position.z = 5;
    }

    updateText(){
        let maxCurrent = - Math.floor(this.ga.getFarthestButterfly().distance);
        let totalMax = Math.floor(- this.ga.maxDistance);
        this.appBarText.text("Generation " + this.ga.genCount + " - Max distance: " + (totalMax != 0 ? totalMax : maxCurrent) + "  - Current gen max distance: " + maxCurrent);
    }
}









