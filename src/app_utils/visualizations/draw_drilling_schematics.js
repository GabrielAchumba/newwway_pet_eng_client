let wellAccessories = [
    { name: "Pipe1", top: 50,  width: 200, length: 500,  cumHorizontalDisplacement: 0 },
    { name: "Pipe2", top: 550, width: 200, length: 100, cumHorizontalDisplacement: 0 },
    { name: "Pipe3", top: 650, width: 200, length: 500,  cumHorizontalDisplacement: 0 },
    { name: "Pipe4", top: 1150, width: 200, length: 500, cumHorizontalDisplacement: 0 }
];

const devSurvey =  [
    { measuredDepth: 0, inclination: 0 },
    { measuredDepth: 500, inclination: 10 },
    { measuredDepth: 600, inclination: 30 },
    { measuredDepth: 1100, inclination: 40 },
    { measuredDepth: 1700, inclination: 60 },
    { measuredDepth: 2400, inclination: 70 },
];

const xOffset = 50;
const yOffset = 50;
const interval = 50; // ft step

// Helper: interpolate inclination from devSurvey
const getInclinationAtDepth = (depth) => {
    // Find the two survey points surrounding this depth
    for (let i = 0; i < devSurvey.length - 1; i++) {
        const p1 = devSurvey[i];
        const p2 = devSurvey[i + 1];
        if (depth >= p1.measuredDepth && depth <= p2.measuredDepth) {
            const ratio = (depth - p1.measuredDepth) / (p2.measuredDepth - p1.measuredDepth);
            return p1.inclination + ratio * (p2.inclination - p1.inclination);
        }
    }
    // If depth is before first point or after last point
    if (depth <= devSurvey[0].measuredDepth) return devSurvey[0].inclination;
    return devSurvey[devSurvey.length - 1].inclination;
};


export const calculateCentersOld = () => {
    let prevEndX = xOffset;
    let prevEndY = yOffset;

    return wellAccessories.map((acc, idx) => {
        const rad = acc.inclination * Math.PI / 180;
        const horiz = acc.length * Math.sin(rad);
        const vert = acc.length * Math.cos(rad);

        // The start point is the previous pipe's end point
        const startX = prevEndX;
        const startY = prevEndY;

        // End point of this pipe
        const endX = startX + horiz;
        const endY = startY + vert;

        // Center point = midpoint between start and end
        const cx = (startX + endX) / 2;
        const cy = (startY + endY) / 2;

        // Update for the next loop — next pipe starts exactly where this one ends
        prevEndX = endX;
        prevEndY = endY;

        return {
            ...acc,
            horizontalDisplacement: horiz,
            cumHorizontalDisplacement: endX - xOffset,
            cx,
            cy
        };
    });
};

export const calculateCentersOld2 = () => {
    let prevEndX = xOffset;
    let prevEndY = yOffset;

    return wellAccessories.map((acc) => {
        // Calculate inclination by averaging start and end depth inclinations
        const startIncl = getInclinationAtDepth(acc.top);
        const endIncl = getInclinationAtDepth(acc.top + acc.length);
        const inclination = (startIncl + endIncl) / 2; // smooth transition

        const rad = inclination * Math.PI / 180;
        const horiz = acc.length * Math.sin(rad);
        const vert = acc.length * Math.cos(rad);

        // Start position from previous pipe end
        const startX = prevEndX;
        const startY = prevEndY;

        // End position
        const endX = startX + horiz;
        const endY = startY + vert;

        // Center of pipe
        const cx = (startX + endX) / 2;
        const cy = (startY + endY) / 2;

        // Update for next loop
        prevEndX = endX;
        prevEndY = endY;

        return {
            ...acc,
            inclination,
            horizontalDisplacement: horiz,
            cumHorizontalDisplacement: endX - xOffset,
            cx,
            cy
        };
    });
};

export const calculateCenters = () => {
  let prevEndX = xOffset;
  let prevEndY = yOffset;

  const allPieces = [];

  wellAccessories.forEach((acc) => {
    const numSteps = Math.ceil(acc.length / interval);
    let currentTop = acc.top;

    for (let step = 0; step < numSteps; step++) {
      const segLength = (step === numSteps - 1)
        ? acc.length - interval * (numSteps - 1)
        : interval;

      const startIncl = getInclinationAtDepth(currentTop);
      const endIncl = getInclinationAtDepth(currentTop + segLength);
      const inclination = (startIncl + endIncl) / 2;

      const rad = inclination * Math.PI / 180;
      const horiz = segLength * Math.sin(rad);
      const vert = segLength * Math.cos(rad);

      const startX = prevEndX;
      const startY = prevEndY;
      const endX = startX + horiz;
      const endY = startY + vert;

      const cx = (startX + endX) / 2;
      const cy = (startY + endY) / 2;

      allPieces.push({
        name: `${acc.name}_part${step + 1}`,
        top: currentTop,
        width: acc.width,
        length: segLength,
        inclination,
        horizontalDisplacement: horiz,
        cumHorizontalDisplacement: endX - xOffset,
        cx,
        cy
      });

      prevEndX = endX;
      prevEndY = endY;
      currentTop += segLength;
    }
  });

  return allPieces;
};




export const getRotatedPath = (cx, cy, width, length, inclination) => {
    const hw = width / 2;
    const hh = length / 2;
    const angle = (-inclination * Math.PI) / 180; // clockwise rotation

    const corners = [
        { x: -hw, y: -hh },
        { x: hw, y: -hh },
        { x: hw, y: hh },
        { x: -hw, y: hh }
    ].map(p => {
        const rx = p.x * Math.cos(angle) - p.y * Math.sin(angle);
        const ry = p.x * Math.sin(angle) + p.y * Math.cos(angle);
        return { x: cx + rx, y: cy + ry };
    });

    return `M ${corners[0].x},${corners[0].y} 
            L ${corners[1].x},${corners[1].y} 
            L ${corners[2].x},${corners[2].y} 
            L ${corners[3].x},${corners[3].y} Z`;
}

export const calculateXYAxesLimits = (estimatedLastWellAccessory) => {
    const xAxisLimit = estimatedLastWellAccessory.cx + estimatedLastWellAccessory.width;
    const yAxisLimit = estimatedLastWellAccessory.cy + estimatedLastWellAccessory.length;
    return { xAxisLimit, yAxisLimit };
};