import Space from "./space";

// Гармонійний осцилятор
//
export class Oscillator {
    i = 0
    amp = 0    
    ph = 0   // поточна фаза
    dph = 0  // приріст фази
    
    constructor(i: number, a: number, period: number = 20) {
        this.i = i;
        this.amp = a;
        this.dph = 2 * Math.PI / period; 
        this.ph = -this.dph;
    }
    
    next_s() {
        this.ph += this.dph ;
        return Math.sin(this.ph) * this.amp;
    }
}

export class Mono extends Oscillator {
    space: Space;
    
    constructor(i: number, a: number, period: number, space: Space) {
        super(i, a, period);
        this.space = space;
    }

    next_s() {
        if (this.ph > 2 * Math.PI) {
            let idx = this.space.oscillators.indexOf(this);
            if (idx != -1) {
                this.space.oscillators.splice(idx, 1);
            }
        }

        return super.next_s();
    }
}


export class Meander extends Oscillator {
    next_s() {
        return Math.sign(super.next_s()) * this.amp;
    }
}

export class Pulse extends Oscillator {
    next_s() {
        return super.next_s() == 0 ? this.amp : 0;
    }
}

