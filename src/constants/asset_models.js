export const WELLMODELS = [
    {
        id: 0, type: 'No Flow', label: 'No Flow'
    },
    {
        id: 1, type: 'DCA', label: 'DCA'
    },
    {
        id: 2, type: 'IPR/VLP intersection', label: 'IPR/VLP intersection'
    }
]

export const WELLTYPES = [
      {
        sn: 1,
        id: 1,
        variable: 'Oil Producer',
        value: 'Oil Producer',
        label: 'Oil Producer',
        type: 'Oil Producer',
      },
      {
        sn: 2,
        id: 2,
        variable: 'Water Injector',
        value: 'Water Injector',
        label: 'Water Injector',
        type: 'Water Injector',
      },
      {
        sn: 3,
        id: 3,
        variable: 'Gas Injector',
        value: 'Gas Injector',
        label: 'Gas Injector',
        type: 'Gas Injector',
      },
      {
        sn: 4,
        id: 4,
        variable: 'ESP Producer',
        value: 'ESP Producer',
        label: 'ESP Producer',
        type: 'ESP Producer',
      },
      {
        sn: 5,
        id: 5,
        variable: 'Producer Gas Lift',
        value: 'Producer Gas Lift',
        label: 'Producer Gas Lift',
        type: 'Producer Gas Lift',
      },
      {
        sn: 6,
        id: 6,
        variable: 'Dry Gas Producer',
        value: 'Dry Gas Producer',
        label: 'Dry Gas Producer',
        type: 'Dry Gas Producer',
      },
      {
        sn: 7,
        id: 7,
        variable: 'Retrograde Condensate Producer',
        value: 'Retrograde Condensate Producer',
        label: 'Retrograde Condensate Producer',
        type: 'Retrograde Condensate Producer',
      }
    ];

    export const DECLINEMETHODS = [
        {
            sn: 1,
            id: 1,
            variable: 'Exponential',
            value: 'Exponential',
            label: 'Exponential',
            type: 'Exponential',
        },
        {
            sn: 2,
            id: 2,
            variable: 'Harmonic',
            value: 'Harmonic',
            label: 'Harmonic',
            type: 'Harmonic',
        },
        {
            sn: 3,
            id: 3,
            variable: 'Hyperbolic',
            value: 'Hyperbolic',
            label: 'Hyperbolic',
            type: 'Hyperbolic',
        }
    ]

    export const FLUIDTYPES = [
        {
            sn: 1,
            id: 1,
            variable: 'Oil',
            value: 'Oil',
            label: 'Oil',
            type: 'Oil',
        },
        {
            sn: 2,
            id: 2,
            variable: 'Gas',
            value: 'Gas',
            label: 'Gas',
            type: 'Gas',
        },
        {
            sn: 3,
            id: 3,
            variable: 'Ret. Condensate',
            value: 'Ret. Condensate',
            label: 'Ret. Condensate',
            type: 'Ret. Condensate',
        },
        {
            sn: 4,
            id: 4,
            variable: 'Water',
            value: 'Water',
            label: 'Water',
            type: 'Water',
        }
    ]

    export const OILIPRTYPES = [
      {
          id: 1,
          variable: 'Vogel',
          value: 'Vogel',
          label: 'Vogel',
          type: 'Vogel',
      }
    ]

    export const GASIPRTYPES = [
      {
          id: 1,
          variable: 'Forcheimer',
          value: 'Forcheimer',
          label: 'Forcheimer',
          type: 'Forcheimer',
      },
      {
          id: 1,
          variable: 'C and n',
          value: 'C and n',
          label: 'C and n',
          type: 'C and n',
      }
    ]

    export const EVENTTYPES = [
      {
          id: 0,
          variable: null,
          value: null,
          label: null,
          type: null,
      },
      {
          id: 1,
          variable: 'Change Constraints',
          value: 'Change Constraints',
          label: 'Change Constraints',
          type: 'Change Constraints',
      },
      {
          id: 2,
          variable: 'Start Well',
          value: 'Start Well',
          label: 'Start Well',
          type: 'Start Well',
      },
      {
          id: 3,
          variable: 'Stop Well',
          value: 'Stop Well',
          label: 'Stop Well',
          type: 'Stop Well',
      }
    ]

    export const CONSTRAINTTYPES = [
      {
          id: 0,
          variable: null,
          value: null,
          label: null,
          type: null,
      },
      {
          id: 1,
          variable: 'Minimum Gas Oil Ratio',
          value: 'Minimum Gas Oil Ratio',
          label: 'Minimum Gas Oil Ratio',
          type: 'Minimum Gas Oil Ratio',
      },
      {
          id: 2,
          variable: 'Maximum Gas Oil Ratio',
          value: 'Maximum Gas Oil Ratio',
          label: 'Maximum Gas Oil Ratio',
          type: 'Maximum Gas Oil Ratio',
      },
      {
          id: 3,
          variable: 'Minimum Water Cut',
          value: 'Minimum Water Cut',
          label: 'Minimum Water Cut',
          type: 'Minimum Water Cut',
      },
      {
          id: 4,
          variable: 'Maximum Water Cut',
          value: 'Maximum Water Cut',
          label: 'Maximum Water Cut',
          type: 'Maximum Water Cut',
      },
      {
          id: 5,
          variable: 'Minimum Oil Rate',
          value: 'Minimum Oil Rate',
          label: 'Minimum Oil Rate',
          type: 'Minimum Oil Rate',
      },
      {
          id: 6,
          variable: 'Maximum Oil Rate',
          value: 'Maximum Oil Rate',
          label: 'Maximum Oil Rate',
          type: 'Maximum Oil Rate',
      },
      {
          id: 7,
          variable:  'Maximum Drawdown',
          value: 'Maximum Drawdown',
          label: 'Maximum Drawdown',
          type: 'Maximum Drawdown',
      },
      {
          id: 8,
          variable:  'Minimum Pwf',
          value: 'Minimum Pwf',
          label: 'Minimum Pwf',
          type: 'Minimum Pwf',
      }
    ]

    export const VLPSENSITIVITYVARIABLES = {
        'Water Cut': {
          name: "WC",
          value: 0,
        }, 
        'Water Gas Ratio': {
          name: "WGR",
          value: 0,
        },
        'Water Oil Ratio': {
          name: "WOR",
          value: 0,
        }, 
        'Gas Oil Ratio': {
          name: "GOR",
          value: 0,
        }, 
        'Condensate Rate Ratio': {
          name: "CGR",
          value: 0,
        }, 
        'GLR Free': {
          name: "GLRFree",
          value: 0,
        },
        'Free Gas Rate': {
          name: "FreeGasRate",
          value: 0,
        },
        'GOR Free': {
          name: "GORFree",
          value: 0,
        },
        'Total GOR': {
          name: "TotalGOR",
          value: 0,
        },
        'Dissolved and Free GLR': {
          name: "DissolvedFreeGLR",
          value: 0,
        },
        'First Node Pressure': {
          name: "FirstNodePressure",
          value: 0,
        },
        'Tubing Roughness': {
          name: "TubingRoughness",
          value: 0,
        },
        'Downhole Heat Transfer Coefficient': {
          name: "DownholeHeatTransferCoefficient",
          value: 0,

        }
    }