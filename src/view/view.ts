import Space from "../models/space.js";

export default class View {
    space: Space
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    n_vis: number

    constructor(space: Space, n_vis: number) {
        this.space = space;
        this.canvas = (document.getElementById("canvas") as HTMLCanvasElement)!;
        this.ctx = this.canvas.getContext("2d")!;
        this.n_vis = n_vis;
    }

    show() {

        const n = this.space.nodes.length

        const kx = this.canvas.width / this.n_vis
        const ky = 10000;
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
        // vawes
        ctx.beginPath();
        ctx.strokeStyle = "red"
        for (let i = (n - this.n_vis) / 2 + 1; i < (n + this.n_vis) / 2; i++) {
            let node = this.space.nodes[i]
            let x = (i - (n - this.n_vis) / 2) * kx

            let y = (node.x - this.space.nodes[i-1].x - 1) * ky + b    // velo

            ctx.moveTo(x, b);
            ctx.lineTo(x, y);

        }
        ctx.stroke();
    }


}





