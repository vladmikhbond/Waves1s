import Space from "./space.js";

export default class Receiver {

        i = 0
        loss = 0
        space: Space
        energy = 0    
        
        constructor(i: number, loss: number, space: Space) {
            this.i = i;
            this.loss = loss;
            this.space = space;
        }

        step() {
            const v = this.space.nodes[this.i].v;
            this.energy += v**2 * this.loss * (2 - this.loss)/2
        }
    
}