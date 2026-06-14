import {Oscillator, Mono} from "../models/oscillator.js";
import Receiver from "../models/receiver.js";
import Space from "../models/space.js";
import View from "../view/view.js";
import { scale } from "../view/view.js";

const modeElement = (document.getElementById("mode") as HTMLInputElement)!;
const infoElement = (document.getElementById("info") as HTMLInputElement)!;


let timer: ReturnType<typeof setInterval> | 0 = 0;

enum Mode {
    Inf, Osc, Mon, Rec, Sto, Del
}

export default class Controller {

    space: Space
    view: View

    constructor() {
        this.space = createSpace();
        this.initCanvases();
        this.view = new View(this.space); 
        this.addListeners();
    }

    initCanvases() {
        const canvas = (document.getElementById("canvas") as HTMLCanvasElement)!;
        const canvasBG = (document.getElementById("canvasBG") as HTMLCanvasElement)!;
        canvas.width = this.space.size + 2 * this.space.margin;
        canvas.height = 500;
        canvasBG.width = this.space.size + 2 * this.space.margin;
        canvasBG.height = 500;  
    } 

    addListeners() {

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

       // params changed 
        document.getElementById("params")!.addEventListener("keydown", (e: KeyboardEvent) => {

            if (e.key == "Enter") {
                document.getElementById("s_range")!.focus();
                this.stop();
                const [size,  margin, k,  loss] = getParams();
                
                if (this.space.size != size || this.space.margin != margin) {
                    // new space
                    this.space = new Space(size,  margin, k,  loss); 
                    this.initCanvases();
                    this.view = new View(this.space);
                    this.view.show();
                    return;
                }                                            
                if (this.space.k != k || this.space.loss != loss) {
                    // new params
                    this.space.k = k;
                    this.space.loss = loss;
                } else {
                    // just calm
                    this.space.calm();
                } 
                this.view.show();
            }
        });             


        document.getElementById("canvas")!.addEventListener("mousedown", (e: MouseEvent) => {

            const x = e.offsetX;
            const [ampl, q, vx, lambda] = getOscilParams();  


            if (e.button == 2) {
                this.space.deleteAt(x);
                this.view.show();
                return;
            }

            switch (this.mode) {
                case Mode.Inf:
                    this.space.selNodeIdx = x;
                    this.view.showSelectedNode();
                    break;
                case Mode.Osc:
                    this.space.addOscillator(new Oscillator(ampl, q, lambda, vx, x, this.space));
                    break;
                case Mode.Mon:
                    this.space.addOscillator(new Mono(ampl, q, lambda, vx, x, this.space));
                    break;
                case Mode.Rec:
                    const loss = getReceiverParams();
                    this.space.addReceiver(new Receiver(x, loss, this.space));
                    break;
                case Mode.Sto: 
                    this.space.nodes[x].is_stone = true;
                    break;
                case Mode.Del: 
                    this.space.deleteAt(x);
                    break;
            }
            this.view.show();
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

        document.getElementById("mode")!.addEventListener("change", (e) => {
            document.getElementById("oscilParams")!.style.display = 
                    this.mode == Mode.Osc || this.mode == Mode.Mon ? "inline" : "none";
            document.getElementById("recieverParams")!.style.display = 
                    this.mode == Mode.Rec ? "inline" : "none";
        });
       
    }

    // ---------------- Props -------------------
    
    get mode(): Mode 
    {
        switch(modeElement.value) {
            case "Osc": return Mode.Osc;
            case "Sto": return Mode.Sto;
            case "Mon": return Mode.Mon;
            case "Rec": return Mode.Rec;
            case "Del": return Mode.Del;
            default: return Mode.Inf;           
        }       
    }

    // ------------------- Methods -------------------

    step() {
        this.space.step();  
        this.view.show();
        document.getElementById("time")!.innerHTML = this.space.time.toString()
        if (this.mode == Mode.Inf) {
            infoElement.innerHTML = `E = ${this.space.energy().toFixed(6)}`
        }
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

// --------------- free funcs

function getParams() {
    const el = (document.getElementById("params") as HTMLInputElement)!;
    let f;
    try {
        f = new Function("", 
            "let size, margin, k, loss;" + 
            el.value + 
            "; return [size, margin, k,  loss]" 
        );
    } catch {
        el.style.backgroundColor = "pink";
        return [500, 200, 0.99, 0]
    }

    const [size,  margin, k,  loss] = f!();
    // params are OK  
    if (size != undefined &&  margin != undefined &&  k != undefined && loss != undefined) {
        el.style.backgroundColor = "white";
        return [size, margin, k,  loss];
    }
    // params are wrong
    el.style.backgroundColor = "pink";
    return [500, 200, 0.99, 0];    
}

function getOscilParams() {
    const f = new Function("", 
        "let amp = 1,  q =0, vx=1/2, la=0 ;" + 
        (document.getElementById("oscilParams") as HTMLInputElement)!.value +
        "; return [amp, q, vx, la]" );

        return f()
}

function getReceiverParams() {
    const f = new Function("", 
        "let loss = 0.5;" + 
        (document.getElementById("recieverParams") as HTMLInputElement)!.value +
        "; return loss" );
    return f();   
}

export function createSpace() {
    const [size, margin, k, loss] = getParams();
    return new Space(size, margin, k, loss);
}

