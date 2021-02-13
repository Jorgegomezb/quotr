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
      <HelloWorld/>
    </v-main>
  </v-app>
</template>

<script>
import PageTitle from './components/PageTitle';

export default {
  name: 'App',

  components: {
    PageTitle
  },
  data: () => ({
    //
  }),
};
</script>
<style>
@font-face {
  font-family: "RINGM";
  src: local("RINGM"),   url(./assets/fonts/RINGM.TTF) format("truetype");}
</style>