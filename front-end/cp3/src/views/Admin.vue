<template>
<div class="admin">
  <div id="nav">
    <a @click="showAdd = true">Add</a> 
    <span>|</span>
    <a @click="showAdd = false">Edit</a>
  </div>
  <hr>


  <div class="add-section" v-if="showAdd">
    <div class="heading">
      <h2>Add a Univesity</h2>
      <div class="form">
        <input v-model="universityToAdd.name" placeholder="Name"> <br>
        <input v-model="universityToAdd.color" placeholder="color (with #)"> <br>
        <input v-model="universityToAdd.logo" placeholder="link to the university's logo"> <br>
        <textarea v-model="universityToAdd.description" placeholder="Description"></textarea> <br>
      </div>

      <button @click="addUniversity">Add university</button>
    </div>

   <hr>
  
    <div class="heading">
      <input class="search-input" v-model="universityNameSearch" placeholder="search university"> <br>
      <div class="suggestions" >
        <div class="suggestion" v-for="university in suggestions" :key="university.id" @click="selectUniversityToAddCourse(university)">{{university.name}}
        </div>
      </div>

      <h2>Add a Course</h2>
      <div class="form">
        <input v-model="courseToAdd.title" placeholder="Course category (ex: ECON, CS)"> <br>
        <input v-model="courseToAdd.number" placeholder="Course number (101, 110...)"> <br>
        <input v-model="courseToAdd.name" placeholder="Full name"> <br>
        <input v-model="courseToAdd.credits" placeholder="Number of credits"> <br>
        <input v-model="courseToAdd.professorsStr" placeholder="professors (separated by a comma)"> <br>
        <input v-model="courseToAdd.universityName" disabled>
        <br>
        <textarea v-model="courseToAdd.description" placeholder="Description"></textarea> <br>
        <button @click="addCourse">Add course</button> <br>

        
      </div>
    </div>
  </div>

  <div class="edit-section" v-else>

    <div class="heading select-edit-university">
      <h2>Select University</h2>
      <input class="search-input" v-model="universityNameSearch" placeholder="search university"> <br>
      <div class="suggestions" >
        <div class="suggestion" v-for="university in suggestions" :key="university.id" @click="selectUniversityToEdit(university)">{{university.name}}
        </div>
      </div>
    </div> 

    <hr>

    <div class="edit-container">
      <div class="heading university-section">
        <h2>Edit a University</h2>
        <div class="form">
          <input v-model="universityToEdit.name" placeholder="Name"> <br>
          <input v-model="universityToEdit.color" placeholder="color (with #)"> <br>
          <input v-model="universityToEdit.logo" placeholder="link to logo"> <br>
          <textarea v-model="universityToEdit.description" placeholder="Description"></textarea> <br>
        </div>

        <button @click="editUniversity">Edit university</button> <br>
        <button @click="deleteUniversity">Delete university</button>
      </div>

      <hr>

      <div class="heading courses-section">
        <h2>Edit a course</h2>
        <div class="form">
          <input v-model="courseToEdit.universityName" placeholder="University" disabled> <br>
          <input v-model="courseToEdit.title" placeholder="Course category (ex: ECON, CS)"> <br>
          <input v-model="courseToEdit.number" placeholder="Course number (101, 110...)"> <br>
          <input v-model="courseToEdit.name" placeholder="Full name"> <br>
          <input v-model="courseToEdit.credits" placeholder="Number of credits"> <br>
          <input v-model="courseToEdit.professorsStr" placeholder="professors (separated by a comma)"> <br>
          <textarea v-model="courseToEdit.description" placeholder="Description"></textarea> <br>
        </div>
        <button @click="editCourse">Edit course</button> <br>
        <button @click="deleteCourse">Delete course</button> <br>

        <input class="search-input" v-model="courseToEditSearch" placeholder="search course"> <br>
        <div class="suggestions">
          <div class="suggestion" v-for="course in courseSuggestions" :key="course.id" @click="selectCourseToEdit(course)">{{course.title}} {{course.number}}
        </div>
      </div>
      </div>
    </div>

  </div>

  <Snack :snack_message="snackMessage" :snack_show="shouldShowSnackBar" />

