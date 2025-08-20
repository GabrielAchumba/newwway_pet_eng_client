<template>
    <div>
        <div class="row q-pa-none flex flex-center">
             <q-card class="col-md-4 col-lg-4 col-xl-4 col-sm-12 col-xs-12 q-pa-sm">
                 <q-card-section class="bg-primary text-accent">
                   <q-form class="q-pa-sm">
                       <div
                            class="q-pa-sm">
                            <span>
                            <p class="q-ma-sm">Application Column</p>
                             <NSelect
                                v-for="applicationColumn in applicationColumns" 
                                :key="applicationColumn.id"
                                :qSelect="applicationColumn"
                                @onQSelectItemValueChanged="onApplicationColumnChanged($event)"
                                @onToggle="onToggle($event)"/>
                            </span>
                        </div>
                   </q-form>
                 </q-card-section>
            </q-card>

            <q-card class="col-md-4 col-lg-4 col-xl-4 col-sm-12 col-xs-12 q-pa-sm">
                 <q-card-section class="bg-primary text-accent">
                   <q-form class="q-pa-sm">
                       <div
                            class="q-pa-sm">
                            <span>
                            <p class="q-ma-sm">Worksheet Column</p>
                            <NSelect
                             v-for="worksheetColumn in worksheetColumns" 
                             :key="worksheetColumn.id"
                             :qSelect="worksheetColumn"
                             @onQSelectItemValueChanged="onWorksheetColumnChanged($event)"/>
                            </span>
                        </div>
                   </q-form>
                 </q-card-section>
            </q-card>

             <q-card class="col-md-4 col-lg-4 col-xl-4 col-sm-12 col-xs-12 q-pa-sm">
                 <q-card-section class="bg-primary text-accent">
                   <q-form class="q-pa-sm">
                       <div
                            class="q-pa-sm">
                            <span>
                            <p class="q-ma-sm">Data Type</p>
                            <NSelect
                             v-for="dataType in dataTypes" 
                             :key="dataType.id"
                             :qSelect="dataType"
                             @onQSelectItemValueChanged="onDataTypeChanged($event)"/>
                            </span>
                        </div>
                   </q-form>
                 </q-card-section>
            </q-card>
        </div>
    </div>
</template>

<script>

import NSelect from "../../drop_down/n-select.vue";

export default {
    components:{
        NSelect
    },
    props:{
        applicationColumns:{
            type: Array,
            default: () => {
                return []
            }
        },
        worksheetColumns:{
            type: Array,
            default: () => {
                return []
            }
        },
        dataTypes:{
            type: Array,
            default: () => {
                return []
            }
        },
        qToggles: {
            type: Array,
            default: () => {
                return []
            }
        },
    },
    methods:{
        onApplicationColumnChanged(_qSelect){
            this.$emit("onApplicationColumnChanged", _qSelect);
        },
        onWorksheetColumnChanged(_qSelect){
            this.$emit("onWorksheetColumnChanged", _qSelect);
        },
        onDataTypeChanged(_qSelect){
            this.$emit("onDataTypeChanged", _qSelect);
        },
        onToggle(event){
        this.$emit("onToggle", event);
        },
    }
}
</script>
