import Space from "./space";

// Гармонійний осцилятор
//
export class Oscillator {
    i = 0
    amp = 0    
    ph = 0   // поточна фаза
    dph = 0  // приріст фази
    space: Space
    vx = 0
    
    constructor(i: number, a: number, q: number, space: Space, vx = 0) {
        this.i = i;
        this.amp = a;
        this.space = space; 
        let v = Math.sqrt(space.k);
        this.dph = q * v;
        this.ph = -this.dph;
        this.vx = vx ? 1/vx | 0 : 0;
    }
    
    step() {
        this.ph += this.dph;
        return Math.exp(Math.sin(this.ph)) * this.amp;
    }

    killself() {
        let idx = this.space.oscillators.indexOf(this);
        if (idx != -1) {
            this.space.oscillators.splice(idx, 1);
        }
    }
}

export class Mono extends Oscillator {
    
    constructor(i: number, a: number, q: number, space: Space) {
        super(i, a, q, space);
        this.ph = -Math.PI/2 -this.dph;
    }

     
    step() {
        if (this.ph > 1.5 * Math.PI) {
            this.killself()
        }
        this.ph += this.dph;
        return -(Math.sin(this.ph) + 1) * this.amp / 2;
    }


}

export class Pulse extends Mono {
    t = 0;

    step() {
        this.killself();
        return this.amp;
    }
}

