import Oscillator from "./oscillator.js"

class Node {
    x = 0  // coord 
    v = 0  // velo
    loss = 0

    constructor(x: number) {
        this.x = x;
    }
}


export default class Space {
    k_m = 0  // = k/m
    time = 0  // такти часу
    nodes: Node[] = []
    oscillators: Oscillator[] = []


    constructor(n: number, k_m: number, loss: number) {
        this.k_m = k_m;
        this.loss = loss;

        // вузли
        this.nodes = new Array(n);
        for (let i = 0; i < n; i++) {
            this.nodes[i] = new Node(0);
        }
        // поглиначі
        const start = 500, len = 200, d = 0.1/len;
        for (let i = 0; i < len; i++) {
            this.nodes[start + i].loss = d * i;
        }
    
    }

    set loss(v: number) {
        for (let i = 0; i < this.nodes.length; i++) {
            this.nodes[i].loss = v;
        }
    }


    addOsc(o: Oscillator) {
        this.oscillators.push(o);
    }

    step() {
        
        // швидкості
        for (let i = 1; i < this.nodes.length - 1; i++) {
            let dz = this.nodes[i-1].x + this.nodes[i+1].x  - 2 * this.nodes[i].x;
            let a = this.k_m * dz;
            this.nodes[i].v += a;
            // втрати
            this.nodes[i].v *= (1 - this.nodes[i].loss);
        }
        // амплітуди
        for (let i = 1; i < this.nodes.length - 1; i++) {
            this.nodes[i].x += this.nodes[i].v;
        }

        // осцилятори
        for (let o of this.oscillators) {
            this.nodes[o.i].x = o.next_a();
        }
    

        this.time++;
    }

}
