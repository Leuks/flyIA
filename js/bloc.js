
class Bloc{
    constructor(x, y, z, width, height){
        this.x = x;
        this.y = y;
        this.z = z;
        this.width = width;
        this.height = height;
    }


    show(){
        box(this.width, this.height, this.width);
    }

    static createRandomBloc(z){
        let randomWidth = Math.floor(Math.random() * width / 8) + width / 40;
        let randomHeight = Math.floor(Math.random() * height / 8) + height / 40;
        let randomX = Math.floor(Math.random() * width) - width / 2;
        let randomY = Math.floor(Math.random() * width) - width / 2;

        return new Bloc(randomX, randomY, z, randomWidth, randomHeight);
    }

}
