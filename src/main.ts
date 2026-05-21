import Controller from "./conroller/controller.js";
import Space from "./models/space.js";
import View from "./view/view.js";


export const size = 500;      // work area
export const margin = 200;    // margin
const canvas = (document.getElementById("canvas") as HTMLCanvasElement)!;
const canvasBG = (document.getElementById("canvasBG") as HTMLCanvasElement)!;
canvas.width = canvasBG.width = size + 2 * margin;
canvas.height = canvasBG.height = size;


const space = createSpace(size, margin);
const view = new View(space); 

// left reflector
// space.nodes[margin].is_stone = true;

// right reflector
//space.nodes[margin + size].is_stone = true;

new Controller(space, view);
view.show();

// ----------------------------------------------------------

function createSpace(size: number, margin: number) {
    let k_m = +(document.getElementById("k_m") as HTMLInputElement)!.value;
    let l = +(document.getElementById("l") as HTMLInputElement)!.value;
    return new Space(size, margin, k_m, l);  //
}

