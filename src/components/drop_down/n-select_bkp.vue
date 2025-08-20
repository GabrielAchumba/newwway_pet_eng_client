<template>
    <div class="row"> 
        <div
            class="col-9 q-pa-sm">
            <q-select
            class="q-ma-none"
            color="positive" 
            outlined label-color="positive"
            option-disable="inactive"
            v-model="qSelect.value"
            :options="qSelect.list"
            option-value="id"
            :option-label="'type'"
            name="type"
            emit-value
            map-options
            @update:model-value="onQSelectItemValueChanged(qSelect)"
            :readonly="!qSelect.qToggle.name"
            >
            </q-select>
        </div> 
        <div  
        v-if="qSelect.isToggle"
        class="col-3 q-pa-sm">
            <q-toggle
                :label="qSelect.qToggle.label"
                v-model="qSelect.qToggle.name"
                color="secondary"
                :false-value="disagreed"
                :true-value="agreed"
                @input="onToggle"
            />
        </div>
    </div>
</template>

<script>
export default {
    props:{
        qSelect: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    data(){
        return {
            disagreed: false,
            agreed: true,
        }
    },
    methods:{
        onQSelectItemValueChanged(qSelect){
            this.$emit("onQSelectItemValueChanged", qSelect);
        },
        onToggle(evt){
            var context = this;
            this.$emit("onToggle", {
                evt,
                qSelect: context.qSelect,
            });
        },
    }
}
</script>

<style lang="scss" scoped>

    input[type="file"] {
    display: none;
    }
    .custom-file-upload {
        border: 1px solid #ccc;
        display: inline-block;
        padding: 6px 12px;
        cursor: pointer;
    }
    
</style>