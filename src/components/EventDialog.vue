<template>

<v-dialog
        transition="dialog-bottom-transition"
        max-width="600"
        v-model="this.show"
        persistent
      >
        <template v-slot:default>
          <v-card>
            <v-toolbar
              color="primary"
              dark
            >New Call</v-toolbar>
            <v-card-text>
            <v-list-item v-for="(key, value) in eventData" :key="value">
               <v-list-item-title>{{value +":"+ key}}</v-list-item-title></v-list-item>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn
                text
                @click="closeDialog()"
              >Close</v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>

</template>
<script>
export default {
    Name: "EventDialog",
     props: {
        eventData: Object, //Data to show on the dialog,
        showDialog: Boolean
    },
    data() {
        return {
            isShown: false
        };
    },
    computed:{
        show:{
            get(){
                console.log("getter")
                return this.isShown
            },
             set(val) {
                this.isShown=val
                return val
            }

            
        },
        computedData(){
            return JSON.stringify(this.$props.eventData, null,2)
        }
    },
    watch:{
        showDialog(){
            this.isShown=this.$props.showDialog
        }
    },
    methods:{
        closeDialog(){
            console.log("closeDialog")
            this.show = false
            this.$emit("closeDialog")
        }
        
    }
}
</script>