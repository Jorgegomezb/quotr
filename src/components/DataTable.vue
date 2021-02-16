<template>
<v-card style="width:100%">
    <v-card-title>
      {{selectedCharacter}} {{table_title}} Table 
      <v-spacer></v-spacer>
      <v-btn color="green lighten-2" @click="resetFilters">Reset Filters</v-btn>
    </v-card-title>
        
   
    <v-data-table
    dense
    :headers="showheaders"
    :items="this.table_data"
    :server-items-length="totalData"
    :options.sync="options"
    class="elevation-1 table-resizable"
    style="width:100%"
    :sort-by.sync="sortHeader"
    :loading="this.isLoading"
    @update:page="updatePage"
    @click:row="rowclick"
  >
  <template v-slot:top>
      <v-row>
          <v-col v-if="monoFilterLabel">
              <Selector :label="monoFilterLabel" ref="filter" :disable="getSelected" :multiple="false" :options="monoFilterOptions" @monofilter="updateFilter"/>
          </v-col>
          <v-col v-if="multifilterLabel">
              <Selector :label="multifilterLabel" ref="filter" :multiple="true" :options="multiFilterOptions" @monofilter="updateFilter"/>
          </v-col>
          <v-col>
              <v-select
          v-model="selectedHeaders"
          :items="headers"
          label="Select columns"
          multiple
          return-object
        >
        <template v-slot:selection="{ item, index }">
        <v-chip v-if="index < 2">
          <span>{{ item.text }}</span>
        </v-chip>
        <span
          v-if="index ===3"
          class="grey--text caption"
        >
          (+{{ selectedHeaders.length - 1 }} others)
        </span>
      </template>
        </v-select>
          </v-col>


      </v-row>
            
      
  </template>
  <template v-slot:[`item.dialog`]="props">
        <v-edit-dialog
          :return-value.sync="props.item.dialog"
          @save="editDialog(props.item)"

        >
          {{ props.item.dialog }}
          <template v-slot:input>
            <v-text-field
              v-model="props.item.dialog"
              label="Edit"
              single-line
              counter
            ></v-text-field>
          </template>
        </v-edit-dialog>
  </template>
    <template v-slot:[`item.actions`]="{ item }">
        <EventDialog/>
      <v-icon
        small
        class="mr-2"
        @click="copyItem(item)"
      >
         mdi-content-copy
      </v-icon>
      <v-icon
        small
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>
</v-card>
</template>
<script>
import Selector from "./FilterSelects/Selector";
import EventDialog from "./EventDialog";
export default {
    Name: "DataTable",
    components:{
        Selector,
        EventDialog
    },
    props:{
        characterData: Array,
        table_title: String,
        monoFilterLabel: String,
        multifilterLabel: String,
        monoFilterOptions: Array,
        totalData: Number,
        characterName: String,
        hasActions: Boolean,
        sortHeader: String
    },
    data: () => ({
        table_data: [],
        selectedHeaders:[],
        isLoading: true,
        options: {},
        multiFilterOptions:['Human', 'Elf'],
        filterValue: '',
        total_filters : [],
       

    }),
    watch:{
        options: {
        handler () {
            console.log("optionwatcher")
            let filter= {
                'filters': this.total_filters,
                'options': this.options,
                'table': this.table_title.toLowerCase()
            }
            this.$emit("monoFilter", filter)
        },
        deep: true,
      },
        characterData(data_recieved) {
            console.log("changed data")

            this.table_data = JSON.parse(JSON.stringify(data_recieved));

            this.selectedHeaders= this.headers
            this.isLoading = false
        }
    },
    computed:{
        getSelected(){
            if(this.selectedCharacter != ""){
                return true
            }
            return false
        },
        selectedCharacter(){
            if (this.$props.characterName){
                return this.$props.characterName
                
            }else{
                return ""
                
            }
        },
        headers(){
            let columns = []
            if(this.table_data[0]){
                Object.keys(this.table_data[0]).map(function(key) {
                    columns.push({
                        text: key,
                        value: key,
                        align: "center",})
                    })
                if (this.$props.hasActions){
                    columns.push({
                        text: 'Actions', 
                        value: 'actions', 
                        sortable: false }
                    )
                }
                }
            return columns
        },
        showheaders(){
            return this.headers.filter(s => this.selectedHeaders.includes(s));
        }
    },
    methods:{
        throwEvent(type,item){
            let event={
                "action": type,
                "data": item
            }
            this.$emit("actionEvent", event)
        },
        editDialog(item){
            console.log(item)
            this.throwEvent("Modify",item)
        },
        copyItem(item){
            console.log("Copy item dummy "+ item)
            this.throwEvent("Copy",item)
        },
        deleteItem(item){
            console.log("Copy item dummy "+ item)
            this.throwEvent("Delete",item)
        },
        resetFilters(){
            this.total_filters=[]
            let final_filters={
                'reset': true,
                'filters': [],
                'options': {"page": 1,
  "itemsPerPage": 10},
                'table': this.table_title.toLowerCase()
            }
            console.log(this.$refs)
            this.$refs.filter.clearValue("")
            this.$emit("monoFilter", final_filters)
        },
        rowclick(rowData){
            console.log(rowData._id)
            let data_clicked = {
                "data" :rowData,
                "table": this.table_title
            }
            this.$emit("rowClicked", data_clicked)
        },
        updateFilter(filter){
            if (filter.value){
                this.filterValue = filter.value
                let filter_final= {
                    'label': filter.label.toLowerCase(),
                    'value': filter.value,
                }
                this.total_filters.push(filter_final)
            }else{
                //if filter is empty we remove it
                this.total_filters = this.total_filters.filter(fil => {
                    return fil.label !=filter.label
                })
            }
            
                


            


            this.options.page=1
            let final_filters={
                'filters': this.total_filters,
                'options': this.options,
                'table': this.table_title.toLowerCase()
            }
            this.$emit("monoFilter", final_filters)
        },
        updatePage(page){
            console.log(page)
        },
        headerClick(header){
            //To do: resizable headers
            const result = this.headers.filter( word => {
                if(word.text == header){
                    return header
                }
            })
            console.log(result)
        }
    }

    
    
}
</script>

<style scoped>
/* This is added to prevent the unalignment of headers in small screens*/
.v-data-table-header th {
  white-space: nowrap;
}
</style>
