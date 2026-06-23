


import { Mono, Oscillator} from "../models/oscillator";
import Receiver from "../models/receiver";
import Space from "../models/space";
import { Node } from "../models/space";
 
export function takeFocusOff() {
    (<HTMLCanvasElement>document.getElementById("canvas")).focus();
}

// Зберігає поточний стан об'єкта space в форматі JSON.
export function sceneToJson(space: Space): string {
    const data = {
        size: space.size,
        margin: space.margin,
        k: space.k,
        time: space.time,
        selNodeIdx: space.selNodeIdx,
        nodes: space.nodes.map((node) => ({
            u: node.u,
            v: node.v,
            loss: node.loss,
            is_stone: node.is_stone,
        })),
        oscillators: space.oscillators.map((osc) => ({
            type: osc instanceof Mono ? "Mono" : "Oscillator",
            amp: osc.amp,
            ph: osc.ph,
            dph: osc.dph,
            vx: osc.vx,
            i: osc.i,
        })),
        receivers: space.receivers.map((rec) => ({
            i: rec.i,
            loss: rec.loss,
            energy: rec.energy,
        })),
    };

    return JSON.stringify(data, null, 2);
}

function restoreOscillator(data: any, space: Space): Oscillator | null {
    if (!data || typeof data !== "object") {
        return null;
    }

    const amp = Number(data.amp) || 0;
    const vx = Number(data.vx) || 0;
    const i = Number(data.i) || 0;
    let osc: Oscillator;

if (data.type === "Mono") {
        osc = new Mono(amp, 0, 0, i, space);
    } else {
        osc = new Oscillator(amp, 0, 0, vx, i, space);
    }

    if (typeof data.dph === "number") {
        osc.dph = data.dph;
    }
    if (typeof data.ph === "number") {
        osc.ph = data.ph;
    }
    osc.vx = vx;
    osc.i = i;

    return osc;
}

// Відновлює стан об'єкта space з рядка json.
export function restoreSceneFromJson(json: string, space: Space): void {
    if (!json) {
        return;
    }

    let data: any;
    try {
        data = JSON.parse(json);
    } catch (error) {
        console.error("restoreSceneFromJson: invalid JSON", error);
        return;
    }

    if (!data || typeof data !== "object") {
        return;
    }

    if (typeof data.size === "number") {
        space.size = data.size;
    }
    if (typeof data.margin === "number") {
        space.margin = data.margin;
    }
    if (typeof data.k === "number") {
        space.k = data.k;
    }
    if (typeof data.time === "number") {
        space.time = data.time;
    }
    space.selNodeIdx = typeof data.selNodeIdx === "number" ? data.selNodeIdx : -1;

    const nodeCount = space.size + space.margin * 2;
    space.nodes = new Array(nodeCount);
    const savedNodes = Array.isArray(data.nodes) ? data.nodes : [];

    for (let idx = 0; idx < nodeCount; idx++) {
        const saved = savedNodes[idx] || {};
        const node = new Node();
        node.u = typeof saved.u === "number" ? saved.u : 0;
        node.v = typeof saved.v === "number" ? saved.v : 0;
        node.loss = typeof saved.loss === "number" ? saved.loss : 0;
        node.is_stone = Boolean(saved.is_stone);
        space.nodes[idx] = node;
    }

    space.oscillators = [];
    if (Array.isArray(data.oscillators)) {
        for (const oscData of data.oscillators) {
            const osc = restoreOscillator(oscData, space);
            if (osc) {
                space.addOscillator(osc);
            }
        }
    }

    space.receivers = [];
    if (Array.isArray(data.receivers)) {
        for (const recData of data.receivers) {
            if (!recData || typeof recData !== "object") {
                continue;
            }
            const i = Number(recData.i) || 0;
            const loss = Number(recData.loss) || 0;
            const receiver = new Receiver(i, loss, space);
            receiver.energy = Number(recData.energy) || 0;
            space.addReceiver(receiver);
        }
    }
}
