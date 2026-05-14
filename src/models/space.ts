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
    k = 0  // жорсткість
    m = 0  // маса
    time = 0  // такти часу
    loss = 0.0  // коеф. втрат
    nodes: Node[] = []
    oscillators: Oscillator[] = []


    constructor(n: number, k: number, m: number, l: number) {
        this.k = k;
        this.m = m;
        this.loss = l;
        // вузли
        this.nodes = new Array(n);
        for (let i = 0; i < n; i++) {
            this.nodes[i] = new Node(i);
        }
        // поглиначі
        // const start = 500, len = 200, d = 0.1/len;
        // for (let i = 0; i < len; i++) {
        //     this.nodes[start + i].l = d * i;
        // }
        

        // осцилятори
        this.oscillators.push(new Oscillator(250, 0.005, 60));

    }

    step() {
        
        // швидкості
        for (let i = 1; i < this.nodes.length - 1; i++) {
            
            let dist = (this.nodes[i+1].x + this.nodes[i-1].x) ;
            let d = dist/2 - this.nodes[i].x;
            let a = this.k / this.m * d;
            this.nodes[i].v += a;           
            // втрати
            this.nodes[i].v *= (1 - this.nodes[i].loss);
        }
        // положення
        for (let i = 1; i < this.nodes.length - 1; i++) {
            this.nodes[i].x += this.nodes[i].v;
        }

        // осцилятори
        for (let o of this.oscillators) {
            this.nodes[o.i].x = o.next_z();
        }
    
        this.time++;
    }

}