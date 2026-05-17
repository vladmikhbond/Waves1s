import Controller from "./conroller/controller.js";
import Space from "./models/space.js";
import View from "./view/view.js";


export const size = 500;      // visible middle area
export const margin = 400;    // margin


const space = createSpace(size, margin);
const view = new View(space); 
// left reflector
// space.nodes[margin].is_stone = true;

// right reflector
//space.nodes[margin + size].is_stone = true;

new Controller(space, view);

// ----------------------------------------------------------

function createSpace(size: number, margin: number) {
    let k_m = +(document.getElementById("k_m") as HTMLInputElement)!.value;
    let l = +(document.getElementById("l") as HTMLInputElement)!.value;
    return new Space(size, margin, k_m, l);  //
}

