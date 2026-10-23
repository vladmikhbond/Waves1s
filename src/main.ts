import Controller from "./conroller/controller.js";
import { getParams } from "./conroller/params.js";
import Space from "./models/space.js";
import View from "./view/view.js";

// params from index.html              
let ps = getParams("infoParams")!;  // "w: 1400, h: 600, ma(rgin): 200, k: 0.99, loss: 0.0"            
const space = new Space(ps.w, ps.ma, ps.k,  ps.loss);
const view = new View(space);
new Controller(space, view, ps.h);

view.show();
