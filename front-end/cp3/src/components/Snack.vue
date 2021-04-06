<template>
<div>
  <md-snackbar :md-position="snack_position" :md-duration="snack_duration" :md-active.sync="snack_show" md-persistent>
      <span>{{snack_message}}</span>
      <md-button class="md-primary" @click="snack_show=false">Hide</md-button>
  </md-snackbar>
</div>
</template>

<script>
export default {
  name: 'Snack',
  props: {
    snack_show: Boolean,
    snack_message: String,
  },
  data() {
    return {
      snack_position: 'center',
      snack_duration: 2000,
    }
  },
  watch: {
    snack_show: function (val) {
      console.log(`changed to: ${val}`)
    }
  }
}
</script>