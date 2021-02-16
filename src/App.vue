<template>
  <v-app>
    <v-app-bar
      app
      color="#657094"
      dark
      center
    >


<v-spacer></v-spacer>
      <v-toolbar-title  class="text-center">
        <PageTitle/>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-cog</v-icon>
      </v-btn>
  
    </v-app-bar>

    <v-main>
      
     
        <v-card>
    <v-tabs
      v-model="tab" background-color="grey" dark center-active centered
    >
      <v-tab key="Home">Home</v-tab>
      <v-tab key="BackEnd calls">BackEnd calls</v-tab>
    
       <v-tabs-items v-model="tab">

         <v-tab-item key="Home">
           <v-container fluid >
             <v-row class="pa-10" align="center" justify="center">
                <CharacterTable 
                  table_title="Character" 
                  :totalData="this.totalData.character" 
                  monoFilterLabel="gender"
                  :monoFilterOptions="this.genderOptions"
                  multifilterLabel="Race" 
                  :characterData="this.tablesData.character"
                  @changePage="changePage"
                  @monoFilter="filterData"
                  @rowClicked="changeQuote"/>
              </v-row>
              <v-row  class="pa-10" align="center" justify="center" id="quotesTable" >
                <CharacterTable  
                  table_title="Quote"
                  :totalData="this.totalData.quote"
                  :characterName="this.selectedCharacter"
                  monoFilterLabel="movie"
                  :hasActions="true"
                  :monoFilterOptions="this.movieOptions"
                  :characterData="quoteDataParsed"
                  sortHeader="dialog"
                  @changePage="changePage"
                  @monoFilter="filterData"
                  @actionEvent="sendActionEvent"/> 
              </v-row>
            </v-container>
          </v-tab-item>
          <v-tab-item key="BackEnd calls">
             <v-container fluid>
               <v-row class="pa-10" align="center" justify="center">
                <v-data-table
                :items="this.eventCalls"
                :headers="this.eventHeaders"
                sort-by="time"
                class="elevation-1"
                >
                  
                </v-data-table></v-row>
            </v-container>
          </v-tab-item>
       </v-tabs-items>
          
             
        </v-tabs> </v-card>
        
      
      <EventDialog :showDialog="dialogTrigger" :eventData="this.lastEvent" @closeDialog="dialogTrigger=false"/>
    </v-main>
  </v-app>
</template>

<script>
import * as api from "./utils/APIHandler";
import * as constants from "./utils/APIConstants";
import PageTitle from './components/PageTitle';
import CharacterTable from './components/CharacterTable';
import EventDialog from "./components/EventDialog";