</div>
</template>

<script>
import axios from 'axios';
import { v4 } from 'uuid';
import Snack from '@/components/Snack.vue'

export default {
  name: 'Admin',
  components: {
    Snack,
  },
  data() {
    return {
      snackMessage: '',
      shouldShowSnackBar: false,
      showAdd: true,
      universities: [],
      selectedUniversityCourses: [],
      universityNameSearch: "",
      selectedEditUniversity: "",
      courseToEditSearch: "",
      universityToAdd: {
        name: "",
        color: "",
        description: "",
        logo: "",
        id: "",
      },
      courseToAdd: {
        universityName: "",
        universityId: "",
        title: "",
        number: "",
        name: "",
        credits: "",
        professorsStr: "",
        professors: [],
        description: "",
      },
      courseToEdit: {
        universityName: "",
        universityId: "",
        title: "",
        number: "",
        name: "",
        credits: "",
        professorsStr: "",
        professors: [],
        description: "",
      },
      universityToEdit: {
       id: "",
       name: "",
       color: "",
       logo: "",
       description: ""
      }
    }
  },
  created() {
    this.getUniversities();
  },
  computed: {
    suggestions() {
      if (!this.universityNameSearch && this.$root.$data.universities.length > 10) 
        return;
      let universities = this.$root.$data.universities.filter(item => item.name.toLowerCase().startsWith(this.universityNameSearch.toLowerCase()));
      return universities.sort((a, b) => a.name > b.name);
    },
    courseSuggestions() {
      if (!this.courseToEditSearch && this.selectedUniversityCourses.length > 10)
      return;

      let courses = this.selectedUniversityCourses.filter(item => item.name.toLowerCase().startsWith(this.courseToEditSearch.toLowerCase()));
      return courses.sort((a, b) => a.name > b.name);
    }
  },
  methods: {
    showSnackBar(message) {
      this.snackMessage = message;
      this.shouldShowSnackBar = true;
    },
    async editUniversity() {
      try {
        await axios.put('/api/university', { university: this.universityToEdit });
        this.universityToEdit = {
          id: "",
          name: "",
          color: "",
          logo: "",
          description: ""
        };
        this.universityNameSearch = "";
        await this.getUniversities();
      } catch (error) {
        this.showSnackBar("Error editing univeristy");
      }
    },
    async deleteUniversity() {
      try {
        await axios.delete('/api/university/' + this.universityToEdit.id);
        await this.getUniversities();
        this.universityToEdit = {
          id: "",
          name: "",
          color: "",
          logo: "",
          description: ""
        }
        this.universityNameSearch = "";
      } catch (error) {
        this.showSnackBar("Error deleting university");
      }
    },
    async deleteCourse() {
      try {
        await axios.delete('/api/course/' + this.courseToEdit.id);
        await this.getCourses();
        this.courseToEdit = {
          title: "",
          number: "",
          name: "",
          credits: "",
          professorsStr: "",
          professors: [],
          description: "",
        }
      } catch (error) {
        this.showSnackBar("Error deleting course");
      }
    },
    async editCourse() {
      try {
        this.courseToEdit.professors = this.courseToEdit.professorsStr.split(',');
        await axios.put(`/api/course`, { course: this.courseToEdit });
        this.courseToEditSearch = "";
        this.courseToEdit = {
          universityName: "",
          UnivesityId: "",
          title: "",
          number: "",
          name: "",
          credits: "",
          professorsStr: "",
          professors: [],
          description: "",
        };
        this.selectedUniversityCourses = (await axios.get('/api/courses/' + this.universityToEdit.id)).data;
      } catch (error) {
        this.showSnackBar("Error editing course");
      }
      
    },
    async getUniversities() {
      try {
        this.$root.$data.universities = (await axios.get('/api/universities')).data;
      } catch (error) {
        this.showSnackBar("Error getting universities");
      }
    },
    async getCourses() {
      try {
        this.selectedUniversityCourses = (await axios.get('/api/courses/' + this.universityToEdit.id)).data;
      } catch (error) {
        this.showSnackBar("Error getting course");
      }
    },
    async selectUniversityToEdit(university) {
      try {
        this.universityNameSearch = university.name;
        this.universityToEdit = JSON.parse(JSON.stringify(university));
        this.courseToEdit.universityName = this.universityToEdit.name;
        this.courseToEdit.universityId = this.universityToEdit.id;
        this.selectedUniversityCourses = (await axios.get('/api/courses/' + university.id)).data;
      } catch (error) {
        this.showSnackBar("Error selecting university to edit");
      }
    },
    selectUniversityToAddCourse(university) {
      this.universityNameSearch = university.name;
      this.courseToAdd.universityName = university.name;
      this.courseToAdd.universityId = university.id;
    },
    async addCourse() {
      try {
        this.courseToAdd.id = v4();
        this.courseToAdd.professors = this.courseToAdd.professorsStr.split(',');
        await axios.post('/api/course', {
          course: this.courseToAdd,
        });
        this.courseToAdd = {
          universityName: "",
          UnivesityId: "",
          title: "",
          number: "",
          name: "",
          credits: "",
          professorsStr: "",
          professors: [],
          description: "",
        };
      } catch(error) {
        this.showSnackBar("Error adding course");
      }
    },
    async addUniversity() {
      try {
        this.universityToAdd.id = v4();
        await axios.post('/api/university', {
          name: this.universityToAdd.name,
          id: this.universityToAdd.id,
          logo: this.universityToAdd.logo,
          description: this.universityToAdd.description,
          color: this.universityToAdd.color,
        });
        this.universityToAdd = {
          name: "",
          id: "",
          description: "",
          link: "",
          color: "",
        };
        await this.getUniversities();
      } catch (error) {
        this.showSnackBar("Error adding university");
      }
    },
    async selectCourseToEdit(course) {
      this.courseToEdit = JSON.parse(JSON.stringify(course));
      this.courseToEdit.universityName = this.universityToEdit.name;
      this.courseToEdit.professorsStr = this.courseToEdit.professors.reduce((total, professor) => total += ", " + professor)
      this.courseToEditSearch = "";
    }
  }
}
</script>

