<template>
  <div class="menu" >
   
  </div>
</template>

<script>
import axios from 'axios';
export default {
  computed: {
    universities() {
      return this.$root.$data.universities;
    },
    userConnected() {
      return !this.$root.$data.user;
    },
    userIsAdmin() {
      return this.$root.$data.user?.role === "admin";
    }
  },
  methods: {
    async logout() {
      try {
        await axios.delete("/api/users/");
        this.$root.$data.user = null;
      } catch (error) {
        this.$root.$data.user = null;
      }
    },
    async reloadPage(id) {
      this.$router.push(`/university/${id}/`);
      this.$router.go();
    }
  }
}
</script>

<style scoped>

</style>