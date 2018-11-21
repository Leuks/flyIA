function setup() {
    createCanvas(screen.availWidth, screen.availHeight, WEBGL);

    //List of existing blocs
    blocList = [];


}

function draw() {
    clear();

    //world forward
    let fast = frameCount * 10;
    translate(0, 0, fast);

    //decrease the number of bloc
    if(fast % 10 == 0) {

        //create new bloc at a random position


        //create and register a new bloc into the list
        blocList.push(Bloc.createRandomBloc(fast));
    }


    //Show all blocs
    for (let i = 0; i < blocList.length ; i++) {
        bloc = blocList[i];

        //translate the bloc at the good position
        translate(bloc.x, bloc.y, -bloc.z);

        //show it
        blocList[i].show();

        //translate at the origin for the next bloc
        translate(-bloc.x, -bloc.y, bloc.z);
    }


}


    //TODO pop object when they are behind butterfly
