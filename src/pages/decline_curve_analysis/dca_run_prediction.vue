<template>
  <q-page class="report-page">
    <Toolbox :buttons="toolboxButtons" />
    <q-card class="report-card">
      <q-table
        flat
        bordered
        :rows="rows"
        :columns="columns"
        row-key="id"
        hide-pagination
        :pagination="{ rowsPerPage: 0 }"
        class="report-table"
        :card-class="{'bg-card-bg': true}"
        :grid="false"
      />
    </q-card>
  </q-page>
</template>

<script>
import Toolbox from 'src/components/headers/CustomToolBox.vue';
import { usePropertyGridStore } from 'src/store/modules/propertyGridStore';
import { useAssetsExplorerStore } from 'src/store/modules/assetsExplorerStore';
import { wells } from 'src/temp_database/decline_curve_analysis/dca_run_prediction_bk';

const propertyGridStore = usePropertyGridStore();
const assetsExplorerStore = useAssetsExplorerStore();


export default {
  components: {
    Toolbox
  },
  data() {

    return {
        toolboxButtons: [
            {
            icon: 'save',
            tooltip: 'Save',
            handler: this.saveData,
            class: 'text-secondary'
            },
            {
            icon: 'cancel',
            tooltip: 'Cancel',
            handler: this.cancelChanges,
            class: 'text-secondary'
            },
            {
            icon: 'line_axis',
            tooltip: 'Plot', // Plot on calcuted DCA
            handler: this.saveData,
            class: 'text-secondary'
            },
            {
            icon: 'play_arrow',
            tooltip: 'Calculate', // Calculate and plot calculated DCA and production history
            handler: this.cancelChanges,
            class: 'text-secondary'
            },
        ],
        columns: [
        {
            name: 'date',
            required: true,
            label: 'Time (yyyy-d-m)',
            align: 'left',
            field: row => row.date,
            sortable: true,
            headerClasses: 'text-primary bg-secondary'
        },
        {
            name: 'cumOilProduced',
            label: 'Cum Oil Produced (MMSTB)',
            align: 'left',
            field: row => row.cumOilProduced,
            sortable: true,
            headerClasses: 'text-primary bg-secondary'
        },
        {
            name: 'oilRate',
            label: 'Oil Rate (STB/day)',
            align: 'left',
            field: row => row.oilRate,
            sortable: true,
            headerClasses: 'text-primary bg-secondary'
        }
        ],
      rows: [
        { id: 1, date: '2023-01-01', cumOilProduced: '1,250', oilRate: '125' },
        { id: 2, date: '2023-01-02', cumOilProduced: '1,500', oilRate: '250' },
        { id: 3, date: '2023-01-03', cumOilProduced: '1,750', oilRate: '250' },
        { id: 4, date: '2023-01-04', cumOilProduced: '2,000', oilRate: '250' },
        { id: 5, date: '2023-01-05', cumOilProduced: '2,300', oilRate: '300' },
        { id: 6, date: '2023-01-06', cumOilProduced: '2,600', oilRate: '300' },
        { id: 7, date: '2023-01-07', cumOilProduced: '2,900', oilRate: '300' },
        { id: 8, date: '2023-01-08', cumOilProduced: '3,250', oilRate: '350' },
        { id: 9, date: '2023-01-09', cumOilProduced: '3,600', oilRate: '350' },
        { id: 10, date: '2023-01-10', cumOilProduced: '4,000', oilRate: '400' },
        { id: 11, date: '2023-01-01', cumOilProduced: '1,250', oilRate: '125' },
        { id: 12, date: '2023-01-02', cumOilProduced: '1,500', oilRate: '250' },
        { id: 13, date: '2023-01-03', cumOilProduced: '1,750', oilRate: '250' },
        { id: 14, date: '2023-01-04', cumOilProduced: '2,000', oilRate: '250' },
        { id: 15, date: '2023-01-05', cumOilProduced: '2,300', oilRate: '300' },
        { id: 16, date: '2023-01-06', cumOilProduced: '2,600', oilRate: '300' },
        { id: 17, date: '2023-01-07', cumOilProduced: '2,900', oilRate: '300' },
        { id: 18, date: '2023-01-08', cumOilProduced: '3,250', oilRate: '350' },
        { id: 19, date: '2023-01-09', cumOilProduced: '3,600', oilRate: '350' },
        { id: 20, date: '2023-01-10', cumOilProduced: '4,000', oilRate: '400' }
        ]
    }
  },
  created(){
    propertyGridStore.SetIsPropertyGridActivated(false);
    assetsExplorerStore.SetIsAssetsExplorerActivated(true);
  }
}
</script>

<style lang="scss">
.report-page {
  background-color: $primary;
  height: 100vh;
  padding: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .report-card {
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: $primary;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    overflow: hidden;

    .report-table {
      flex: 1;
      display: flex;
      flex-direction: column;
      border-collapse: collapse;

      .q-table__top,
      .q-table__bottom {
        background-color: $primary;
      }

      .q-table__container {
        flex: 1;
        display: flex;
        flex-direction: column;
        background-color: $primary;
        border: 1px solid rgba(0, 0, 0, 0.12);
      }

      .q-table__middle {
        flex: 1;
        overflow-y: auto;
        max-height: calc(100vh - 120px);
        
        &::-webkit-scrollbar {
          width: 8px;
        }
        
        &::-webkit-scrollbar-thumb {
          background-color: rgba($secondary, 0.2);
          border-radius: 4px;
        }
      }

      .q-table__grid-content {
        overflow-y: auto;
      }

      .q-table thead tr {
        position: sticky;
        top: 0;
        z-index: 1;
        background-color: $secondary;
        color: $primary;
      }

      .q-table tbody tr {
        background-color: $primary;
      }

      .q-table th, .q-table td {
        border-right: 1px solid rgba(0, 0, 0, 0.12);
        &:last-child {
          border-right: none;
        }
      }

      .q-table th {
        font-weight: 600;
        font-size: 14px;
        color: $primary;
        border-bottom: 2px solid rgba(0, 0, 0, 0.12);
      }

      .q-table td {
        font-size: 13px;
        color: $forecolor1;
        border-bottom: 1px solid rgba(0, 0, 0, 0.12);
      }
    }
  }
}
</style>