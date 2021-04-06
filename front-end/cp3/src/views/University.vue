<template>
<div class="content" :style="{'background-color': university.color}">

  <img :src="university.logo">
  <div class="main">
    <div class="description card card-body">
      <h1>{{ university.name }}</h1>
      <p>{{ university.description }}</p>
    </div>
    
    <div class="courses card card-body">
      <div class="card-body">
        <h3>Courses</h3>
        <hr>
        <div v-for="course in courses" v-bind:key="course.name">
          <router-link :to="{ name: 'Course', params: { uni_id: university.id, course_id: course.id }}">
            {{course.title}} {{course.number}} : {{course.name}}
          </router-link>
        </div>
      </div>
    </div>

  </div> <!-- End of main -->


  <Snack :snack_message="snackMessage" :snack_show="shouldShowSnackBar" />
</div>
</template>

<script>
import axios from 'axios';
import Snack from '@/components/Snack.vue';

export default {
  name: 'University',
  components: {
    Snack
  },
  data() {
    return {
      university: {},
      courses: [],
      snackMessage: '',
      shouldShowSnackBar: false,
    }
  },
  async created() {
    try {
      if (!this.$root.$data.user)
        this.$root.$data.user = (await axios.get('/api/users/')).data.user;
      const id = this.$route.params.id;
      this.getUniversity(id);
    } catch (error) {
      this.showSnackBar("Error when getting page.");
    }
  },
  methods: {
    showSnackBar(message) {
      this.snackMessage = message;
      this.shouldShowSnackBar = true;
    },
    async getUniversity(id) {
      try {
        this.$root.$data.universities = (await axios.get('/api/universities')).data;
        this.university = this.$root.$data.universities.find(university => university.id === id);
        if (this.university)
          await this.getCourses();
        else  
          throw Error();
      } catch (error) {
        this.showSnackBar("Error getting university.");
        this.university = {};
      }
    },
    async getCourses() {
      try {
        this.courses = (await axios.get('/api/courses/' + this.university.id)).data;
      } catch (error) {
        this.showSnackBar("Error getting courses.");
        this.courses = [];
      }
    }
  }
}
</script>

<style scoped>

img {
  width: 15%;
  padding: 32px 0px;
}
.content {
  text-align: center;
}

.main {
  display: flex;
  justify-content: center;
}

.description {
  margin: 0px 24px;
  width: 50%;
}

.description p {
  margin-top: 16px;
}

.courses {
  margin: 0px 24px;
  width: 20%
}


@media only screen and (max-width: 901px) {
  .main {
    margin: 0 auto;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  .description, .courses {
    width: 95%;
    margin: 16px 8px;
  }
}


</style>
