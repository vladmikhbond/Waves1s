import Space from "../models/space.js";
import View from "../view/view.js";

let timer: ReturnType<typeof setInterval> | 0 = 0;

export default class Controller {

    space: Space
    view: View

    constructor(space: Space, view: View) {

        this.space = space;
        this.view = view;


       document.getElementById("resetButton")!.addEventListener("click", () => {
            let k_m = +(document.getElementById("k_m") as HTMLInputElement)!.value;
            let loss = +(document.getElementById("l") as HTMLInputElement)!.value;

            this.space.k_m = k_m;
            this.space.loss = loss;
            // this.view.show();
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


