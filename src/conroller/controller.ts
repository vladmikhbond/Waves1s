import {Oscillator, Mono} from "../models/oscillator.js";
import Receiver from "../models/receiver.js";
import Space from "../models/space.js";
import View from "../view/view.js";
import { scale } from "../view/view.js";
import { getSizeParams, getSpaceParams, getOscilParams, getReceiverParams } from "./params.js";
import { sceneToJson, restoreSceneFromJson } from "./utils.js";


const modeElement = (document.getElementById("mode") as HTMLInputElement)!;

let timer: ReturnType<typeof setInterval> | 0 = 0;

enum Mode {
    Inf, Osc, Mon, Rec, Sto, Del
}

export default class Controller {

    space: Space
    view: View

    constructor(space: Space, view: View, height: number) {  
        this.space = space; 
        this.view = view;
        this.addListeners();
        this.addDataHandlers() 
        this.initCanvases(space.n, height);

    }

    initCanvases(w: number, h: number) {
        
        document.documentElement.style.setProperty('--canvas-width', w+'px');
        document.documentElement.style.setProperty('--canvas-height', h+'px');
        const canvas = (document.getElementById("canvas") as HTMLCanvasElement)!;
        const canvasBG = (document.getElementById("canvasBG") as HTMLCanvasElement)!;
        canvas.width = w;
        canvas.height = h;
        canvasBG.width = w;
        canvasBG.height = h;  
        this.view.backgroundPrepare();
    } 

    addListeners() 
    {
        // Run-Stop button
        document.getElementById("runButton")!.addEventListener("click", () => {
            if (timer) 
                this.stop(); 
            else 
                this.run();
        });

        // Key 'S' to do only one step
        document.addEventListener("keydown", (e: KeyboardEvent) => {
            if (e.key == "s" || e.key == "і" ) {
                stop();
                this.step();
                this.view.showSelObject();
            }
        });

        // params changed 

        document.getElementById("sizeParams")!.addEventListener("keydown", (e: KeyboardEvent) => 
        {
            if (e.key == "Enter") {
                this.stop();
                const ps = getSizeParams()!;
                if (ps == null)
                    return;
                // Зміна розмірів створює новий пустий модельний простір
                let[w, h, margin] = ps;
                this.view.space = this.space = 
                        new Space(w, margin, this.space.k,  this.space.loss); 
                this.initCanvases(w, h); 
                this.view.show();                                                     
            }
        });   

        document.getElementById("spaceParams")!.addEventListener("keydown", (e: KeyboardEvent) => 
        {
            if (e.key == "Enter") {
                this.stop();
                const ps = getSpaceParams(); 
                if (ps == null)
                    return;   
                let[k, loss] = ps;                                        
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
        
        document.getElementById("oscilParams")!.addEventListener("keydown", (e: KeyboardEvent) => 
        {
            if (e.key == "Enter") {
                getOscilParams();
            }
        }); 

        document.getElementById("recieverParams")!.addEventListener("keydown", (e: KeyboardEvent) => 
        {
            if (e.key == "Enter") {
                getReceiverParams();
            }
        }); 

        // canvas_mousedown
        document.getElementById("canvas")!.addEventListener("mousedown", (e: MouseEvent) => {

            const x = e.offsetX;
            const [ampl, q, vx, lambda] = getOscilParams()!;  

            if (e.button == 2) {
                this.space.deleteAt(x);
                this.view.show();
                return;
            }

            switch (this.mode) {
                case Mode.Inf:
                    this.space.selNodeIdx = x;
                    this.view.showSelObject();
                    break;
                case Mode.Osc:
                    this.space.addOscillator(new Oscillator(ampl, q, lambda, vx, x, this.space));
                    break;
                case Mode.Mon:
                    this.space.addOscillator(new Mono(ampl, q, lambda, x, this.space));
                    break;
                case Mode.Rec:
                    const ps = getReceiverParams();
                    if (ps) {
                        this.space.addReceiver(new Receiver(x, ps[0], this.space));
                    }
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

        // document.getElementById("is_velo_visible")!.addEventListener("change", (e) => {
        //     this.view.show();
        // });

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
       
        // helpButton
        document.getElementById("helpButton")!.addEventListener("click", () => {
            window.open("help.html", "_blank")?.focus();
        });


    }

    addDataHandlers() 
    {
        const areaEl = <HTMLTextAreaElement>document.getElementById("savedSceneText"); 

        document.getElementById("saveSceneButton")!.addEventListener("click", () => {
            areaEl.value = sceneToJson(this.space);
        });

        document.getElementById("loadSceneButton")!.addEventListener("click", () => {
            restoreSceneFromJson(areaEl.value, this.space);
            this.stop();
            this.space.time = 0;
            this.view.show();
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

    // ------------------- Time methods -------------------

    step() {
        this.space.step();  
        this.view.show();
        if (this.space.time % 10 === 0) {
            this.view.showTimeAndEnergy();
        }
    }

    stop() {
        if (timer) {
            clearInterval(timer);
            timer = 0;
            this.view.showSelObject();
        }
    }
    
    run() {
        if (timer) 
            return;
        timer = setInterval(() => this.step(), 10);
    }

}

