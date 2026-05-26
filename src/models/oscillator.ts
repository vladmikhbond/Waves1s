import Space from "./space";

// Гармонійний осцилятор
//
export class Oscillator {
    i = 0
    amp = 0    
    ph = 0   // поточна фаза
    dph = 0  // приріст фази
    space: Space;
    
    constructor(i: number, a: number, q: number, space: Space) {
        this.i = i;
        this.amp = a;
        this.space = space;        
        this.dph = q * (space.k_m**0.5)  //  = qv
        this.ph = -this.dph;
    }
    
    next_s() {
        this.ph += this.dph ;
        return Math.sin(this.ph) * this.amp;
    }
}

export class Mono extends Oscillator {

    next_s() {
        if (this.ph > 2 * Math.PI) {
            this.killself()
        }
        return super.next_s();
    }

    killself() {
        let idx = this.space.oscillators.indexOf(this);
        if (idx != -1) {
            this.space.oscillators.splice(idx, 1);
        }
    }
}

export class Pulse extends Mono {
    t = 0;

    next_s() {
        this.killself();
        return this.amp;
    }
}

