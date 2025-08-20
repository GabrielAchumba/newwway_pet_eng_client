<template>
    <div  :style="dialogStyle">
        <div class="row q-pa-none bg-primary">
             <q-card class="col-12 bg-primary">
                <q-bar class="bg-accent text-primary">
                    <div class="text-h6 text-primary">{{ title }}</div>

                    <q-space />

                    <q-btn dense flat icon="close" class="bg-accent text-primary" @click="cancelMessageBox">
                        <!-- <q-tooltip>Close</q-tooltip> -->
                    </q-btn>
                </q-bar>

                <q-separator />

                <q-card-section class="bg-primary text-accent">
                    <p>
                       {{ message }}
                    </p>
                </q-card-section>

                 <q-separator />

                 <q-card-actions align="right">
                    <q-btn flat label="Cancel" class="bg-secondary text-primary"
                    size="sm"
                    no-caps
                    @click="cancelMessageBox" />
                    <q-btn flat label="Okay" class="bg-accent text-primary"
                    size="sm"
                    no-caps
                    @click="oKMessageBox" />
                </q-card-actions>

             </q-card>
        </div>
    </div>
</template>

<script>

export default {
    name: 'savingImportDataDialog',
    computed:{
        dialogStyle(){
            return {
                maxHeight: `500px`,
                maxWidth: `500px`,
            }
        },
    },
    props: {
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      default: ''
    },
    cancelEvent: {
      type: String,
      default: ''
    },
    okayEvent: {
      type: String,
      default: ''
    },
  },
    data() {
        return {
            dense: false
        }
    },
    methods:{
         cancelMessageBox(){
             var context  =  this;
             this.$emit(context.cancelEvent, context.title);    
        },
        oKMessageBox(){
            var context  =  this;
            this.$emit(context.okayEvent, context.title); 
        }
    }
};

</script>