const Flowstation = 'https://cdn-icons-png.flaticon.com/512/3342/3342132.png';


const getEquipmentImage = (internalExternalFacilitiesNames, node) => {

    //console.log("getEquipmentImage - internalExternalFacilitiesNames: ", internalExternalFacilitiesNames)

  // Default image/shape
  let image = Flowstation;

  for (const item of internalExternalFacilitiesNames) {
    if (item.originalExternalEquipmentName === node) {
      return item.image || Flowstation; // fall back if image property is missing
    }
  }

  return image;
};

// { id: 'ABU_FS1', label: 'ABU_FS1', x: 500, y: -200, color: '#3498db', shape: 'image', image: Flowstation, font: { size: 16, color: 'black' } },

export const getUniqueNodesEquipments = (equipmentConnections) => {

    // Assuming equipmentConnections is already defined as in your data

    //console.log("getUniqueNodesEquipments - equipmentConnections: ", equipmentConnections)

    const nodeKeys = Object.keys(equipmentConnections[0]);

    const uniqueNodes = nodeKeys.reduce((acc, key) => {
    // Create a Set to remove duplicates, then spread back into an array
    acc[key] = [...new Set(equipmentConnections.map(item => item[key]))];
    return acc;
    }, {});

    return { nodeKeys, uniqueNodes };
}

const linspace = (start, end, n) => {
  if (n === 1) return [start]; // edge case
  const step = (end - start) / (n - 1);
  return Array.from({ length: n }, (_, i) => start + i * step);
}



export const getSurfaceNodes = (equipmentConnections, internalExternalFacilitiesNames) => {

    //console.log("getSurfaceNodes - equipmentConnections: ", equipmentConnections)

    const XLayout = 2000;
    const YLayout = 1000;
    const XStart = 0;
    const YStart = 0;

    const surfaceNodes = [];

    const { nodeKeys, uniqueNodes } = getUniqueNodesEquipments(equipmentConnections);

    const xPoints = linspace(XStart, XLayout, nodeKeys.length);

    nodeKeys.forEach((nodeKey, i) => {
        const nodes = uniqueNodes[nodeKey];
        if (!nodes || nodes.length === 0) return;

        const yPoints = linspace(YStart, YLayout, nodes.length);

        nodes.forEach((node, j) => {

            if(!node) return;

            const surfaceNodeIdx = surfaceNodes.findIndex(_surfaceNodes => _surfaceNodes.id == node);

            if(surfaceNodeIdx < 0){

                const image = getEquipmentImage(internalExternalFacilitiesNames, node);

                surfaceNodes.push({
                    id: node,
                    label: node,
                    x: xPoints[i],
                    y: yPoints[j],
                    color: '#3498db',
                    shape:'image', 
                    image,
                    font: {
                    size: 16,
                    color: 'black'
                    }
                });
            }else{
                //const idx = surfaceNodes.length - 1;
                surfaceNodes[surfaceNodeIdx].x = xPoints[i];
                surfaceNodes[surfaceNodeIdx].y = yPoints[j];
            }
        });
  });


   return surfaceNodes;
}


export const getConnections = (equipmentConnections) => {

    //console.log("getConnections - equipmentConnections: ", equipmentConnections)

    const connections = [];

    equipmentConnections.forEach((equipmentsConnection) => {

        const nodeKeys = Object.keys(equipmentsConnection);

        nodeKeys.forEach((nodeKey, j) => {

            if(!nodeKey) return;

            if(j > 0){
                const previousNode = nodeKeys[j-1];
                connections.push({
                    from: equipmentsConnection[previousNode], 
                    to: equipmentsConnection[nodeKey],
                })
            }
        });
    });

  return connections;
}