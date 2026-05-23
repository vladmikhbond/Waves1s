import {Oscillator} from "./oscillator.js"

class Node {
    s = 0  // shift 
    v = 0  // velo
    loss = 0
    is_stone = false
}


export default class Space {
    size: number 
    margin: number
    k_m = 0   // = k/m
    time = 0  // такти часу
    nodes: Node[] = []
    oscillators: Oscillator[] = []


    constructor(size: number, margin: number, k_m: number, loss: number) {
        this.size = size;
        this.margin = margin;
        // вузли (спершу)
        this.nodes = new Array(this.n);
        for (let i = 0; i < this.n; i++) {
            this.nodes[i] = new Node();
        }
        this.k_m = k_m;
        this.loss = loss;
        this.setAbsorbers();
    }

    get n() {
        return this.size + this.margin * 2;
    }

    set loss(v: number) {
        for (let i = this.margin; i < this.margin + this.size; i++) {
            this.nodes[i].loss = v;
        }
    }

    calm() {
        for (let node of this.nodes) {
            node.v = 0;
            node.s = 0;            
        } 
        for (let osc of this.oscillators) {
            osc.ph = 0;
        }
        this.time = 0;
    }

    setAbsorbers() {
        const d = 0.1/this.size;
        for (let i = 0; i < this.margin; i++) {
            this.nodes[i].loss = d * (this.margin - i);
            this.nodes[this.margin + this.size + i].loss = d * i;
        }  
    }


    addOsc(o: Oscillator) {
        this.oscillators.push(o);
    }

    delOscAt(i: number) {
        for (let k = 0; k < this.oscillators.length; k++) {
            if (Math.abs(this.oscillators[k].i - i) < 3) {
                this.oscillators.splice(k, 1);
                return;
            }
        }
    }

    step() {
        const n = this.n;

        // зміщення
        for (let i = 1; i < n - 1; i++) {
            if (!this.nodes[i].is_stone) 
                this.nodes[i].s += this.nodes[i].v;
        }

        // осцилятори
        for (let o of this.oscillators) {
            this.nodes[o.i].s += o.next_s();
            // this.nodes[o.i].v = 0;
        }
    
        // швидкості
        for (let i = 1; i < n - 1; i++) {
            let dz = this.nodes[i+1].s + this.nodes[i-1].s 
                - 2 * this.nodes[i].s ;

            let a = this.k_m * dz;
            this.nodes[i].v += a;           
            // втрати
            this.nodes[i].v *= (1 - this.nodes[i].loss);
        }

        this.time++;
    }

}