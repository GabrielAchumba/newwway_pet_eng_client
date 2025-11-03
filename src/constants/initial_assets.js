export const constraintConditions = [
                'Initial GOR/CGR',
                'Abandonment GOR/CGR', 
                'Initial BSW/WGR',
                'Abandonment BSW/WGR',
                'Initial Oil/Gas Rate',
                'Abandonment Oil/Gas Rate',
                'Maximum Drawdown',
                'Minimum Pwf'
            ];

export const constraintUnits = [
                'scf/stb | stb/MMscf',
                'scf/stb | stb/MMscf',
                'percent',
                'percent',
                'stb/d | MMscf/d',
                'stb/d | MMscf/d',
                'psia',
                'psia',
            ];


export const INITIALDRAINAGEPOINT = {
        DCA: {
            initialCumProd: null,
            ultimateRecovery: null,
            plateauPeriod: 0,
            selectedDeclineMethod: null,
            rateDeclineRate: null,
            gasFractionDeclineRate: null,
            waterFractionDeclineRate: null,
        },
        IPR: {
            selectedIPRType: null,
            productivityIndex: null,
            reservoirPressure: null,
            reservoirTemperature: null,
            oilGravity: null,
            gasGravity: null,
            gasFraction: null,
            waterFraction: null,
            waterSalinity: null,
            h2S: null,
            co2: null,
            n2: null,
        },
        VLP: {
            liftCurveName: ""
        },
        Configure: {
            dpName: null,
            selectedWellModel: null,
            onStreamDate: new Date().toISOString().split('T')[0],
            selectedFluidType: null,
            selectedWellType: null
        },
        Constraints: constraintConditions.map((constraintCondition, idx) => {
            return {
                id: idx,
                abandonmentCondtion: constraintCondition,
                abandonmentValue: null,
                abandonmentUnit: constraintUnits[idx],
                constraintId: null
            }
        }),
        Schedule: Array(50).fill().map((_, idx)=> {
            return {
                id: idx,
                scheduleDate: null,
                eventType: null,
                constraintType: null,
                newValue: null,
                scheduleUnit: null,
                scheduleId: 0
            }
        })
    };

    export const INITIALDRAINAGEPOINT2 = {
        DCA: {
            initialCumProd: null,
            ultimateRecovery: null,
            plateauPeriod: 0,
            selectedDeclineMethod: null,
            rateDeclineRate: null,
            gasFractionDeclineRate: null,
            waterFractionDeclineRate: null,
        },
        IPR: {
            selectedIPRType: null,
            productivityIndex: null,
            reservoirPressure: null,
            reservoirTemperature: null,
            oilGravity: null,
            gasGravity: null,
            gasFraction: null,
            waterFraction: null,
            waterSalinity: null,
            h2S: null,
            co2: null,
            n2: null,
        },
        VLP: {
            liftCurveName: ""
        },
        Configure: {
            dpName: null,
            selectedWellModel: null,
            onStreamDate: new Date().toISOString().split('T')[0],
            selectedFluidType: null
        },
        Constraints: [
            { id: 0, abandonmentCondtion: 'Minimum Gas Oil Ratio', abandonmentValue: null, abandonmentUnit: 'scf/stb'},
            { id: 1, abandonmentCondtion: 'Maximum Gas Oil Ratio', abandonmentValue: null, abandonmentUnit: 'scf/stb' },
            { id: 2, abandonmentCondtion: 'Minimum Water Cut', abandonmentValue: null, abandonmentUnit: 'percent'},
            { id: 3, abandonmentCondtion: 'Maximum Water Cut', abandonmentValue: null, abandonmentUnit: 'percent' },
            { id: 4, abandonmentCondtion: 'Minimum Oil Rate', abandonmentValue: null, abandonmentUnit: 'stb/d' },
            { id: 5, abandonmentCondtion: 'Maximum Oil Rate', abandonmentValue: null, abandonmentUnit: 'stb/d' },
            { id: 6, abandonmentCondtion: 'Maximum Drawdown', abandonmentValue: null, abandonmentUnit: 'psia' },
            { id: 7, abandonmentCondtion: 'Minimum Pwf', abandonmentValue: null, abandonmentUnit: 'psia' }, //Min Pwf = Max THP
            ],
        Schedule: Array(20).fill().map((_, idx)=> {
            return {
                id: idx,
                scheduleDate: null,
                eventType: null,
                constraintType: null,
                newValue: null,
                scheduleUnit: null,
            }
        })
    };