export const min = (xs) => {
    if(xs.length === 0) return 0;
    let xmin = xs[0];
    for(let i = 0; i < xs.length; i++){
        if(xs[i] < xmin){
            xmin = xs[i];
        }
    }
    return xmin;
}

export const max = (xs) => {
    if(xs.length === 0) return 0;
    let xmax = xs[0];
    for(let i = 0; i < xs.length; i++){
        if(xs[i] > xmax){
            xmax = xs[i];
        }
    }
    return xmax;
}