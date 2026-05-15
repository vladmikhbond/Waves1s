// Гармонійний осцилятор
//
export default class Oscillator {
    i = 0
    amp = 0    
    ph = 0   // поточна фаза
    dph = 0  // приріст фази
    
    constructor(i: number, a: number, p: number = 20) {
        this.i = i;
        this.amp = a;
        this.dph = 2 * Math.PI / p; 
        this.ph = -this.dph;
    }
    
    next_a() {
        this.ph += this.dph ;
        return Math.sin(this.ph) * this.amp;
    }
}
