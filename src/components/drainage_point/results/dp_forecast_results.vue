<template>
  <div>
    <Table :table_VM="table_VM"/>  
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import Table from '../../tables/Table2.vue';

export default defineComponent({
  name: 'DPForecastResult',
  components:{
    Table
  },
  props: {
    selectedComponent: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['saved', 'cancel'],
  setup(props, { emit }) {
    console.log("props.selectedComponent: ", props.selectedComponent)

    const table_VM = ref({
        title: "",
        separator: "cell",
        columns: [
        {
            name: 'prodDate',
            required: true,
            label: 'Date',
            align: 'left',
            field: row => row.prodDate,
            sortable: true,
            headerClasses: 'text-primary bg-secondary'
        },
        {
            name: 'wellHeadPressure',
            required: true,
            label: 'Wellhead Pressure',
            align: 'left',
            field: row => row.wellHeadPressure,
            sortable: true,
            headerClasses: 'text-primary bg-secondary'
        },
        {
            name: 'bottonHolePressure',
            required: true,
            label: 'Bottomhole Pressure',
            align: 'left',
            field: row => row.bottonHolePressure,
            sortable: true,
            headerClasses: 'text-primary bg-secondary'
        },
        {
            name: 'reservoirPressure',
            required: true,
            label: 'Reservoir Pressure',
            align: 'left',
            field: row => row.reservoirPressure,
            sortable: true,
            headerClasses: 'text-primary bg-secondary'
        },
        {
            name: 'oilRate',
            required: true,
            label: 'Oil Rate',
            align: 'left',
            field: row => row.oilRate,
            sortable: true,
            headerClasses: 'text-primary bg-secondary'
        },
        {
            name: 'gasRate',
            label: 'Gas Rate',
            align: 'left',
            field: row => row.gasRate,
            sortable: true,
            headerClasses: 'text-primary bg-secondary'
        },
        {
            name: 'waterRate',
            label: 'Water Rate',
            align: 'left',
            field: row => row.waterRate,
            sortable: true,
            headerClasses: 'text-primary bg-secondary'
        },
        {
            name: 'liquidRate',
            label: 'Liquid Rate',
            align: 'left',
            field: row => row.liquidRate,
            sortable: true,
            headerClasses: 'text-primary bg-secondary'
        },
        {
            name: 'gor',
            label: 'Gas Oil Ratio',
            align: 'left',
            field: row => row.gor,
            sortable: true,
            headerClasses: 'text-primary bg-secondary'
        },
        {
            name: 'waterCut',
            label: 'Water Cut',
            align: 'left',
            field: row => row.waterCut,
            sortable: true,
            headerClasses: 'text-primary bg-secondary'
        },
        {
            name: 'cumulativeOil',
            label: 'Cumulative Oil',
            align: 'left',
            field: row => row.cumulativeOil,
            sortable: true,
            headerClasses: 'text-primary bg-secondary'
        },
        {
            name: 'cumulativeGas',
            label: 'Cumulative Gas',
            align: 'left',
            field: row => row.cumulativeGas,
            sortable: true,
            headerClasses: 'text-primary bg-secondary'
        },
        {
            name: 'cumulativeWater',
            label: 'Cumulative Water',
            align: 'left',
            field: row => row.cumulativeWater,
            sortable: true,
            headerClasses: 'text-primary bg-secondary'
        }
        ],
        rows: Array(100).fill().map((_, idx)=> {
            return {
                id: idx,
                prodDate: null,
                wellHeadPressure: null,
                bottonHolePressure: null,
                reservoirPressure: null,
                oilRate: null,
                gasRate: null,
                waterRate: null,
                liquidRate: null,
                gor: null,
                waterCut: null,
                cumulativeOil: null,
                cumulativeGas: null,
                cumulativeWater: null,
            }
        })

    });


    const handleSave = () => {
      emit('saved', props.selectedComponent);
    };

    const handleCancel = () => {
      emit('cancel');
    };

    return {
        table_VM
    };
  }
});
</script>

<style scoped>
</style>