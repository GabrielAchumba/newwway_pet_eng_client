<template>
  <div>

    <q-table 
      :rows="table_VM.rows"
      :title="table_VM.title"
      :columns="table_VM.columns" 
      row-key="name" 
      binary-state-sort
      :rows-per-page-options="[]"
      :separator="table_VM.separator"
      :filter="filter"
      :filter-method="customFilter"  
      :loading="loading"
      :wrap-cells="autoWidth"
      class="screenwide q-ma-sm"
      bordered
      >

        <template v-slot:top-right>
          <q-icon
              v-if="table_VM.isImport" 
              class="col"
              name="add" 
              @click="createItem"
              size="20px">
              <q-tooltip>
                Import Table
              </q-tooltip>
            </q-icon>

            <q-icon 
            v-if="table_VM.isExport"
              class="col"
              name="table_view" 
              @click="exportTable"
              size="20px">
              <q-tooltip>
                Export Table
              </q-tooltip>
            </q-icon>
        </template>

          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th
                v-for="col in props.cols"
                :key="col.name"
                :props="props"
                class="bg-info text-primary"
              >
                {{ col.label }}
              </q-th>
            </q-tr>
          </template>

          <template v-slot:body="props">
              <q-tr 
              :props="props">
                <q-td 
                v-for="column in fixedkeys()" :key="column.name"
                :props="props">
                   {{ props.row[column.name]}}
                </q-td>

                <q-td key="actions" :props="props">
                    <div class="row q-pa-sm text-center">
                        <q-toggle
                          v-model="checkBoxModels[props.row.sn-1]"
                          color="accent"
                          false-value="Disagreed"
                          true-value="Agreed"
                        />
                        <q-icon 
                        name="delete" 
                        @click="deleteItem(props.row)"
                        size="sm" />
                    </div>
                </q-td>

                <q-td 
                v-for="column in removekeys()" :key="column.name"
                :props="props">
                  <div
                  v-if="column.isText">
                    {{ props.row[column.name] }}
                  </div>
                  <!-- {{ props.row[column.name] }} -->
                    <q-popup-edit
                    v-if="column.isText"
                    v-model="props.row[column.name]" auto-save buttons v-slot="scope">
                        <q-input v-model="scope.value" dense autofocus counter @keyup.enter="scope.set" />
                    </q-popup-edit>
                     <q-btn 
                      v-if="column.isButton"
                      :class="setCellBackground(props.row[column.name])"
                      style="width:100%"
                      :label="props.row[column.name]"
                      type="button"
                      no-caps
                      @click="cellButtonAction({actionName:column.actionName, cellPosition: props.row[column.name]})"
                    />
                </q-td>

                <!-- <q-td 
                v-for="column in removekeys()" :key="column.name"
                :props="props">
                    <q-btn 
                    v-if="column.isText"
                    class="q-ma-sm bg-accent text-primary"
                      style="width:100%"
                      :label="props.row[column.name]"
                      type="button"
                      no-caps
                      @click="cellButtonAction({actionName:column.actionName, cellPosition: props.row[column.name]})"
                    />
                </q-td> -->
              </q-tr>
          </template>
    </q-table>

  </div>
</template>

