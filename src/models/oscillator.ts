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
    
    next_a() {
        this.ph += this.dph ;
        return Math.sin(this.ph) * this.amp;
    }
}


export class Meander extends Oscillator {
    next_a() {
        return Math.sign(super.next_a()) * this.amp;
    }
}

export class Pulse extends Oscillator {
    next_a() {
        return super.next_a() == 0 ? this.amp : 0;
    }
}

