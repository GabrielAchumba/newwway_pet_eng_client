<template>
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
</template>

<script>

export default {
  components: {
    
  },
  props:{
    columns: {
        type: Array,
        default: () => []
    },
    rows: {
        type: Array,
        default: () => []
    },
  },
  data() {

    return {

    }
  },
  created(){

  }
}
</script>

<style lang="scss">
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
</style>