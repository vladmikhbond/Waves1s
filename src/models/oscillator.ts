
export default class Oscillator {
    i = 0
    a = 0    
    t = 0
    dt = 0
    
    constructor(i: number, a: number, p: number = 20) {
        this.i = i;
        this.a = a;
        this.dt = 2 * Math.PI / p; 
        this.t = -this.dt;

    }
    
    next_z() {
        this.t += this.dt ;
        return Math.sin(this.t) * this.a;
    }
}
