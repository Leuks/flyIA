window.addEventListener("DOMContentLoaded", function () {setup();}, false);


function setup(){
    //Init scene and camera
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/ window.innerHeight, 0.1, 1000);

    //Init renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.getElementsByTagName("BODY")[0].appendChild(renderer.domElement);

    //globals vars high level
    frameCount = 0;
    blocList = [];

    //Init butterfly high level and add it to the scene
    butterfly = new Butterfly();
    scene.add(butterfly.sphere);

    animate();
}


function animate () {
    frameCount ++;

    //Limit bloc creation
    if(frameCount % 5 == 0){


    }

    //Move forward
    butterfly.goForward(0.5);
    adjustCameraPosition();

    generateNewBloc(camera.position.z - dist_to_create_bloc)

    //Removes blocks that are no longer visible
    blocToRemove = blocList.filter(bloc => bloc.position.z > butterfly.position.z);
    for(let i = 0; i < blocToRemove.length ; i++){
        let bloc = blocToRemove[i];
        blocList.splice(blocList.indexOf(bloc), 1);
        disposeSceneChild(bloc.cube)
    }

    renderer.render(scene, camera);
    requestAnimationFrame( animate );
}

function generateNewBloc(z) {
    let bloc = Bloc.createRandomBloc(z);

    blocList.push(bloc)
    scene.add(bloc.cube);

    return bloc.cube
}

function adjustCameraPosition(){
    camera.position.set(butterfly.position.x, butterfly.position.y, butterfly.position.z + dist_for_observation);
}

function disposeSceneChild(child){
    scene.remove(child);
    child.geometry.dispose();
    child.material.dispose();
    child = undefined;
}

document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (keyCode == 38) {
        camera.position.y += 0.1;
    } else if (keyCode == 40) {
        camera.position.y -= 0.1;
    } else if (keyCode == 37) {
        camera.position.x -= 0.1;
    } else if (keyCode == 39) {
        camera.position.x += 0.1;
    }
    console.log(event.which)
};