<style scoped>
.admin {
  text-align: center;
  margin: 0 auto;
  width: 85%;
}

h2 {
  padding-bottom: 12px;
}

.form {
  flex-direction: column;
  text-align: center;
}

.form input, textarea {
  width: 95%;
  margin: 8px 0px;
}

.suggestions {
  border: 1px solid #ccc;
  margin-bottom: 23px;
}

.suggestion {
  min-height: 20px;
}

.suggestion:hover {
  background-color: #5BDEFF;
  color: #fff;
  cursor: pointer;
}

#nav {
  text-align: center;
  color: #2c3e50;
  padding: 30px;
}

#nav a {
  margin: 0px 12px;
  color: blue;
  font-size: 2em;
  cursor: pointer;
}

#nav a:hover {
  text-decoration: underline;
}

#nav span {
  font-size: xx-large;
}

.add-section, .edit-container{
  display: flex;
  justify-content: space-evenly;
}

.heading {
  width: 50%;
}

.edit-section button {
  margin-bottom: 8px;
}

.select-edit-university {
  margin: 0 auto;
  margin-bottom: 32px;
}

.select-edit-university input {
  margin-bottom: 16px;
  width: 50%;
}

.search-input {
  width: 50%;
  margin-bottom: 8px;
}

@media only screen and (max-width: 901px) {
  .add-section, .edit-container {
    padding: 0px;
    margin: 0 auto;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
}
</style>