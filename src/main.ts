import Controller from "./conroller/controller.js";
import { getSpaceParams,  getSizeParams,  } from "./conroller/params.js";
import Space from "./models/space.js";
import View from "./view/view.js";

// params from index.html              
let ps = getSizeParams()!;                
let[w, h, margin] = ps;
let [k,  loss] = getSpaceParams()!;

const space = new Space(w, margin, k,  loss);
const view = new View(space);
new Controller(space, view, h);

view.show();
