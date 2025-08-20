<template>
    <div>
        <div
            class="q-pa-sm">
            <span v-if="qSelect.visible">
            <div class="row">
                <p class="q-ma-sm">{{ qSelect.label }}</p>
                <q-space/>
                <div class="q-pa-sm">
                    <label class="custom-file-upload">
                        <input 
                        type="file" 
                        @change="onFileSelected"
                            id="upload"/>
                        <i class="fa fa-cloud-upload"></i> Browse File
                    </label>
                </div>
            </div>
            <NSelect
            :qSelect="qSelect"
            @onQSelectItemValueChanged="onQSelectItemValueChanged($event)"/>
            </span>
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
        qSelect: {
            type: Object,
            default: {}
        }
    },
    methods:{
        onQSelectItemValueChanged(_qSelect){
            this.$emit("onQSelectItemValueChanged", _qSelect);
        },
        onFileSelected(event){

        var files = event.target.files;
        var selectedFile = files[0];

            this.$emit("onFileSelected", {
            selectedFile,
            })
            
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
