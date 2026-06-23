import Controller from "./conroller/controller.js";
import { getSpaceParams,  getSizeParams,  } from "./conroller/params.js";
import Space from "./models/space.js";
import View from "./view/view.js";

// params from index.html              
let [size, margin] = getSizeParams()!;
let [k,  loss] = getSpaceParams()!;

const space = new Space(size, margin, k,  loss);
const view = new View(space);
new Controller(space, view);

view.show();
