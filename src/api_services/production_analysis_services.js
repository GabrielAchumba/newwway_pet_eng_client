import {
  get,
  remove,
  post,
  put,
  uploadPhoto,
  https
} from "src/httpservices/services";


const chunkArrayDynamic = (array, maxRowsPerChunk = 1000) => {
  // Calculate number of chunks automatically
  const numberOfChunks = Math.ceil(array.length / maxRowsPerChunk);

  // Calculate dynamic chunk size based on array length and number of chunks
  const size = Math.ceil(array.length / numberOfChunks);

  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

export const storeProductionRecordsInChunks = async (productionRecords) => {

    const dataChunks = chunkArrayDynamic(productionRecords);

    for (const chunk of dataChunks) {

        try {
            var response = await post({
                url: "assets",
                req: {...chunk}
            });

            return response;

        } catch (error) {

            console.log("error: ", error)
            return error;
        }
    }
}


export const fetchProductionHistory = async () => {

    var response = await get({url: "asset-groups"});
    return response.data;
}