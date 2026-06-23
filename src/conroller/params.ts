
type N2 = [number, number];
type N4 = [number, number, number, number];

export function getSizeParams(): N2 | null
{
    const paramsElement = (document.getElementById("sizeParams") as HTMLInputElement)!;
    let ps: N2;
    try {
        ps = (new Function("", 
            "let size, margin;" + 
            paramsElement.value + 
            "; return [size, margin]" 
        ))();
    } catch {
        return errMesage("Grammar error", paramsElement);
    }
    // перевірки
    if (ps[0] == undefined || ps[0] < 100) 
        return errMesage("Size must by >= 100", paramsElement);

    if (ps[1] == undefined || ps[1] < 0 || ps[1] > ps[0] / 2 )
        return errMesage("Margin: 0 < margin < size/2", paramsElement);

    paramsElement.style.backgroundColor = "";
    return ps;
}

export function getSpaceParams(): N2 | null
{
    const paramsElement = (document.getElementById("spaceParams") as HTMLInputElement)!;
    let ps: N2;
    try {
        ps = (new Function("", 
            "let k, loss;" + 
            paramsElement.value + 
            "; return [k,  loss]" 
        ))();
    } catch {
        return errMesage("Grammar error", paramsElement);
    }
    // перевірки
    if (ps[0] == undefined || ps[0] < 0 || ps[0] > 1)
        return errMesage("K: 0 < k < 1", paramsElement);

    if (ps[1] == undefined || ps[1] < 0 || ps[1] > 1)
        return errMesage("Loss: 0 < loss < 1", paramsElement);
    paramsElement.style.backgroundColor = "";
    return ps;
}

export function getOscilParams(): N4 | null
{
    const paramsElement = (document.getElementById("oscilParams") as HTMLInputElement)!;
    let ps: N4;
 
    try {
        ps = (new Function("", 
            "let amp, q, vx, la;" + 
            paramsElement.value +
            "; return [amp, q, vx, la]" )
        )();
        } catch {
        return errMesage("Grammar error", paramsElement);
    }
    // перевірки
    if (ps[0] == undefined) 
        return errMesage("Amplitude (amp) is undefined", paramsElement);
    if (ps[1] == undefined && ps[3] == undefined)
        return errMesage("Wave number (q) and Wave length (la) are undefined", paramsElement);
    if (ps[2] == undefined)
        return errMesage("Hor velocity (vx) is undefined", paramsElement);
    paramsElement.style.backgroundColor = "";
    return ps;
}

export function getReceiverParams(): [number] | null {
    const paramsElement = (document.getElementById("recieverParams") as HTMLInputElement)!;
    let ps: [number];

    try {
        ps = (new Function("", 
             "let loss;" + 
            paramsElement.value +
            "; return [loss];"
        ))();
        } catch {
        return errMesage("Grammar error", paramsElement);
    }
    // перевірки
    if (ps[0] == undefined || ps[0] < 0 || ps[0] > 1) 
        return errMesage("Loss: 0 <= loss <= 1", paramsElement);
    paramsElement.style.backgroundColor = "";
    return ps;
}


function errMesage(mes: string, el: HTMLInputElement) {
    alert (mes);
    el.style.backgroundColor = "pink";
    return null;
}