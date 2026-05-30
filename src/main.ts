import Controller from "./conroller/controller.js";
import Space from "./models/space.js";
import View from "./view/view.js";

export const size = 1000;      // work area
export const margin = 0;    // margin
const canvas = (document.getElementById("canvas") as HTMLCanvasElement)!;
const canvasBG = (document.getElementById("canvasBG") as HTMLCanvasElement)!;
canvas.width = canvasBG.width = size + 2 * margin;
canvas.height = canvasBG.height = size / 2;


const space = createSpace(size, margin);
const view = new View(space); 

new Controller(space, view);
view.show();

// ----------------------------------------------------------

function createSpace(size: number, margin: number) {
    let k_m = +(document.getElementById("k_m") as HTMLInputElement)!.value;
    let l = +(document.getElementById("loss") as HTMLInputElement)!.value;
    return new Space(size, margin, k_m, l);  //
}

