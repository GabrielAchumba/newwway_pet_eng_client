// Module = Drainage_PointName + _ + ProjectCode = {Schema = Drainage_PointName ,FieldName, WellName, ProductionStringName, ReservoirName, Drainage_PointId ,FieldId, WellId, ProductionStringId, ReservoirId}

// Drainage_Point = Field + ModifiedWell + ModifiedProductionString + _ + ModifiedReservoir {Schema = Drainage_PointName ,FieldName, WellName, ProductionStringName, ReservoirName, Drainage_PointId ,FieldId, WellId, ProductionStringId, ReservoirId}

// Well = {Schema = FieldName, WellName, WellId, FieldId}. WellName = FieldName + WellWithoutSring

// ProductionString = T, L, S (Must be a Letter word) = T {Shema = ProductionStringName, ProductionStringId assetGroupName,assetGroupId}

// Reservoir = {Schema = FieldName, ReservoirName, FieldId, ReservoirId} ReservoirName = FieldName + _ + ReservoirWithoutFieldName


// Fied = {Schema = FieldName, FieldId }