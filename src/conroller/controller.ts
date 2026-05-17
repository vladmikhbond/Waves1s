import Oscillator from "../models/oscillator.js";
// import Space from "../models/space_long.js";
import Space from "../models/space_cross.js";
import View from "../view/view.js";

let timer: ReturnType<typeof setInterval> | 0 = 0;

export default class Controller {

    space: Space
    view: View

    constructor(space: Space, view: View) {

        this.space = space;
        this.view = view;

        
        // осцилятори
        let mid = space.nodes.length/2 | 0;
        space.addOsc(new Oscillator(mid, 0.05, 200));

       document.getElementById("resetButton")!.addEventListener("click", () => {
            let k_m = +(document.getElementById("k_m") as HTMLInputElement)!.value;
            let loss = +(document.getElementById("l") as HTMLInputElement)!.value;

            this.space.k_m = k_m;
            this.space.loss = loss;
        });

        document.getElementById("runButton")!.addEventListener("click", () => {
            if (timer) this.stop(); 
            else this.run();
        });

        document.addEventListener("keydown", (e: KeyboardEvent) => {
            if (e.key == " ") {
                stop();
                this.step();
            }
        });
    }
    
    step() {
        this.space.step();  
        this.view.show();
        document.getElementById("time")!.innerHTML = this.space.time.toString()

        // stop when limit
        // if (space.nodes[1].v > 0) stop(); 
    
    }

    stop() {
        if (timer) {
            clearInterval(timer);
            timer = 0;
        }
    }
    
    run() {
        if (timer) return;
        timer = setInterval(() => { 
            this.step();
        }, 10);
    }

}


