import { defineStore } from 'pinia'

export const useDataImportStore = defineStore('dataImport', {
  state: () => ({
    importDialogCaption: "",
    MsExcelWbBook: {
      sheetNames: [],
      sheetsData: [],
    },
    selectedSheetName: "",
    selectedSheetData: [],
    devSurveyVariablesInBuilt: [
      {
        variableName: 'Measured Depth',
        isSelected: false
      },
      {
        variableName: 'Inclination',
        isSelected: false
      },
      {
        variableName: 'Azimuth',
        isSelected: false
      },
      {
        variableName: 'True Vertical Depth',
        isSelected: false
      },
      {
        variableName: 'North/South',
        isSelected: false
      },
      {
        variableName: 'East/West',
        isSelected: false
      },
      {
        variableName: 'Vertical Section',
        isSelected: false
      },
      {
        variableName: 'Dogleg Severity',
        isSelected: false
      },
      {
        variableName: 'Tol',
        isSelected: false
      }
    ],
    devSurveyVariablesInBuilt2: [
      {
        variableName: 'Measured Depth',
        isSelected: false
      },
      {
        variableName: 'Inclination',
        isSelected: false
      },
      {
        variableName: 'Azimuth',
        isSelected: false
      },
      {
        variableName: 'True Vertical Depth',
        isSelected: false
      },
      {
        variableName: 'North/South',
        isSelected: false
      },
      {
        variableName: 'East/West',
        isSelected: false
      },
      {
        variableName: 'Vertical Section',
        isSelected: false
      },
      {
        variableName: 'Dogleg Severity',
        isSelected: false
      },
      {
        variableName: 'Tol',
        isSelected: false
      }
    ],
    sheetHeaders: [],
    selectedSheetHeader: {},
    selectedDevSurveyVariable: {},
    selectedHoleSectionVariable: {},
    selectedTubingStringVariable: {},
    selectedFluidVariable: {},
    MappedVariables: [],
    previewSurveyData: [],
    previewHoleData: [],
    previewTubingStringData: [],
    previewMudPVTData: [],
    holeVariablesInBuilt: [
      {
        variableName: 'Type of hole',
        isSelected: false
      },
      {
        variableName: 'Outer Diameter',
        isSelected: false
      },
      {
        variableName: 'Inner Diameter',
        isSelected: false
      },
      {
        variableName: 'Weight',
        isSelected: false
      },
      {
        variableName: 'Top',
        isSelected: false
      },
      {
        variableName: 'bottom',
        isSelected: false
      },
      {
        variableName: 'frictionFactor',
        isSelected: false
      }
    ],
    holeVariablesInBuilt2: [
      {
        variableName: 'Type of hole',
        isSelected: false
      },
      {
        variableName: 'Outer Diameter',
        isSelected: false
      },
      {
        variableName: 'Inner Diameter',
        isSelected: false
      },
      {
        variableName: 'Weight',
        isSelected: false
      },
      {
        variableName: 'Top',
        isSelected: false
      },
      {
        variableName: 'bottom',
        isSelected: false
      },
      {
        variableName: 'frictionFactor',
        isSelected: false
      }
    ],
    typeOfInput: '',
    TubingStringVariablesInBuilt: [
      {
        variableName: 'Type of Section',
        isSelected: false
      },
      {
        variableName: 'Length',
        isSelected: false
      },
      {
        variableName: 'Measured Depth',
        isSelected: false
      },
      {
        variableName: 'Size',
        isSelected: false
      },
      {
        variableName: 'Weight',
        isSelected: false
      },
      {
        variableName: 'Grade',
        isSelected: false
      },
      {
        variableName: 'Outer Diameter',
        isSelected: false
      },
      {
        variableName: 'Inner Diameter',
        isSelected: false
      },
      {
        variableName: 'Minimum Yield Strength',
        isSelected: false
      },
      {
        variableName: 'Item Description',
        isSelected: false
      },
      {
        variableName: 'Make-Up Torque',
        isSelected: false
      },
      {
        variableName: 'Over-Pull Margin',
        isSelected: false
      }
    ],
    TubingStringVariablesInBuilt2: [
      {
        variableName: 'Type of Section',
        isSelected: false
      },
      {
        variableName: 'Length',
        isSelected: false
      },
      {
        variableName: 'Measured Depth',
        isSelected: false
      },
      {
        variableName: 'Size',
        isSelected: false
      },
      {
        variableName: 'Weight',
        isSelected: false
      },
      {
        variableName: 'Grade',
        isSelected: false
      },
      {
        variableName: 'Outer Diameter',
        isSelected: false
      },
      {
        variableName: 'Inner Diameter',
        isSelected: false
      },
      {
        variableName: 'Minimum Yield Strength',
        isSelected: false
      },
      {
        variableName: 'Item Description',
        isSelected: false
      },
      {
        variableName: 'Make-Up Torque',
        isSelected: false
      },
      {
        variableName: 'Over-Pull Margin',
        isSelected: false
      }
    ],
    FluidVariablesInBuilt: [
      {
        variableName: 'Temperature',
        isSelected: false
      },
      {
        variableName: 'Pressure',
        isSelected: false
      },
      {
        variableName: 'Reference',
        isSelected: false
      },
      {
        variableName: 'Density',
        isSelected: false
      },
      {
        variableName: 'Plastic Viscoity',
        isSelected: false
      },
      {
        variableName: 'Yield Point',
        isSelected: false
      }
    ],
    FluidVariablesInBuilt2: [
      {
        variableName: 'Temperature',
        isSelected: false
      },
      {
        variableName: 'Pressure',
        isSelected: false
      },
      {
        variableName: 'Reference',
        isSelected: false
      },
      {
        variableName: 'Density',
        isSelected: false
      },
      {
        variableName: 'Plastic Viscoity',
        isSelected: false
      },
      {
        variableName: 'Yield Point',
        isSelected: false
      }
    ],
    showLoader: false,
    showImportView: true
  }),

  getters: {
    showImportView: (state) => state.showImportView,
    showLoader: (state) => state.showLoader,
    importDialogCaption: (state) => state.importDialogCaption,
    MsExcelWbBook: (state) => state.MsExcelWbBook,
    selectedSheetName: (state) => state.selectedSheetName,
    selectedSheetData: (state) => state.selectedSheetData,
    devSurveyVariablesInBuilt: (state) => state.devSurveyVariablesInBuilt,
    sheetHeaders: (state) => state.sheetHeaders,
    selectedSheetHeader: (state) => state.selectedSheetHeader,
    selectedDevSurveyVariable: (state) => state.selectedDevSurveyVariable,
    MappedVariables: (state) => state.MappedVariables,
    devSurveyVariablesInBuilt2: (state) => state.devSurveyVariablesInBuilt2,
    previewSurveyData: (state) => state.previewSurveyData,
    holeVariablesInBuilt: (state) => state.holeVariablesInBuilt,
    holeVariablesInBuilt2: (state) => state.holeVariablesInBuilt2,
    selectedHoleSectionVariable: (state) => state.selectedHoleSectionVariable,
    previewHoleData: (state) => state.previewHoleData,
    typeOfInput: (state) => state.typeOfInput,
    TubingStringVariablesInBuilt: (state) => state.TubingStringVariablesInBuilt,
    TubingStringVariablesInBuilt2: (state) => state.TubingStringVariablesInBuilt2,
    previewTubingStringData: (state) => state.previewTubingStringData,
    selectedTubingStringVariable: (state) => state.selectedTubingStringVariable,
    previewMudPVTData: (state) => state.previewMudPVTData,
    selectedFluidVariable: (state) => state.selectedFluidVariable,
    FluidVariablesInBuilt: (state) => state.FluidVariablesInBuilt,
    FluidVariablesInBuilt2: (state) => state.FluidVariablesInBuilt2
  },

  actions: {
    SetLoaderParameters(payload) {
      this.showLoader = payload.showLoader;
      this.showImportView = payload.showImportView;
    },
    
    SetimportDialogCaption(payload) {
      this.importDialogCaption = payload;
    },
    
    GetMsExcelWbBook(payload) {
      this.MsExcelWbBook.sheetNames = payload.sheetNames;
      this.MsExcelWbBook.sheetsData = payload.sheetsData;
      this.selectedSheetData = {};
      this.sheetHeaders = [];
      this.MappedVariables = [];
    },
    
    onItemSelectionChanged(payload) {
      this.selectedSheetName = payload;
      const nCount = this.MsExcelWbBook.sheetNames.length;
      
      for(let i = 0; i < nCount; i++) {
        if(this.selectedSheetName === this.MsExcelWbBook.sheetNames[i]) {
          this.selectedSheetData = this.MsExcelWbBook.sheetsData[i];
          console.log("selectedSheetData: ", this.selectedSheetData);
          
          this.sheetHeaders = [];
          const dataCount = this.selectedSheetData.length;
          
          if(dataCount > 0) {
            const obj = this.selectedSheetData[0];
            const columnHeaders = Object.keys(obj);
            console.log("columnHeaders: ", columnHeaders);
            
            this.sheetHeaders = columnHeaders.map(header => ({
              variableName: header,
              isSelected: false
            }));

            this.devSurveyVariablesInBuilt2 = [...this.devSurveyVariablesInBuilt.map(item => ({...item, isSelected: false}))];
            this.MappedVariables = [];
            this.previewSurveyData = [];
          }
          break;
        }
      }
    },
    
    OnHoleSectionSelectionChanged(payload) {
      this.selectedSheetName = payload;
      const nCount = this.MsExcelWbBook.sheetNames.length;
      
      for(let i = 0; i < nCount; i++) {
        if(this.selectedSheetName === this.MsExcelWbBook.sheetNames[i]) {
          this.selectedSheetData = this.MsExcelWbBook.sheetsData[i];
          console.log("selectedSheetData: ", this.selectedSheetData);
          
          this.sheetHeaders = [];
          const dataCount = this.selectedSheetData.length;
          
          if(dataCount > 0) {
            const obj = this.selectedSheetData[0];
            const columnHeaders = Object.keys(obj);
            
            this.sheetHeaders = columnHeaders.map(header => ({
              variableName: header,
              isSelected: false
            }));

            this.holeVariablesInBuilt2 = [...this.holeVariablesInBuilt.map(item => ({...item, isSelected: false}))];
            this.MappedVariables = [];
            this.previewHoleData = [];
          }
          break;
        }
      }
    },
    
    OnTubingStringSelectionChanged(payload) {
      this.selectedSheetName = payload;
      const nCount = this.MsExcelWbBook.sheetNames.length;
      
      for(let i = 0; i < nCount; i++) {
        if(this.selectedSheetName === this.MsExcelWbBook.sheetNames[i]) {
          this.selectedSheetData = this.MsExcelWbBook.sheetsData[i];
          this.sheetHeaders = [];
          const dataCount = this.selectedSheetData.length;
          
          if(dataCount > 0) {
            const obj = this.selectedSheetData[0];
            const columnHeaders = Object.keys(obj);
            
            this.sheetHeaders = columnHeaders.map(header => ({
              variableName: header,
              isSelected: false
            }));

            this.TubingStringVariablesInBuilt2 = [...this.TubingStringVariablesInBuilt.map(item => ({...item, isSelected: false}))];
            this.MappedVariables = [];
            this.previewTubingStringData = [];
          }
          break;
        }
      }
    },
    
    OnFluidSelectionChanged(payload) {
      this.selectedSheetName = payload;
      const nCount = this.MsExcelWbBook.sheetNames.length;
      
      for(let i = 0; i < nCount; i++) {
        if(this.selectedSheetName === this.MsExcelWbBook.sheetNames[i]) {
          this.selectedSheetData = this.MsExcelWbBook.sheetsData[i];
          this.sheetHeaders = [];
          const dataCount = this.selectedSheetData.length;
          
          if(dataCount > 0) {
            const obj = this.selectedSheetData[0];
            const columnHeaders = Object.keys(obj);
            
            this.sheetHeaders = columnHeaders.map(header => ({
              variableName: header,
              isSelected: false
            }));

            this.FluidVariablesInBuilt2 = [...this.FluidVariablesInBuilt.map(item => ({...item, isSelected: false}))];
            this.MappedVariables = [];
            this.previewMudPVTData = [];
          }
          break;
        }
      }
    },
    
    GetselectedSheetHeader(payload) {
      this.selectedSheetHeader = payload;
      this.sheetHeaders = this.sheetHeaders.map(header => ({
        ...header,
        isSelected: header.variableName === payload.variableName
      }));
    },
    
    GetselectedDevSurveyVariable(payload) {
      this.selectedDevSurveyVariable = payload;
      this.devSurveyVariablesInBuilt2 = this.devSurveyVariablesInBuilt2.map(item => ({
        ...item,
        isSelected: item.variableName === payload.variableName
      }));
      console.log("selectedDevSurveyVariable:", this.selectedDevSurveyVariable);
    },
    
    GetselectedHoleSectionVariable(payload) {
      this.selectedHoleSectionVariable = payload;
      this.holeVariablesInBuilt2 = this.holeVariablesInBuilt2.map(item => ({
        ...item,
        isSelected: item.variableName === payload.variableName
      }));
    },
    
    GetselectedTubingStringVariable(payload) {
      this.selectedTubingStringVariable = payload;
      this.TubingStringVariablesInBuilt2 = this.TubingStringVariablesInBuilt2.map(item => ({
        ...item,
        isSelected: item.variableName === payload.variableName
      }));
    },
    
    GetselectedFluidVariable(payload) {
      this.selectedFluidVariable = payload;
      this.FluidVariablesInBuilt2 = this.FluidVariablesInBuilt2.map(item => ({
        ...item,
        isSelected: item.variableName === payload.variableName
      }));
    },
    
    AddMappedVariable() {
      this.sheetHeaders = this.sheetHeaders.filter(
        header => header.variableName !== this.selectedSheetHeader.variableName
      );
      
      this.devSurveyVariablesInBuilt2 = this.devSurveyVariablesInBuilt2.filter(
        item => item.variableName !== this.selectedDevSurveyVariable.variableName
      );
      
      this.MappedVariables.push({
        SheetHeaderName: this.selectedSheetHeader.variableName,
        DevSurveyVariable: this.selectedDevSurveyVariable.variableName
      });
    },
    
    AddMappedHoleSectionVariable() {
      this.sheetHeaders = this.sheetHeaders.filter(
        header => header.variableName !== this.selectedSheetHeader.variableName
      );
      
      this.holeVariablesInBuilt2 = this.holeVariablesInBuilt2.filter(
        item => item.variableName !== this.selectedHoleSectionVariable.variableName
      );
      
      this.MappedVariables.push({
        SheetHeaderName: this.selectedSheetHeader.variableName,
        HoleSectionVariable: this.selectedHoleSectionVariable.variableName
      });
    },
    
    AddMappedTubingStringVariable() {
      this.sheetHeaders = this.sheetHeaders.filter(
        header => header.variableName !== this.selectedSheetHeader.variableName
      );
      
      this.TubingStringVariablesInBuilt2 = this.TubingStringVariablesInBuilt2.filter(
        item => item.variableName !== this.selectedTubingStringVariable.variableName
      );
      
      this.MappedVariables.push({
        SheetHeaderName: this.selectedSheetHeader.variableName,
        TubingStringVariable: this.selectedTubingStringVariable.variableName
      });
    },
    
    AddMappedFluidVariable() {
      this.sheetHeaders = this.sheetHeaders.filter(
        header => header.variableName !== this.selectedSheetHeader.variableName
      );
      
      this.FluidVariablesInBuilt2 = this.FluidVariablesInBuilt2.filter(
        item => item.variableName !== this.selectedFluidVariable.variableName
      );
      
      this.MappedVariables.push({
        SheetHeaderName: this.selectedSheetHeader.variableName,
        FluidVariable: this.selectedFluidVariable.variableName
      });
    },
    
    DeleteVariable(payload) {
      const index = this.MappedVariables.findIndex(
        item => item.SheetHeaderName === payload.SheetHeaderName && 
               item.DevSurveyVariable === payload.DevSurveyVariable
      );
      
      if (index !== -1) {
        this.sheetHeaders.push({
          variableName: payload.SheetHeaderName,
          isSelected: false
        });
        
        this.devSurveyVariablesInBuilt2.push({
          variableName: payload.DevSurveyVariable,
          isSelected: false
        });
        
        this.MappedVariables.splice(index, 1);
      }
    },
    
    DeleteHoleSectionVariable(payload) {
      const index = this.MappedVariables.findIndex(
        item => item.SheetHeaderName === payload.SheetHeaderName && 
               item.HoleSectionVariable === payload.HoleSectionVariable
      );
      
      if (index !== -1) {
        this.sheetHeaders.push({
          variableName: payload.SheetHeaderName,
          isSelected: false
        });
        
        this.holeVariablesInBuilt2.push({
          variableName: payload.HoleSectionVariable,
          isSelected: false
        });
        
        this.MappedVariables.splice(index, 1);
      }
    },
    
    DeleteTubingStringVariable(payload) {
      const index = this.MappedVariables.findIndex(
        item => item.SheetHeaderName === payload.SheetHeaderName && 
               item.TubingStringVariable === payload.TubingStringVariable
      );
      
      if (index !== -1) {
        this.sheetHeaders.push({
          variableName: payload.SheetHeaderName,
          isSelected: false
        });
        
        this.TubingStringVariablesInBuilt2.push({
          variableName: payload.TubingStringVariable,
          isSelected: false
        });
        
        this.MappedVariables.splice(index, 1);
      }
    },
    
    DeleteFluidVariable(payload) {
      const index = this.MappedVariables.findIndex(
        item => item.SheetHeaderName === payload.SheetHeaderName && 
               item.FluidVariable === payload.FluidVariable
      );
      
      if (index !== -1) {
        this.sheetHeaders.push({
          variableName: payload.SheetHeaderName,
          isSelected: false
        });
        
        this.FluidVariablesInBuilt2.push({
          variableName: payload.FluidVariable,
          isSelected: false
        });
        
        this.MappedVariables.splice(index, 1);
      }
    },
    
    GetDevSurveyPreview(payload) {
      this.previewSurveyData = [];
      const jCount = this.MappedVariables.length;
      const nCount = this.selectedSheetData.length;
      
      for(let i = 1; i < nCount; i++) {
        const obj = this.selectedSheetData[i];
        let md = 0, inc = 0, azi = 0, tvd = 0, ns = 0, ew = 0, vsection = 0, dleg = 0, toll = "";
        
        for(let j = 0; j < jCount; j++) {
          try {
            switch(this.MappedVariables[j].DevSurveyVariable) {
              case "Measured Depth":
                md = obj[this.MappedVariables[j].SheetHeaderName];
                break;
              case "Inclination":
                inc = obj[this.MappedVariables[j].SheetHeaderName];
                break;
              case "Azimuth":
                azi = obj[this.MappedVariables[j].SheetHeaderName];
                break;
              case "True Vertical Depth":
                tvd = obj[this.MappedVariables[j].SheetHeaderName];
                break;
              case "North/South":
                ns = obj[this.MappedVariables[j].SheetHeaderName];
                break;
              case "East/West":
                ew = obj[this.MappedVariables[j].SheetHeaderName];
                break;
              case "Vertical Section":
                vsection = obj[this.MappedVariables[j].SheetHeaderName];
                break;
              case "Dogleg Severity":
                dleg = obj[this.MappedVariables[j].SheetHeaderName];
                break;
              case "Tol":
                toll = obj[this.MappedVariables[j].SheetHeaderName];
                break;
            }
          } catch(err) {
            console.log("error: ", err);
          }
        }

        this.previewSurveyData.push({
          measuredDepth: md,
          inclination: inc,
          azimuth: azi,
          designId: payload.designId,
          userId: payload.userId,
          doglegSeverity: dleg,
          isSelected: false,
          northSouth: ns,
          eastWest: ew,
          trueVerticalDepth: tvd,
          verticalSection: vsection,
          tol: toll
        });
      }
    },
    
    GetHoleSectionPreview(payload) {
      this.previewHoleData = [];
      const jCount = this.MappedVariables.length;
      const nCount = this.selectedSheetData.length;
      
      for(let i = 1; i < nCount; i++) {
        const obj = this.selectedSheetData[i];
        let typeOfHole = "", outerDiameter = 0, innerDiameter = 0, weight = 0, 
            top = 0, bottom = 0, frictionFactor = 0;
        
        for(let j = 0; j < jCount; j++) {
          switch(this.MappedVariables[j].HoleSectionVariable) {
            case "Type of hole":
              typeOfHole = obj[this.MappedVariables[j].SheetHeaderName];
              break;
            case "Outer Diameter":
              outerDiameter = obj[this.MappedVariables[j].SheetHeaderName];
              break;
            case "Inner Diameter":
              innerDiameter = obj[this.MappedVariables[j].SheetHeaderName];
              break;
            case "Weight":
              weight = obj[this.MappedVariables[j].SheetHeaderName];
              break;
            case "Top":
              top = obj[this.MappedVariables[j].SheetHeaderName];
              break;
            case "bottom":
              bottom = obj[this.MappedVariables[j].SheetHeaderName];
              break;
            case "frictionFactor":
              frictionFactor = obj[this.MappedVariables[j].SheetHeaderName];
              break;
          }
        }

        this.previewHoleData.push({
          typeOfHole: typeOfHole,
          outerDiameter: outerDiameter,
          innerDiameter: innerDiameter,
          weight: weight,
          topOfHole: top,
          bottomOfHole: bottom,
          frictionFactor: frictionFactor,
          designId: payload.designId,
          userId: payload.userId,
          isSelected: false
        });
      }
    },
    
    GetTubingStringPreview(payload) {
      this.previewTubingStringData = [];
      const jCount = this.MappedVariables.length;
      const nCount = this.selectedSheetData.length;
      
      for(let i = 1; i < nCount; i++) {
        const obj = this.selectedSheetData[i];
        let typeOfSection = "", length = 0, measuredDepth = 0, size = 0, weight = 0, 
            grade = "", outerDiameter = 0, innerDiameter = 0, minimumYieldStrength = 0, 
            itemDescription = "", makeUpTorque = 0, overPullMargin = 0;
        
        for(let j = 0; j < jCount; j++) {
          switch(this.MappedVariables[j].TubingStringVariable) {
            case "Type of Section":
              typeOfSection = obj[this.MappedVariables[j].SheetHeaderName];
              break;
            case "Length":
              length = obj[this.MappedVariables[j].SheetHeaderName];
              break;
            case "Measured Depth":
              measuredDepth = obj[this.MappedVariables[j].SheetHeaderName];
              break;
            case "Size":
              size = obj[this.MappedVariables[j].SheetHeaderName];
              break;
            case "Weight":
              weight = obj[this.MappedVariables[j].SheetHeaderName];
              break;
            case "Grade":
              grade = obj[this.MappedVariables[j].SheetHeaderName];
              break;
            case "Outer Diameter":
              outerDiameter = obj[this.MappedVariables[j].SheetHeaderName];
              break;
            case "Inner Diameter":
              innerDiameter = obj[this.MappedVariables[j].SheetHeaderName];
              break;
            case "Minimum Yield Strength":
              minimumYieldStrength = obj[this.MappedVariables[j].SheetHeaderName];
              break;
            case "Item Description":
              itemDescription = obj[this.MappedVariables[j].SheetHeaderName];
              break;
            case "Make-Up Torque":
              makeUpTorque = obj[this.MappedVariables[j].SheetHeaderName];
              break;
            case "Over-Pull Margin":
              overPullMargin = obj[this.MappedVariables[j].SheetHeaderName];
              break;
          }
        }

        this.previewTubingStringData.push({
          typeOfSection: typeOfSection,
          length: length,
          measuredDepth: measuredDepth,
          size: size,
          weight: weight,
          grade: grade,
          outerDiameter: outerDiameter,
          innerDiameter: innerDiameter,
          minimumYieldStrength: minimumYieldStrength,
          itemDescription: itemDescription,
          makeUpTorque: makeUpTorque,
          overPullMargin: overPullMargin,
          designId: payload.designId,
          isSelected: false
        });
      }
    },
    
    GetFluidPreview(payload) {
      this.previewMudPVTData = [];
      const jCount = this.MappedVariables.length;
      const nCount = this.selectedSheetData.length;
      
      for(let i = 1; i < nCount; i++) {
        const obj = this.selectedSheetData[i];
        let temperature = 0, pressure = 0, reference = "", density = 0, 
            plasticViscoity = 0, yieldPoint = 0;
        
        for(let j = 0; j < jCount; j++) {
          switch(this.MappedVariables[j].FluidVariable) {
            case "Temperature":
              temperature = obj[this.MappedVariables[j].SheetHeaderName];
              break;
            case "Pressure":
              pressure = obj[this.MappedVariables[j].SheetHeaderName];
              break;
            case "Reference":
              reference = obj[this.MappedVariables[j].SheetHeaderName];
              break;
            case "Density":
              density = obj[this.MappedVariables[j].SheetHeaderName];
              break;
            case "Plastic Viscoity":
              plasticViscoity = obj[this.MappedVariables[j].SheetHeaderName];
              break;
            case "Yield Point":
              yieldPoint = obj[this.MappedVariables[j].SheetHeaderName];
              break;
          }
        }

        this.previewMudPVTData.push({
          temperature: temperature,
          pressure: pressure,
          reference: reference,
          density: density,
          plasticViscoity: plasticViscoity,
          yieldPoint: yieldPoint
        });
      }
    },
    
    SetTypeOfInput(payload) {
      this.typeOfInput = payload;
    }
  }
});