import {Oscillator, Mono, Pulse} from "../models/oscillator.js";
import Space from "../models/space.js";
import View from "../view/view.js";
import { scale } from "../view/view.js";

let timer: ReturnType<typeof setInterval> | 0 = 0;

enum State {
    Inf, Osc, Mon, Pul, Sto, Del
}


export default class Controller {

    space: Space
    view: View

    constructor(space: Space, view: View) {

        this.space = space;
        this.view = view;

        document.getElementById("calmButton")!.addEventListener("click", () => {
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
            let q = +(document.getElementById("oscill_q")! as HTMLInputElement).value;

            if (e.button == 2) {
                this.space.delOscAt(x);
                this.view.show();
                return;
            }

            switch (this.state) {
                case State.Inf:
                    this.view.showNode(x);
                    break;
                case State.Osc:
                    this.space.addOsc(new Oscillator(x, ampl, q, this.space));
                    break;
                case State.Mon:
                    this.space.addOsc(new Mono(x, ampl, q, this.space));
                    break;
                case State.Pul:
                    this.space.addOsc(new Pulse(x, ampl, q, this.space));
                    break;
                case State.Sto: 
                    this.space.nodes[x].is_stone = true;
                    break;
                case State.Del: 
                    this.space.delOscAt(x);
                    break;
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

        document.getElementById("is_velo_visible")!.addEventListener("change", (e) => {
            this.view.show();
        });

        document.getElementById("s_range")!.addEventListener("change", (e) => {
            scale.shift = +(e.target as HTMLInputElement).value;
            this.view.show();
        });

        document.getElementById("v_range")!.addEventListener("change", (e) => {
            scale.velo = +(e.target as HTMLInputElement).value;
            this.view.show();
        });

        document.getElementById("state")!.addEventListener("change", (e) => {
            let b = this.state == State.Osc || this.state == State.Mon || this.state == State.Pul;
            (document.getElementById("oscill_ampl") as HTMLSelectElement).disabled = !b;
            b = this.state == State.Osc || this.state == State.Mon;
            (document.getElementById("oscill_q") as HTMLSelectElement).disabled = !b;
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
            case "Pul": return State.Pul;
            case "Del": return State.Del;
            default: return State.Inf;           
        }       
    }

    // ------------------- Methods -------------------

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


