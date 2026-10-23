import {Oscillator, Mono} from "../models/oscillator.js";
import Receiver from "../models/receiver.js";
import Space from "../models/space.js";
import View from "../view/view.js";
import { scale } from "../view/view.js";
import { getParams } from "./params.js";
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
        this.addHandlers();
        this.addDataHandlers();
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

    addHandlers() 
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

        document.getElementById("infoParams")!.addEventListener("keydown", (e: KeyboardEvent) => 
        {
            if (e.key == "Enter") {
                this.stop();
                const ps = getParams("infoParams");  // "w: 1400, h: 600, ma: 200, k: 0.99, loss: 0.0"
                
                // Зміна розмірів створює новий пустий модельний простір
                if (this.view.canvas.width != ps.w || this.view.canvas.height != ps.h) {
                    this.view.space = this.space = new Space(ps.w, ps.ma, this.space.k,  this.space.loss);         
                    this.initCanvases(ps.w, ps.h);
                }
                // Зміна парамтрів простору
                if (this.space.k != ps.k || this.space.loss != ps.loss) {
                    // new params
                    this.space.k = ps.k;
                    this.space.loss = ps.loss;
                } else {
                    // just calm
                    this.space.calm();
                } 
                this.view.show();                                                     
            }
        });    
        
        // document.getElementById("oscilParams")!.addEventListener("keydown", (e: KeyboardEvent) => 
        // {
        //     if (e.key == "Enter") {
        //         getOscilParams();
        //     }
        // }); 

        // document.getElementById("recieverParams")!.addEventListener("keydown", (e: KeyboardEvent) => 
        // {
        //     if (e.key == "Enter") {
        //         getReceiverParams();
        //     }
        // }); 

        // canvas_mousedown
        document.getElementById("canvas")!.addEventListener("mousedown", (e: MouseEvent) => {

            const x = e.offsetX;
            if (e.button == 2) {
                this.space.deleteAt(x);
                this.view.show();
                return;
            }
            const ps = getParams("oscilParams");  // "amp: 1, la: 100, vx: 0"
            switch (this.mode) {
                case Mode.Inf:
                    this.space.selNodeIdx = x;
                    this.view.showSelObject();
                    break;
                case Mode.Osc:                    
                    this.space.addOscillator(new Oscillator(ps.amp, ps.q, ps.la, ps.vx, x, this.space));
                    break;
                case Mode.Mon:
                    this.space.addOscillator(new Mono(ps.amp, ps.q, ps.la, x, this.space));
                    break;
                case Mode.Rec:
                    const params = getParams("recieverParams");  // "loss: 0.5"
                    this.space.addReceiver(new Receiver(x, params.loss, this.space));
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

        document.getElementById("s_range")!.addEventListener("change", (e) => {

            scale.shift = +(e.target as HTMLInputElement).value;
            this.view.show();
        });

        document.getElementById("v_range")!.addEventListener("change", (e) => {
            scale.velo = +(e.target as HTMLInputElement).value;
            this.view.show();
        });

        document.getElementById("mode")!.addEventListener("change", (e) => {
            let infoParams = document.getElementById("infoParams")!.style;
            let oscilParams = document.getElementById("oscilParams")!.style;
            let recieverParams = document.getElementById("recieverParams")!.style;

            infoParams.display = oscilParams.display = recieverParams.display = "none";

            switch(this.mode) {
                case Mode.Inf:
                    infoParams.display = "inline";
                    break;
                case Mode.Osc, Mode.Mon:
                    oscilParams.display = "inline";
                    break;
                case Mode.Rec:
                    recieverParams.display = "inline";
                    break;
            }
        });
       
        // helpButton
        document.getElementById("helpButton")!.addEventListener("click", () => {
            window.open("help.html", "_blank")?.focus();
        });


    }


    // повертає серіалізовану модель у вигляді рядку JSON
    getCurrentModelAsJson(): string {
        return sceneToJson(this.space);
    }


    // оновлює модель з рядку JSON
    setCurrentModelWithJson(jsonStr: string ) {
        restoreSceneFromJson(jsonStr, this.space);
        this.stop();
        this.space.time = 0;
        this.view.show();
    }


    addDataHandlers() 
    {
        const sceneSelect = <HTMLSelectElement>document.getElementById("sceneSelect");
        const sceneName = <HTMLInputElement>document.getElementById("sceneName");
        const saveSceneButton = <HTMLButtonElement>document.getElementById("saveSceneButton");
        const removeSceneButton = <HTMLButtonElement>document.getElementById("removeSceneButton");

        const areaEl = <HTMLTextAreaElement>document.getElementById("savedSceneText"); 

        saveSceneButton.addEventListener("click", () => {
            areaEl.value = sceneToJson(this.space);
        });

        removeSceneButton.addEventListener("click", () => {
            areaEl.value = "";
        });

        sceneSelect.addEventListener("click", () => {
            this.setCurrentModelWithJson(areaEl.value);

        });
    }

    // addDataHandlers() 
    // {
    //     const areaEl = <HTMLTextAreaElement>document.getElementById("savedSceneText"); 

    //     document.getElementById("saveSceneButton")!.addEventListener("click", () => {
    //         areaEl.value = sceneToJson(this.space);
    //     });

    //     document.getElementById("loadSceneButton")!.addEventListener("click", () => {
    //         restoreSceneFromJson(areaEl.value, this.space);
    //         this.stop();
    //         this.space.time = 0;
    //         this.view.show();
    //     });
    // }


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

