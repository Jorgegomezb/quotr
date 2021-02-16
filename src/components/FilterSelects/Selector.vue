<template>
    <v-select
        v-model="select"
        :items="options"
        :label="label"
        :multiple="this.multiple"
        clearable
        :disabled="disable"
        @change="updateFilter($event)"
        @click:clear="clearValue()"
      >
      <template v-slot:prepend-item>
        <v-list-item v-if="multiple == true"
          ripple
          @click="toggle"
        >
          <v-list-item-action>
             <v-icon :color="select.length > 0 ? 'indigo darken-4' : ''">
              {{ icon }}
            </v-icon> 
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              Select All
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider class="mt-2"></v-divider>
      </template>
      
      </v-select>
</template>
<script>
export default {
    Name: "Selector",
    props:{
        options: {
            type: Array,
            default:() => []},
        label: String,
        multiple: Boolean,
        disable: Boolean
    },
    data: () => ({
       select: "",

    }),
    computed:{
        icon () {
        if (this.select.length === this.$props.options.length) return 'mdi-close-box'
        if (this.select.length > 0 && this.select.length < this.$props.options.length) return 'mdi-minus-box'
        return 'mdi-checkbox-blank-outline'
      },
    },
    methods:{
        clearValue(){
          console.log("clear")
          this.select=[]
        },
        updateFilter(data){
            console.log('data')

            let filter={
                'label': this.$props.label,
                'value': data ? data.toString() : "" 
            }
            console.log(filter)
            this.$emit('monofilter', filter)
        },
        toggle () {
            this.$nextTick(() => {
                console.log("Holahola")
                console.log(this.select)
            if (this.select.length === this.$props.options.length) {
                console.log(this.select)
                this.select = []
            } else {
                console.log("else")
                this.select= this.$props.options
                
            }
            console.log(this.select)
            this.updateFilter(this.select)
            })
            
        },
    }
}
</script>