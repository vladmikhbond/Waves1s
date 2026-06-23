import {Oscillator} from "./oscillator.js"
import Receiver from "./receiver.js"

export class Node {
    u = 0  // shift 
    v = 0  // velo
    loss = 0
    is_stone = false
}


export default class Space {

    size: number 
    margin: number
    k = 0   // = k/m
    time = 0  // такти часу
    nodes: Node[] = []
    oscillators: Oscillator[] = []
    receivers: Receiver[] = []
    selNodeIdx = -1;


    constructor(w: number, margin: number, k: number, loss: number) {
        this.size = w - 2 * margin;
        this.margin = margin;
        // спершу створити вузли
        this.nodes = new Array(this.n);
        for (let i = 0; i < this.n; i++) {
            this.nodes[i] = new Node();
        }
        this.k = k;
        this.loss = loss;
        this.setAbsorbers();
    }

    get n() {
        return this.size + this.margin * 2;
    }

    set loss(val: number) {
        for (let i = this.margin; i < this.margin + this.size; i++) {
            this.nodes[i].loss = val;
        }
    }

    get loss() {
        let i = this.nodes.length / 2 | 0;
        return this.nodes[i].loss;
    }

    getOscillatorAt(n: number): Oscillator | null
    {
        for (const osc of this.oscillators) {
            if (Math.abs(osc.i - n) < 3) {
                return osc;
            }
        }
        return null;
    }

    getReceiverAt(n: number): Receiver | null
    {
        for (const rec of this.receivers) {
            if (Math.abs(rec.i - n) < 3) {
                return rec;
            }
        }
        return null;
    }


    calm() {
        for (let node of this.nodes) {
            node.v = 0;
            node.u = 0;            
        } 
        for (let osc of this.oscillators) {
            osc.ph = 0;
        }
        this.time = 0;
    }

    setAbsorbers() {         
        for (let i = 0; i < this.margin; i++) {
            let xLeft = this.margin - i;
            let xRight = this.size + this.margin + i;
            let loss = (i / this.margin)**2;
            
            this.nodes[xLeft].loss = loss;
            this.nodes[xRight].loss = loss;
        }  
    }


    addOscillator(o: Oscillator) {
        this.oscillators.push(o);
    }

    remOscillator(o: Oscillator) {
        const idx = this.oscillators.indexOf(o);
        if (idx != -1) {
            this.oscillators.splice(idx, 1);
        }
    }

    addReceiver(r: Receiver) {
        this.receivers.push(r);
        // встановлює коеф втрат у вузлі
        this.nodes[r.i].loss = r.loss; 
    }

    remReceiver(r: Receiver) {
        const idx = this.receivers.indexOf(r);
        if (idx != -1) {
            this.receivers.splice(idx, 1);
            // повертає коеф втрат у вузлі
            this.nodes[r.i].loss = this.loss; 
        }
    }

    deleteAt(i: number) {
        this.nodes[i].is_stone = false;
        for (const o of this.oscillators.slice()) {
            if (Math.abs(o.i - i) < 3) 
                this.remOscillator(o);
        }
        for (const r of this.receivers.slice()) {
            if (Math.abs(r.i - i) < 3) 
                this.remReceiver(r);
        }

    }

    step() {
        const N = this.n;
    
        // Швидкості ------------------------------
        for (let n = 1; n < N - 1; n++) {
            let U = this.nodes[n+1].u + this.nodes[n-1].u -
                2 * this.nodes[n].u ;

            let a = this.k * U;
            this.nodes[n].v += a;

            // втрати
            this.nodes[n].v *= (1 - this.nodes[n].loss);
        }
        
        // Випромінювачі
        let c = Math.sqrt(this.k);        
        // лівий
        let xL = this.margin + 1;
        this.nodes[xL].v = -c * (this.nodes[xL].u - this.nodes[xL + 1].u)
        // правий
        let xR = this.size + this.margin - 2;
        this.nodes[xR].v = -c * (this.nodes[xR].u - this.nodes[xR - 1].u)

        // Відхилення ----------------------------
        for (let n = 1; n < N - 1; n++) {
            if (!this.nodes[n].is_stone) {
                this.nodes[n].u += this.nodes[n].v;                
            }
        }

        // Осцилятори
        for (let o of this.oscillators) {
            this.nodes[o.i].u = o.step();
        }
        
        // Приймачі
        for (let o of this.receivers) {
            o.step();
        }
        
        // Рух осциляторів        
        for (let o of this.oscillators) {
            if (o.vx && this.time % o.vx == 0) {
                this.nodes[o.i].v = (this.nodes[o.i - 1].v + this.nodes[o.i + 1].v) / 2;
                this.nodes[o.i].u = (this.nodes[o.i - 1].u + this.nodes[o.i + 1].u) / 2; 
                if (o.vx > 0) o.i++;
                if (o.vx < 0) o.i--;
                if (o.i <= 0 || o.i >= N - 1) {
                    o.killself();  
                    break;
                }
            }
        }

        // час 
        this.time++;
    }


    energy() 
    {
        let beg = this.margin + 1;
        let end = this.size + this.margin - 1;

        let e = 0;
        // швидкості
        for (let i = beg; i < end; i++) {
            e += this.nodes[i].v ** 2; 
        }
        for (let i = beg; i < end - 1; i++) {
            e += (this.nodes[i+1].u - this.nodes[i].u)**2;
        }
        return e / 2;
    }

}