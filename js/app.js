function checkGaParametersInputs(){
    let numberOfgens = parseInt($("#gencount").val());
    let butterfliesPerGeneration = parseInt($("#butpergen").val());

    if(!numberOfgens > 0 || numberOfgens < 0){
        alert("Number of generations must be > 0");
        return;
    }

    if(!butterfliesPerGeneration >= 100 || butterfliesPerGeneration < 100){
        alert("Number of butterflies per generations must be > 100");
        return;
    }

    startSimulation(numberOfgens, butterfliesPerGeneration);
}

function startSimulation(numberOfgens, butterfliesPerGeneration){
    let sketch = new Sketch(numberOfgens, butterfliesPerGeneration);
    sketch.start();
}

function startModel(weights){

}

function loadWeights(){
   let file = $("#input-weights").get(0).files[0];

    let reader = new FileReader();

    reader.onload = function(e) {
        let inputWeights = parse(reader.result.slice(0, getSize(reader.result)));
        let outputWeights = parse(reader.result.slice(getSize(reader.result), reader.byteLength));
        startModel([inputWeights, outputWeights])
    }

    reader.readAsArrayBuffer(file);
}