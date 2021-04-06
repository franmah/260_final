<template>
<div class="hero">
  <div class="heroBox">

    <form class="pure-form">
      <fieldset>
        <legend>Register</legend>
        <input placeholder="username" v-model="username">
        <input type="password" placeholder="password" v-model="password">
      </fieldset>
      <fieldset>
        <button type="submit" class="pure-button pure-button-primary" @click.prevent="register">Register</button>
      </fieldset>
    </form>
    <p v-if="error" class="error">{{error}}</p>

    <hr>

    <form class="pure-form login-form">
      <fieldset>
        <legend>Login</legend>
        <input placeholder="username" v-model="usernameLogin">
        <input type="password" placeholder="password" v-model="passwordLogin">
      </fieldset>
      <fieldset>
        <button type="submit" class="pure-button pure-button-primary" @click.prevent="login">Login</button>
      </fieldset>
    </form>
    <p v-if="errorLogin" class="error">{{errorLogin}}</p>

  </div>
</div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'HomePage',
  data() {
    return {
      username: '',
      password: '',
      usernameLogin: '',
      passwordLogin: '',
      error: '',
      errorLogin: '',
    }
  },
  watch: {
    username() {
      this.resetErrorMessage();
    },
    password() {
      this.resetErrorMessage();
    },
    usernameLogin() {
      this.resetErrorMessage();
    },
    passwordLogin() {
      this.resetErrorMessage();
    }
  },
  methods: {
    resetErrorMessage() {
      this.errorLogin = "";
      this.error = "";
    },
    async register() {
      this.shouldShowSnackBar = false;
      this.error = '';
      this.errorLogin = '';
      if (!this.username || !this.password)
        return;
      try {
        let response = await axios.post('/api/users', {
          username: this.username,
          password: this.password,
        });
        this.$root.$data.user = response.data.user;
        console.log("success register");
        this.redirect();
      } catch (error) {
        this.error = error.response.data.message;
        this.$root.$data.user = null;
      }
    },
    async login() {
      this.shouldShowSnackBar = false;
      this.error = '';
      this.errorLogin = '';
      if (!this.usernameLogin || !this.passwordLogin)
        return;
      try {
        let response = await axios.post('/api/users/login', {
          username: this.usernameLogin,
          password: this.passwordLogin,
        });
        this.$root.$data.user = response.data.user;
        this.redirect();
      } catch (error) {
        this.errorLogin = "Error: " + error.response.data.message;
        this.$root.$data.user = null;
      }
    },
    redirect() {
      this.shouldShowSnackBar = false;
      this.$router.push(`/`);
      this.$router.go();
    }
  }
}
</script>


<style scoped>
h1 {
  font-size: 28px;
  font-variant: capitalize;
}

.hero {
  padding: 30px;
  display: flex;
  justify-content: center;
}

.heroBox {
  background: white;
  opacity: 0.95;
  display: inline;
  padding: 20px;
  font-size: 20px;
  text-align: center;
  border-radius: 30px;
}

.hero::after {
  content: "";
  background-image: url("/pagliacci.jpg");
  background-size: 100%;
  background-repeat: no-repeat;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  position: absolute;
  z-index: -1;
}
.hero form {
  font-size: 14px;
}

.hero form legend {
  font-size: 20px;
}

input {
  margin-right: 10px;
}

.error {
  display: inline;
  padding: 5px 20px;
  border-radius: 30px;
  font-size: 10px;
  background-color: #d9534f;
  color: #fff;
}

button, form {
  margin-top: 12px;
}

</style>