<script>
    import { exportFile } from 'quasar'
    //import { tableVM } from "./TableVM";
    import CardList from "../cards/Card4Table.vue";
    import Search from "../searches/Search.vue";
    import { useAuthStore } from 'src/store/modules/authStore';

    const authStore = useAuthStore();

    function wrapCsvValue (val, formatFn, row) {
      let formatted = formatFn !== void 0
        ? formatFn(val, row)
        : val

      formatted = formatted === void 0 || formatted === null
        ? ''
        : String(formatted)

      formatted = formatted.split('"').join('""')

      return `"${formatted}"`
    }
    export default {
        computed:{
          isMobile(){
            return authStore.isMobile;
          },
          rows(){ 
            return authStore.newRows;
          },
          setIsResponsive(){
            console.log("setIsResponsive called")
            if(window.innerWidth < 700) return true
            else return false;
          },
          filter() {
            var context = this;
            return {
              search: context.search,     
            }
          }
        },
        components:{
          CardList,
          Search,
        },
        props: {
            isResponsive:{
              type: Boolean,
              default: false
            },
            table_VM:{
                type: Object,
                default: () => {
                    return []
                },
            },
            isHeader:{
              type:Boolean,
              default: true
            },
            tableRows:{
              type: Array,
              default: () => {
                  return []
              }
            }
        },
        data(){
          return {
            autoWidth: true,
            qToggleModel: "Disagreed",
            tableWidth: window.innerWidth < 700 ? `${window.innerWidth * 0.6}px`: "100%",
            cardWidth: window.innerWidth < 700 ? `${window.innerWidth * 0.7}px`: "100%",
            loading: false,
            rowCount: 10,
            windowResize: false,  
            search: '',
            checkBoxModels: [],
          }
        },
        methods: {
          getRowColIndices(txt){
              const txt1 = txt.replace(/\s/g, '');
              const arr1 = txt1.split("(")
              const arr2 = arr1[1].split(")")
              const arr3 = arr2[0].split(",")
              return {row: Number(arr3[0]), col: Number(arr3[1])}
          },
          setCellBackground(cellPosition){
            var context = this;
            const { row, col } = context.getRowColIndices(cellPosition)
            const background = context.table_VM.rows2[row-1][col].background
            return background

          },
          cellButtonAction(payload){
            this.$emit("cellButtonAction", payload)
          },
          customFilter(rows, terms){
            // rows contain the entire data
            // terms contains whatever you have as filter
            
            //console.log(terms,rows)
            
            var lowerSearch = terms.search ? terms.search.toLowerCase() : ""

            const filteredRows = rows.filter(
              (row, i) =>{
              
              //Gather search condition    

              
              //Assume true in case there is no search 
              let s1 = true
              
              //If search term exists, convert to lower case and see which rows contain it
              if(lowerSearch != ""){
                s1 = false
                //Get the values
                let s1_values = Object.values(row)
                //Convert to lowercase
                let s1_lower = s1_values.map(x => x.toString().toLowerCase())
              
                for (let val = 0; val<s1_lower.length; val++){
                  if (s1_lower[val].includes(lowerSearch)){
                    s1 = true
                    break
                  }
                }
              }

              return s1

              })

            return filteredRows
          },
            linkClick(row){
              this.$emit("linkClick", row)
            },
            fixedkeys(){
              var context = this;
              var columnsNew = []
              for(const column of context.table_VM.columns){
                  if(column.name === "actions" 
                  || column.name === "route"  
                  || column.name === "sn"
                  || column.name === "ij"
                  || column.name === "jk"
                  || column.name === "ik"
                  || column.name === "ji"
                  || column.name === "kj"
                  || column.name === "ki"){
                      columnsNew.push(column);
                  }
              }

              return columnsNew;
          },
            removekeys(){
              var context = this;
              var columnsNew = []
              for(const column of context.table_VM.columns){
                  if(column.name != "actions" 
                  && column.name != "route"  
                  && column.name != "sn"
                  && column.name != "ij"
                  && column.name != "jk"
                  && column.name != "ik"
                  && column.name != "ji"
                  && column.name != "kj"
                  && column.name != "ki"){
                      columnsNew.push(column);
                  }
              }
              return columnsNew;
          },
          okayEvent(){
            var context = this;
            context.isFetchTableDialog = false
          },
          cancelEvent(){
            var context = this;
            context.isFetchTableDialog = false
          },
          createItem(){
              console.log("importCollection")
              this.$emit("importCollection");
          },
          updateItem(selectedItem){
            var context = this;
            this.$emit(context.table_VM.updateItem, selectedItem);
          },
          deleteItem(selectedItem){
            var context = this
            this.$emit(context.table_VM.deleteItem, selectedItem);
          },
          deleteAllItems(){
            var context = this;
            this.$emit("deleteAllItems", context.checkBoxModels);
          },
          dataImport(){
            var context = this;
            console.log('context.table_VM.dataImport: ', context.table_VM.dataImport)
            this.$emit(context.table_VM.dataImport);
          },
          exportTable () {
            // naive encoding to csv format
            var context = this;
            const content = [context.table_VM.columns.map(col => wrapCsvValue(col.label))].concat(
              context.table_VM.rows.map(row => context.table_VM.columns.map(col => wrapCsvValue(
                typeof col.field === 'function'
                  ? col.field(row)
                  : row[ col.field === void 0 ? col.name : col.field ],
                col.format,
                row
              )).join(','))
            ).join('\r\n')

            const status = exportFile(
              'table-export.csv',
              content,
              'text/csv'
            )

            if (status !== true) {
              /* $q.notify({
                message: 'Browser denied file download...',
                color: 'negative',
                icon: 'warning'
              }) */
            }
          },
          onResize(e) {
            const width = window.innerWidth;
            var context = this;
            if(width < 700) {
              context.tableWidth = `${width * 0.6}px`;
              context.cardWidth = `${width * 0.7}px`;
              context.windowResize = true;
              console.log("windowResize: ", context.windowResize)
            }else{
              context.tableWidth = "100%"
              context.cardWidth = "100%"
              context.windowResize = false;
              console.log("windowResize: ", context.windowResize)
            }
          },
          onToggleAllTableRows(event){
            var context = this;
            console.log("event: ", event)
            for(let i = 0; i < context.checkBoxModels.length; i++){
              context.checkBoxModels[i] = event;
            }
          },

      },
      watch: {
          tableRows: function(val) {
              //console.log("val: ", val)
              if (val) {
                var context = this;
                context.checkBoxModels = [];
                context.checkBoxModels = context.rows.map((row) => {
                  return "Disagreed";
                })
              }
          }
      },
      mounted() {
        window.addEventListener("resize", this.onResize);
      },
      unmounted() {
        window.removeEventListener("resize", this.onResize);
      },
      created(){
        var context = this
        context.checkBoxModels = context.table_VM.rows.map((row) => {
          return "Disagreed";
        })
      }
    }
</script>

<style scoped>

.screenwide{
  max-width: 100% !important
}
	

/* .screenwide .q-table{
  max-width: 100% !important
}
	 */
</style>