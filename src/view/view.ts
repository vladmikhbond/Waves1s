import Space from "../models/space.js";
import {Node} from "../models/space.js";

export let scale = { shift: 100, velo: 1000 };

export default class View {

    space: Space
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D

    constructor(space: Space) {
        this.space = space;
        this.canvas = (document.getElementById("canvas") as HTMLCanvasElement)!;
        this.ctx = this.canvas.getContext("2d")!;
        this.backgroundPrepare();
        this.show();
    }

    get is_velo_visible(): boolean
    {
        const stateElem = document.getElementById("is_velo_visible") as HTMLInputElement;
        return stateElem.checked;      
    }

    backgroundPrepare() {
        let canvasBG = (document.getElementById("canvasBG") as HTMLCanvasElement)!;
        let ctx = canvasBG.getContext("2d")!;
        // gradient fill
        // left
        let x0 = 0, y0 = 0, x1 = this.space.margin, y1 = this.canvas.height; 
        const gradientL = ctx.createLinearGradient(x0, 0, x1, 0);
        gradientL.addColorStop(0, "lightgray");
        gradientL.addColorStop(1, "white");
        ctx.fillStyle = gradientL;
        ctx.fillRect(x0, y0, x1 - x0, y1 - y0)
        // right
        x0 = this.space.n - this.space.margin, y0 = 0, x1 = this.space.n, y1 = this.canvas.height; 
        const gradientR = ctx.createLinearGradient(x0, 0, x1, 0);
        gradientR.addColorStop(0, "white");
        gradientR.addColorStop(1, "lightgray");
        ctx.fillStyle = gradientR;
        ctx.fillRect(x0, y0, x1 - x0, y1 - y0)

        // grid
        ctx.beginPath();
        ctx.strokeStyle = "lightgray";         
        for (let x = 100; x < this.canvas.width; x += 100) {
            ctx.moveTo(x, 0); ctx.lineTo(x, this.canvas.height); 
        }
        ctx.stroke(); 
        ctx.strokeStyle = "black";
        ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
    }

    show() 
    {
        const end = 2 * this.space.margin + this.space.size;
        const b = this.canvas.height / 2;

        const ctx = this.ctx;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // velo vawes
        if (this.is_velo_visible) {
            ctx.strokeStyle = "red"
            ctx.beginPath();
            for (let i = 0; i < end; i++) {
                let node = this.space.nodes[i];
                let y = node.v * scale.velo + b;    // velo
                ctx.lineTo(i, y);
            }
            ctx.stroke();
        }

        // shift vawes
        ctx.strokeStyle = "blue"
        ctx.beginPath();
        for (let i = 0; i < end; i++) {
            let node = this.space.nodes[i];
            let y = node.u * scale.shift + b;    // shift
            ctx.lineTo(i, y);
        }
        ctx.stroke();

        // осцилятори
        ctx.fillStyle = "green";
        for (let o of this.space.oscillators) {
            let x = o.i;
            let y = this.space.nodes[o.i].u * scale.shift + b; 
            ctx.fillRect(x-3, y-3, 6, 6);
        }
        // приймачі
        ctx.fillStyle = "red";
        for (let r of this.space.receivers) {
            let x = r.i;
            let y = this.space.nodes[r.i].u * scale.shift + b; 
            ctx.fillRect(x-3, y-3, 6, 6);
        }

        // камені
        ctx.fillStyle = "black";
        for (let i = 0; i < end; i++) {
            if (this.space.nodes[i].is_stone)
                ctx.fillRect(i-3, b-3, 6, 6);
        }
        // обраний вузол
        if (this.space.selNodeIdx != -1) {      
            const i = this.space.selNodeIdx;        
            const node = this.space.nodes[i];
            ctx.strokeStyle = "lightgray"; 
            ctx.beginPath(); 
            ctx.moveTo(i, 0); ctx.lineTo(i, this.canvas.height); 
            ctx.stroke();      
        }
    }  

    showSelObject() {
        const energyStr  = `....Σ = ${this.space.energy().toFixed(6)}`;

        const el = document.getElementById("info")!;
        const idx = this.space.selNodeIdx;
        if (idx == -1) return
        let osc = this.space.getOscillatorAt(idx);
        if (osc) {
            const grad = Math.round((osc.ph % (2*Math.PI))*360/(2*Math.PI)); 
            el.innerHTML = `osc: #${osc.i}:  amp=${osc.amp.toFixed(1)} ph=${grad}°; ${energyStr}`;
            return;
        } 
        let rec = this.space.getReceiverAt(idx);
        if (rec) {
            el.innerHTML = `rec: #${rec.i}:  energy=${rec.energy.toFixed(5)};  ${energyStr}`;
            return;
        } 
        let node = this.space.nodes[idx];
        if (node) {
            el.innerHTML = `node: #${idx}:  u=${node.u.toFixed(3)} v=${node.v.toFixed(4)};  ${energyStr}`;
        }
    }

}



