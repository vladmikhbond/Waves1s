import {Oscillator, Mono, Meander, Pulse} from "../models/oscillator.js";
import Space from "../models/space.js";
import View from "../view/view.js";

let timer: ReturnType<typeof setInterval> | 0 = 0;

enum State {
    Inf, Osc, Mon, Sto, Del
}


export default class Controller {

    space: Space
    view: View

    constructor(space: Space, view: View) {

        this.space = space;
        this.view = view;

        document.getElementById("resetButton")!.addEventListener("click", () => {
            this.stop();
            this.space.calm();
            this.view.show();
        });

        document.getElementById("runButton")!.addEventListener("click", () => {
            if (timer) 
                this.stop(); 
            else 
                this.run();
        });

        document.addEventListener("keydown", (e: KeyboardEvent) => {
            if (e.key == "s" || e.key == "і" ) {
                stop();
                this.step();
            }
        });

        document.getElementById("canvas")!.addEventListener("mousedown", (e: MouseEvent) => {
            let x = e.offsetX;

            let ampl = +(document.getElementById("oscill_ampl")! as HTMLInputElement).value;
            let period = +(document.getElementById("oscill_period")! as HTMLInputElement).value;

            switch (this.state) {
                case State.Osc:
                    this.space.addOsc(new Oscillator(x, ampl, period));
                    break;
                case State.Mon:
                    this.space.addOsc(new Mono(x, ampl, period, this.space));
                    break;
                case State.Sto: 
                    this.space.nodes[x].is_stone = true;
            }
            this.view.show();
        });

        document.getElementById("k_m")!.addEventListener("change", (e) => {
            let k_m = +(e.target as HTMLInputElement).value;
            this.space.k_m = k_m;
        });

        document.getElementById("loss")!.addEventListener("change", (e) => {
            let loss = +(e.target as HTMLInputElement).value;       
            this.space.loss = loss;
        });

    }

    // ---------------- Props -------------------
    
    get state(): State 
    {
        const stateElem = document.getElementById("state") as HTMLInputElement;
        switch(stateElem.value) {
            case "Osc": return State.Osc;
            case "Sto": return State.Sto;
            case "Mon": return State.Mon;
            case "Del": return State.Del;
            default: return State.Inf;           
        }       
    }

    // ------------------- Metods -------------------

    step() {
        this.space.step();  
        this.view.show();
        document.getElementById("time")!.innerHTML = this.space.time.toString()

        // stop when limit
        if (this.space.nodes[1].v > 0.0001)
            stop(); 
    }

    stop() {
        if (timer) {
            clearInterval(timer);
            timer = 0;
        }
    }
    
    run() {
        if (timer) 
            return;
        timer = setInterval(() => this.step(), 10);
    }

}


