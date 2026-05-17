import Controller from "./conroller/controller.js";
import Space from "./models/space_cross.js";
// import Space from "./models/space_long.js";
import View from "./view/view.js";


export const n = 900;      // total area
export const n_vis = 500;  // visible middle area


const space = createSpace(n);
const view = new View(space, n_vis); 

new Controller(space, view);

// ----------------------------------------------------------

function createSpace(n: number) {
    let k_m = +(document.getElementById("k_m") as HTMLInputElement)!.value;
    let l = +(document.getElementById("l") as HTMLInputElement)!.value;
    return new Space(n, k_m, l);  //
}