export default {
  name: 'App',

  components: {
    PageTitle,
    CharacterTable,
    EventDialog
  },
   async created() {
    // let query= constants.CHARACTERS_ENDPOINT + constants.DEFAULT_LIMIT
    // this.fetchData(query)
    let query= constants.MOVIES_ENDPOINT+ constants.DEFAULT_LIMIT
    let allMoviesData = await api.get(query)
    this.tablesData.movie = allMoviesData.docs
    this.movieOptions = this.tablesData.movie.map(mov => {
      return mov.name
    })
  },
  data: () => ({
    //
    tablesData:{
      'character': [],
      'movie': [],
      'quote': [],
    },
    totalData:{
      'character': 0,
      'movie': 0,
      'quote': 0,
    },
    //characterFilters: [], //Se deja como está, si no habría que llamar a todas!
    genderOptions: ["Male", "Female"],
    movieOptions: [],
    currentAPIPage: 0,
    nextApiPage: 1,
    totalCharacters: 0,
    lastQuery : "",
    selectedCharacter : "",
    selectedCharacterId : 0,
    eventCalls: [],
    lastEvent: {},
    dialogTrigger: false,
    tab: null,
    eventHeaders:[{ text: "Action", value: "action" },
                  { text: "Data", value: "data" },
                  { text: "Time", value: "time" },
    ]
  }),
  computed:{
    quoteDataParsed(){
      console.log("-")
      let parsedQuotes=[]
      if (this.tablesData.movie.length > 0){
        let auxData = JSON.parse(JSON.stringify(this.tablesData));
        for(let quote of auxData.quote){
        let parsedq = JSON.parse(JSON.stringify(quote))
        let moviedata= this.tablesData.movie.filter(mov => {
          return mov._id == quote.movie
        })
        parsedq["movie name"]= moviedata[0].name
        parsedQuotes.push(parsedq)
      }
      }
      
      
      
      return parsedQuotes
    }

  },
  methods:{
    sendActionEvent(event){
      let today=new Date()
      let newEvent={
        "action": event.action,
        "data": JSON.stringify(event.data),
        "time": today.toString()
      }
      this.dialogTrigger=true
      this.lastEvent=newEvent
      this.eventCalls.push(newEvent)
      console.log(this.eventCalls)
    },
    async changeQuote(characterData){
      console.log(characterData)
      document.getElementById('quotesTable').scrollIntoView( {behavior: 'smooth'} );
      this.selectedCharacter = characterData.data.name
      this.selectedCharacterId= characterData.data._id
      this.disableFilters=true
      let query = "/character/"+characterData.data._id+"/quote" +"?limit=10"
      let infoTable = await this.fetchData(query)
      this.tablesData.quote = infoTable.docs
      this.totalData.quote = infoTable.total
    },
    async changePage(options){
    console.log("changepoage")
    let query= "limit="+ options.itemsPerPage + "&page="+options.page;
    this.fetchData(query)
      
    },
    async filterData(filters){
      console.log("filterdata")
      let query =""
      let finalQuery =""

      query = "?limit="+ filters.options.itemsPerPage + "&page="+filters.options.page
      finalQuery= filters.table + query
      console.log(filters.filters)
      for(let filter of filters.filters){
        console.log(filter)
        if (query.includes(filter.label)){
          console.log("found")
          let regexp = new RegExp(`([&|?])${filter.label}+(.*?)(?=&|$)`)
          let new_query = query.replace(regexp,"")
          console.log(new_query)
          query = new_query
        }
        if (filter.value != "" && filters.table == "quote"){
            console.log("First")
            let movie_id = this.tablesData.movie.filter(mov => {return mov.name == filter.value})
            console.log(movie_id)
            let aux_query = "/movie/"+movie_id[0]._id+"/quote"
            finalQuery =  aux_query+"?limit="+ filters.options.itemsPerPage + "&page="+filters.options.page
        }else if (filter.value != "" ){
          console.log("Second")
           query += "&"+ filter.label+ "=" + filter.value
          finalQuery= filters.table + query
        }
        
      }
      if(filters.table == "quote" && this.selectedCharacter!="" && filters.reset!= true){
          console.log("hehehehehe")
          finalQuery = "/character/"+this.selectedCharacterId+"/quote" + query
      }

      if( filters.reset==true){
        this.selectedCharacter=""
        this.selectedCharacterID=""
      }
      //let query = "limit="+ filter.options.itemsPerPage + "&page="+filter.options.page + "&"+ filter.label+ "=" + filter.value
      console.log(filters.table)
      console.log(finalQuery)
      let infoTable = await this.fetchData(finalQuery)

      this.tablesData[filters.table]= infoTable.docs
      // console.log(this.tablesData)
      this.totalData[filters.table]= infoTable.total
      this.lastQuery=query
    },
    // async getFilterOptions(){
    //   let genders = []
    //   let 
    //   let allCharacterData =  await api.get(constants.CHARACTERS_ENDPOINT)

    // },
    async fetchData(query){
      console.log("fetch")

      let allData =  await api.get(query)
      // console.log(allData.total)
        return {
          "total": allData.total,
          "docs": allData.docs
        }
      
     
      // this.characterData = allCharacterData.docs
      // console.log( allCharacterData.docs)
      // this.totalCharacters = allCharacterData.total
    }
  }
};
</script>
<style>
@font-face {
  font-family: "RINGM";
  src: local("RINGM"),   url(./assets/fonts/RINGM.TTF) format("truetype");}
</style>