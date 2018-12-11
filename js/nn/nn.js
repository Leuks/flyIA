
class NNModel{
    constructor(inputSize, hiddenSize, outputSize){
        this.inputSize = inputSize;
        this.hiddenSize = hiddenSize;
        this.outputSize = outputSize;

        //Random weights
        this.inputWeights = tf.randomNormal([this.inputSize, this.hiddenSize]);
        this.outputWeights = tf.randomNormal([this.hiddenSize, this.outputSize]);
    }

    /**
     * Predict two values (movement left/right up/down) based on inputs from raycasts.
     * @param inputs Raycasts
     * @returns {*} An array of two decision scalar
     */
    predict(inputs){
        let output = tf.tidy(() => {
            let inputLayer = tf.tensor(Object.values(inputs), [1, this.inputSize], 'float32');
            let hiddenLayer = inputLayer.matMul(this.inputWeights).sigmoid();
            let outputLayer = hiddenLayer.matMul(this.outputWeights).sigmoid();
            return outputLayer.dataSync();
        });
        return output;
    }

    /**
     * Dispose brain weights
     */
    dispose(){
        this.inputWeights.dispose();
        this.outputWeights.dispose();
    }

    /**
     * Make crossover between two brains.
     * @param mateBrain The brain to crossover with.
     * @returns {NNModel[]} The two childs from crossover.
     */
    crossover(mateBrain){
        let parentAW1 = this.inputWeights.dataSync();
        let parentAW2 = this.outputWeights.dataSync();
        let parentBW1 = mateBrain.inputWeights.dataSync();
        let parentBW2 = mateBrain.outputWeights.dataSync();

        let pivot = Math.floor(Math.random() * parentAW1.length);
        let childAW1 = [...parentAW1.slice(0, pivot), ...parentBW1.slice(pivot, parentBW1.length)];
        let childAW2 = [...parentAW2.slice(0, pivot), ...parentBW2.slice(pivot, parentBW2.length)];
        let childBW1 = [...parentBW1.slice(0, pivot), ...parentAW1.slice(pivot, parentBW1.length)];
        let childBW2 = [...parentBW2.slice(0, pivot), ...parentAW2.slice(pivot, parentBW2.length)];

        let newNNA = new NNModel(this.inputSize, this.hiddenSize, this.outputSize);
        let newNNB = new NNModel(this.inputSize, this.hiddenSize, this.outputSize);

        let inputShape = newNNA.inputWeights.shape;
        let outputShape = newNNA.outputWeights.shape;


        newNNA.dispose();
        newNNB.dispose();

        newNNA.inputWeights = tf.tensor(childAW1, inputShape);
        newNNA.outputWeights = tf.tensor(childAW2, outputShape);
        newNNB.inputWeights = tf.tensor(childBW1, inputShape);
        newNNB.outputWeights = tf.tensor(childBW2, outputShape);

        return [newNNA, newNNB];
    }

    /**
     * Mak mutation on the brain to match with the idea of genetic algorithm and avoid local minimum
     */
    mutate(){
        function mut(x) {
            if (Math.random() < 0.05) {
                let offset = tf.randomNormal([1]).asScalar().dataSync()[0];
                let newx = x + offset;
                return newx;
            }
            return x;
        }

        let w1 = this.inputWeights.dataSync().map(mut);
        let w1Shape = this.inputWeights.shape;
        this.inputWeights.dispose();
        this.inputWeights = tf.tensor(w1, w1Shape);

        let w2 = this.outputWeights.dataSync().map(mut);
        let w2Shape = this.outputWeights.shape;
        this.outputWeights.dispose();
        this.outputWeights = tf.tensor(w2, w2Shape);
    }
}