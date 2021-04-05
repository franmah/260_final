const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const cookieSession = require('cookie-session');
app.use(cookieSession({
    name: 'session',
    keys: ['secretValue'],
    cookie: {
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// import the users module and setup its API path
const users = require("./users.js");
app.use("/api/users", users.routes);

const mongoose = require('mongoose');

// connect to the database
// here the db name is museum
mongoose.connect('mongodb://localhost:27017/ratemycourse_v2', {
  useNewUrlParser: true
});

// Create a scheme for items in the museum: a title and a path to an image.
const universitySchema = new mongoose.Schema({
  name: String,
  id: String,
  logo: String, 
  description: String,
  color: String,
});

const courseSchema = new mongoose.Schema({
  universityId: String,
  id: String,
  title: String,
  number: Number,
  name: String,
  description: String,
  credits: Number,
  professors: Array,
});

const commentSchema = new mongoose.Schema({
  courseId: String,
  rating: Number,
  author: String,
  professor: String,
  timestamp: String,
  comment: String,
  id: String,
});

// Create a model for items in the museum.
const University = mongoose.model('University', universitySchema);
const Course = mongoose.model('Course', courseSchema);
const Comment = mongoose.model('Comment', commentSchema);

// Retrieve all universities
app.get('/api/universities', async (req, res) => {
  try {
    const universities = await University.find();
    res.send(universities);
  } catch (error) {
    res.sendStatus(500);
  }
});

// Create university
app.post('/api/university', async (req, res) => {
  try {
    if (!req.body.name || !req.body.description || !req.body.id || !req.body.logo || !req.body.color)
      throw new Error({message: 'missing variables'});
      
    const university = new University({
      name: req.body.name,
      description: req.body.description,
      id: req.body.id,
      logo: req.body.logo,
      color: req.body.color,
    });

    const univ = await University.findOne({ name: university.name })
    if (univ) 
      throw new Error('University already exists');
      
    await university.save();
    res.status(200).send(university);
  } catch (err) {
    res.status(400).send({ error: err });
  }
});

app.delete('/api/university/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await University.deleteOne({ id: id });
    res.status(200).end();
  } catch (err) {
    res.status(400).send(err);
  }
});

app.put('/api/university', async (req, res) => {
  try {
    const data = req.body.university;
    const university = await University.findOne({ id: data.id });
    if (!university)
      throw Error('University does not exist');
    
    await university.update({
      name: data.name,
      description: data.description,
      logo: data.logo,
      color: data.color
    });
    res.sendStatus(200);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all courses for a unviersity
app.get('/api/courses/:university_id', async (req, res) => {
  try {
    const universityId = req.params.university_id;
    const courses = await Course.find({ universityId: universityId });
    res.status(200).send(courses);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get a course
app.get('/api/course/:course_id', async (req, res) => {
  try {
    const courseId = req.params.course_id;
    const course = await Course.findOne({ id: courseId });
    if (!course)
      throw Error('No course found');
    res.status(200).send(course);
  } catch (error) {
    res.status(400).send(error);
  }
})

// Create course
app.post('/api/course', async (req, res) => {
  try {
    const data = req.body.course;
    if (!data.name || !data.id || !data.universityId || !data.title ||
        !data.number || !data.description || !data.credits)
      throw Error('missing parameters');
    
    const title = data.title.toUpperCase();

    const university = await University.findOne({ id: data.universityId });
    if (!university)
      throw Error('University does not exist');
    
    const c = await Course.findOne({ universityId: data.universityId, title: title, number: data.number });
    if (c) 
      throw Error('Course already exists');

    data.professors.forEach(professor => professor.trim());  

    const course = new Course({
      universityId: data.universityId,
      id: data.id,
      title: title,
      number: data.number,
      name: data.name,
      description: data.description,
      credits: data.credits,
      professors: data.professors,
    });
    await course.save();
    res.sendStatus(200);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.put('/api/course/', async (req, res) => {
  try {
    const data = req.body.course;
    const title = data.title.toUpperCase();
    if (!data.name || !data.id || !data.universityId || !data.title ||
        !data.number || !data.description || !data.credits)
      throw Error('missing parameters');
    
    const course = await Course.findOne({ id: data.id });
    if (!course) 
      throw Error('Course does not exist');
    
    data.professors.forEach(professor => professor.trim());  

    await course.update({
      title: title,
      number: data.number,
      name: data.name,
      description: data.description,
      credits: data.credits,
      professors: data.professors,
    });
    res.sendStatus(200);
  } catch (error) {
    res.status(400).send(error);
  }
})

app.delete('/api/course/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await Course.deleteOne({ id: id });
    res.status(200).end();
  } catch (err) {
    res.status(400).send(err);
  }
});

app.delete('/api/comment/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await Comment.deleteOne({ id: id });
    res.sendStatus(200);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post('/api/comment', async (req, res) => {
  try {
    const comment = req.body.comment;
    if (!comment.author || !comment.timestamp || !comment.comment || !comment.id || !comment.rating || !comment.professor || !comment.courseId)
      throw Error('Missing parameters');

    const checkDoubleComment = await Comment.findOne({ id: comment.id });
    if (checkDoubleComment)
      throw Error('A comment with this id already exists');

    const checkCourseExist = await Course.findOne({ id: comment.courseId });
    if (!checkCourseExist)
      throw Error('Course does not exist');

    const c = new Comment({
      id: comment.id,
      author: comment.author,
      timestamp: comment.timestamp,
      comment: comment.comment,
      rating: comment.rating,
      professor: comment.professor,
      courseId: comment.courseId,
    });
    await c.save();
    res.status(200).send(c);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.put('/api/comment', async (req, res) => {
  try {
    const comment = req.body.comment;
    if (!comment.author || !comment.timestamp || !comment.comment || !comment.id || !comment.rating || !comment.professor || !comment.courseId)
      throw Error('Missing parameters');

    const c = await Comment.findOne({ id: comment.id });
    if (!c)
      throw Error('Comment does not exist');

    await c.update({
      rating: comment.rating,
      professor: comment.professor,
      timestamp: comment.timestamp,
      comment: comment.comment,
    });
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get all comments for a course
app.get('/api/comments/:course_id', async (req, res) => {
  try {
    const courseId = req.params.course_id;
    const comments = await Comment.find({ courseId: courseId });
    if (!comments)
      throw Error('No comment found');
    
    res.status(200).send(comments);
  } catch (error) {
    res.status(400).send(error);
  }
});


/*
// EXAMPLE: 
app.put('/api/items/:id', async (req, res) => {
  const _id = req.params.id
});

// to call it:
await axios.put("/api/items/" + item._id, {   // goes in param
  title: this.findItem.title, // goes in body
});
*/
app.listen(3004);





