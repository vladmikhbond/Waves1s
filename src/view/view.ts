import Space from "../models/space.js";

export default class View {
    space: Space
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
  

    constructor(space: Space) {
        this.space = space;
        this.canvas = (document.getElementById("canvas") as HTMLCanvasElement)!;
        this.ctx = this.canvas.getContext("2d")!;
    }

    show() {

        const n = this.space.n;
        
        // const beg = this.space.margin;
        // const end = this.space.margin + this.space.size;
        const beg = 0;
        const end = 2 * this.space.margin + this.space.size;


        const v_scale = 10000;
        const s_scale = 1000;

        const b = this.canvas.height / 2;
        const ctx = this.ctx;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // grid
        ctx.beginPath();
        ctx.strokeStyle = "gray";        
        for (let x = 0; x < this.canvas.width; x += 100) {
            ctx.moveTo(x, 0); ctx.lineTo(x, this.canvas.height); 
        }
        ctx.stroke();

        // velo vawes
        ctx.strokeStyle = "red"
        ctx.beginPath();
        for (let i = beg ; i < end; i++) {
            let node = this.space.nodes[i];
            let x = i - beg;
            let y = node.v * v_scale + b;    // velo
            ctx.lineTo(x, y);
        }
        ctx.stroke();

        // shift vawes
        ctx.strokeStyle = "blue"
        ctx.beginPath();
        for (let i = beg ; i < end; i++) {
            let node = this.space.nodes[i]
            let x = i - beg;
            let y = node.s * s_scale + b;    // shift
            ctx.lineTo(x, y);
        }
        ctx.stroke();

        // осцилятори
        ctx.fillStyle = "green";
        for (let o of this.space.oscillators) {
            let x = o.i - beg;
            let y = this.space.nodes[o.i].s * s_scale + b; 
            ctx.fillRect(x-3, y-3, 6, 6);
        }



    }


}





