class GeneticAlgorithm {
    constructor(numberOfgens, butPerGen, sketch) {
        this.size = butPerGen;
        this.sketch = sketch;
        this.numberOfGens = numberOfgens;

        this.genCount = 0;
        this.best = Butterfly.createNewButterfly(this.sketch);
        this.maxDistance = 0;

        this.pivot = (ga_best_precent * this.size) / 100;
        this.currentPopulation = [];
    }

    /**
     * Generate the first population with random butterflies
     */
    generateFirstPopulation() {
        for(let i = 0; i < this.size; i++){
            this.currentPopulation.push(Butterfly.createNewButterfly(this.sketch));
        }

        this.genCount ++;
        //this.updateText();
    }

    /**
     * Create the next generation by applying GA concepts on last generation
     */
    generateNextGeneration() {
        let next_generation = [];
        this.sort();

        this.updateMaxDistance();

        this.getElites(next_generation);
        this.makeRouletteWheel(next_generation);
        this.resetOldButterflies();
        next_generation.push(...this.makeCrossover());
        this.mutate(next_generation);
        this.currentPopulation = next_generation;

        this.genCount ++;
        //this.updateText();
    }

    /**
     * Select ga_best_percent elites from current population
     * @param nextGeneration The elites
     */
    getElites(nextGeneration) {
        nextGeneration.push(...this.currentPopulation.slice(0, this.pivot));
    }

    /**
     * Make roulette wheel on the given the non-ellitist population to have SizeOfPopulation / 2 elements in the next population
     * @param next_generation
     */
    makeRouletteWheel(next_generation) {
        let restOfPopulation = this.currentPopulation.slice(this.pivot, this.currentPopulation.length)

        let totalScore = 0;
        restOfPopulation.forEach(butterfly =>
            totalScore += butterfly.distance
        );

        while(next_generation.length != this.size / 2){
            let alea = Math.random() * totalScore;
            let sum = 0;

            for(let index in restOfPopulation){
                let butterfly = restOfPopulation[index];
                sum += butterfly.distance;
                if(sum <= alea && !this.isButterflyAlreadyPresentIn(butterfly, next_generation)){
                    next_generation.push(butterfly);
                    break;
                }
            }
        }
    }

    /**
     * Make crossover between two different elements randomly selected
     * @returns {Array} Two childs from this crossover
     */
    makeCrossover() {
        let crossoverPool = [];
        console.log("toreach : " + this.currentPopulation.length / 2);

        while (crossoverPool.length != (this.currentPopulation.length / 2)){
            console.log(crossoverPool.length);
            let firstAlea = Math.floor(Math.random() * this.currentPopulation.length);

            let secondAlea;
            do {
                secondAlea = Math.floor(Math.random() * this.currentPopulation.length);
            } while(firstAlea == secondAlea)

            let firstParent = this.currentPopulation[firstAlea];
            let secondParent = this.currentPopulation[secondAlea];

            crossoverPool.push(...firstParent.crossover(secondParent));
        }

        return crossoverPool;
    }

    /**
     * Mutate all the generation in parameter
     * @param nextGeneration The generation to mutate
     */
    mutate(nextGeneration){
        nextGeneration.map(elem => elem.mutate());
    }

    /**
     * Sort the current population by increasing distance
     */
    sort() {
        this.currentPopulation.sort(function(a, b){
            if (a.distance < b.distance)
                return -1;
            if (a.distance > b.distance)
                return 1;
            return 0;
        });
    }

    /**
     * Test if all the current population is died
     * @returns {boolean}
     */
    isPopulationDied(){
        let is = true;
        this.currentPopulation.forEach(function(elem){
            if(!elem.died)
                is =  false;
        });
        return is;
    }

    /**
     * Reset all died butteflies
     */
    resetOldButterflies(){
        this.currentPopulation.forEach(function(elem){
            if(elem.died)
                elem.reset();
        });
    }

    /**
     * Test of a pool contains a butterfly
     * @param butterfly The butterfly whose presence is tested
     * @param pool The pool which is tested
     * @returns {boolean} True if the pool contains the butterfly, false otherwise
     */
    isButterflyAlreadyPresentIn(butterfly, pool){
        let present = false;
        for (let ind in pool){
            let elem = pool[ind];
            if(elem.id == butterfly.id){
                present = true;
                break;
            }
        }
        return present;
    }


    updateMaxDistance(){
        let best = this.currentPopulation[0];
        if(best.distance < this.maxDistance){
            this.best = best;
            this.maxDistance = best.distance;
        }

    }

    getFarthestButterfly() {
        let max = 0;
        let index = 0;
        for (let i = 0; i < this.currentPopulation.length; i++) {
            let elem = this.currentPopulation[i];
            if (elem.distance > max) {
                max = elem.distance;
                index = i;
            }
        }
        return this.currentPopulation[index];
    }

    saveBest(){
        //toPromise
        serialize(best[O]);
        serialize(best[1]);
    }
}