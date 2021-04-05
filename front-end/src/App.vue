<template>
<div id="app">
    <Navbar/>
    <router-view class="router"/>
    <footer>
      <a href="https://github.com/franmah/260_final/tree/master/front-end">Github</a>
    </footer>
</div>
</template>

<script>
import Navbar from './components/Navbar.vue'
import axios from 'axios';
export default {
  components: {
    Navbar
  },
  created() {
    this.getUniversities();
  },
  methods: {
    async getUniversities() {
      try {
        this.$root.$data.universities = (await axios.get('/api/universities')).data;
      } catch (error) {
        console.log(error);
      }
    }
  }
}
</script>

<style>
.router {
  min-height: 80vh;
}

footer {
  text-align: right;
  background-color: white;
}

footer a {
  margin-right: 32px;
  font-size: x-large;
}
</style>
