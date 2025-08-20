let wellAccessories = [
    {
        name: "Pipe1",
        top: 50,
        width: 50,
        lenght: 500,
        inclination: 0,
        cumHorizontalDisplacement: 0,
    },
    {
        name: "Pipe2",
        top: 550,
        width: 50,
        lenght: 100,
        inclination: 10,
        cumHorizontalDisplacement: 0,
    },
    {
        name: "Pipe3",
        top: 650,
        width: 50,
        lenght: 500,
        inclination: 30,
        cumHorizontalDisplacement: 0,
    },
    {
        name: "Pipe4",
        top: 1150,
        width: 50,
        lenght: 500,
        inclination: 50,
        cumHorizontalDisplacement: 0,
    }
];

const xOffset = 50;
const yOffset = 50;

const calculateHorizontalDisplacement = (wellAccessory) => {

    const inc_rad = (wellAccessory.inclination * Math.PI) / 180;

    const horizontalDisplacement = wellAccessory.lenght * Math.sin(inc_rad);

    return horizontalDisplacement;
}

const calculateHorizontalDisplacements = () => {

    const updatedHorizontalDisplacemnts = wellAccessories.map((wellAccessory, idx) => {

        let horizontalDisplacement = calculateHorizontalDisplacement(wellAccessory);

        let updatedWellAccessory = {
            horizontalDisplacement: horizontalDisplacement,
            cumHorizontalDisplacement: idx == 0 ? 9 : 
            horizontalDisplacement + wellAccessories[idx-1].cumHorizontalDisplacement
        }
        

        return {
            ...wellAccessory,
        }
    })

    return updatedHorizontalDisplacemnts;
}

const calculateAccessoiriesCenter = (wellAccessory, cumHorizontalDisplacementBefore) => {

    const cx = xOffset + cumHorizontalDisplacementBefore + wellAccessory.width /2.0;

    const cy = yOffset + wellAccessory.top + wellAccessory.lenght/2;

    return {
        cx,
        cy
    };
}

export const calculateCentersOld = () => {
    let cumulativeX = xOffset; // starting horizontal pos
    let cumulativeY = yOffset; // starting vertical pos
    let prevEndX = cumulativeX;
    let prevEndY = cumulativeY;

    return wellAccessories.map((acc, idx) => {
        const rad = acc.inclination * Math.PI / 180;
        const horiz = acc.length * Math.sin(rad);
        const vert = acc.length * Math.cos(rad);

        // Center = midpoint between start and end
        const cx = prevEndX + horiz / 2;
        const cy = prevEndY + vert / 2;

        // End of this pipe = start + vector
        prevEndX += horiz;
        prevEndY += vert;

        return {
            ...acc,
            horizontalDisplacement: horiz,
            cumHorizontalDisplacement: prevEndX - xOffset,
            cx,
            cy
        };
    });
};

const calculateAccessoiriesCenters = () => {

    const updatedHorizontalDisplacemnts = calculateHorizontalDisplacements();

    const updatedWellAccessoriesCenters = updatedHorizontalDisplacemnts.map((wellAccessory, idx) => {

        const cumHorizontalDisplacementBefore = idx == 0 ? 0 : wellAccessory[idx].cumHorizontalDisplacement;

        const accessoryCenter = calculateAccessoiriesCenter(wellAccessory, cumHorizontalDisplacementBefore);

        return {
            ...wellAccessory,
            ...accessoryCenter
        }
    });

    return updatedWellAccessoriesCenters;
}

const calculateWellAccessoryCornerPointsAndPath = (wellAccessory) => {

    const hw = wellAccessory.width / 2;
    const hh = wellAccessory.lenght / 2;

    //const angle = (wellAccessory.inclination * Math.PI) / 180; // convert degrees to radians
    const angle = (-wellAccessory.inclination * Math.PI) / 180; // negative for clockwise rotation

    // Calculate rotated corners
    const corners = [
    { x: -hw, y: -hh },
    { x: hw, y: -hh },
    { x: hw, y: hh },
    { x: -hw, y: hh },
    ].map(p => {
    const rx = p.x * Math.cos(angle) - p.y * Math.sin(angle);
    const ry = p.x * Math.sin(angle) + p.y * Math.cos(angle);
    return { x: cx + rx, y: cy + ry };
    });

    // Build SVG path
    const path = `M ${corners[0].x},${corners[0].y}
                L ${corners[1].x},${corners[1].y}
                L ${corners[2].x},${corners[2].y}
                L ${corners[3].x},${corners[3].y}
                Z`;

    return {
        corners,
        path
    };

}

export const calculateWellAccessoriesCornerPointsAndPaths = () => {

    const accessoiriesCenters = calculateAccessoiriesCenters();

    const wellAccessoriesCornerPointsAndPath = accessoiriesCenters.map((wellAccessory) => {

        const cornersPath = calculateWellAccessoryCornerPointsAndPath(wellAccessory);

        return {
            ...wellAccessory,
            ...cornersPath
        }

    });

    return wellAccessoriesCornerPointsAndPath;
}

export const calculateXYAxesLimits = (estimatedLastWellAccessory) => {

    let xAxisLimit = xOffset + estimatedLastWellAccessory.cumHorizontalDisplacement + estimatedLastWellAccessory.width + xOffset;
    let yAxisLimit = yOffset + estimatedLastWellAccessory.top + estimatedLastWellAccessory.lenght + yOffset;

    return {
        xAxisLimit,
        yAxisLimit
    }

}