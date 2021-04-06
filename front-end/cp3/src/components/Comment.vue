<template>
  
<div class="card-body">
  <div class="comment-icons">
    <i v-if="userOwnComment" @click.prevent="isEditing = !isEditing" class="fas fa-edit fa-lg"></i>
    <i v-if="userOwnComment || userIsAdmin" class="fas fa-times delete-icon fa-lg" @click.prevent="deleteComment(comment.id)"></i>
  </div>
  
  <h5 class="card-title">Author: {{comment.author}}</h5>
  <div v-if="!isEditing">
    <h6 class="card-subtitle mb-2 text-muted">Professor: {{comment.professor}}</h6>
    <p class="card-subtitle mb-2 text-muted">Rating: {{comment.rating}}</p>
    <p class="card-text">{{comment.comment}}</p>
    <p class="timestamp">{{formattedTimestamp}}</p>
  </div>

  <div v-else class="form">
    <input type="text" placeholder="professor" v-model="editProfessor"> <br>
    <input type="text" placeholder="rating" v-model="editRating"> <br>
    <textarea type="text" placeholder="comment" v-model="editContent"></textarea> <br>
    <button @click.prevent="editComment()">Edit comment</button>
  </div>

  <Snack :snack_message="snackMessage" :snack_show="shouldShowSnackBar" />

</div>

</template>

<script>
import axios from 'axios';
import Snack from '@/components/Snack.vue';

export default {
  name: 'Comment',
  components: {
    Snack,
  },
  props: {
    comment: Object
  },
  data() {
    return {
      snackMessage: '',
      shouldShowSnackBar: false,
      isEditing: false,
      editRating: "",
      editProfessor: "",
      editContent: "",
    }
  },
  created() {
    this.editRating = this.comment.rating;
    this.editProfessor = this.comment.professor;
    this.editContent = this.comment.comment;
  },
  computed: {
    formattedTimestamp(){
      // Only use the first part of the date (remove time and time zone)
      const strings = this.comment.timestamp.split(" ");
      return strings[0] + " " + strings[1] + " " + strings[2] + " " + strings[3];
    },
    userOwnComment() {
      return this.comment.author === this.$root.$data.user?.username;
    },
    userIsAdmin() {
      return this.$root.$data.user?.role === 'admin';
    }
  },
  methods: {
    showSnackBar(message) {
      this.snackMessage = message;
      this.shouldShowSnackBar = true;
    },
    async editComment() {
      const originalComment = JSON.parse(JSON.stringify(this.comment));
      try {
        if (this.editRating < 0 || this.rating > 10) {
          this.showSnackBar("Error: rating should be between 0 and 10");
          return;
        }
        
        this.comment.rating = this.editRating;
        this.comment.professor = this.editProfessor;
        this.comment.comment = this.editContent;
        this.comment.timestamp = Date();
        this.isEditing = false;
        await axios.put('/api/comment', { comment: this.comment });
      } catch (error) {
        this.showSnackBar("Error editing comment.");
        this.comment = originalComment;
      }
    },
    async deleteComment(commentId) {
      console.log("deleting comment")
      try {
        await axios.delete('/api/comment/' + commentId);
        this.comments = (await axios.get('/api/comments/' + this.course.id)).data;
      } catch (error) {
        this.showSnackBar("Error deleting comment.");
      }
    }
  }
}
</script>

<style scoped>
.comment-icons {
  float: right;
}

.comment-icons i {
  margin-left: 12px;
}

.delete-icon {
  color: red;
}

.form input, textarea{
  min-width: 30%;
  margin-top: 8px;
}

.form textarea {
  min-width: 50%;
}

.timestamp {
  color: gray;
}
</style>