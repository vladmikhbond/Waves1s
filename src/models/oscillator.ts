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
    
    constructor( a: number, q: number, lambda: number, vx: number, i: number, space: Space) {
        this.i = i;
        this.amp = a;
        this.space = space; 
        let v = Math.sqrt(space.k);

        if (lambda) {
            q = 2*Math.PI /  lambda;
        }

        this.dph = q * v;
        this.ph = -this.dph;
        // velo
        this.vx = vx ? 1/vx | 0 : 0;
    }


    step() {
        this.ph += this.dph;
        let f = Math.sin(this.ph)
        return f * this.amp;
    }

    killself() {
        let idx = this.space.oscillators.indexOf(this);
        if (idx != -1) {
            this.space.oscillators.splice(idx, 1);
        }
    }
}

export class Mono extends Oscillator {
    
    constructor( a: number, q: number, lambda: number, vx: number, i: number, space: Space) {
        super(a, q, lambda, 0, i, space);
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

