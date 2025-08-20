export const ArithmeticData = (a, b, i, n) => {
	const d  = (b - a) / (n-1)
	return a + (i-1)*d
}

export const GeometricData = (a, b, i, n) => {
	const r = Math.pow((b / a), ((1 / (n - 1))))
	return a * Math.pow(r, (i-1))
}

export const ArithmeticArray = (a, b, n) => {
    const arr = [];
    arr.push(a)
    for(let i = 1; i < n; i++){
        arr.push(ArithmeticData(a, b, i+1, n))
    }
    return arr
}

export const GeometricArray = (a, b, n) => {
	const arr = [];
    arr.push(a)
    for(let i = 1; i < n; i++){
        arr.push(GeometricData(a, b, i+1, n))
    }
    return arr
}
