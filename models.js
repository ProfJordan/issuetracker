const mongoose = require('mongoose');
const { Schema } = mongoose;

const IssueSchema = new Schema({
  projectId: {type: String, required: true}, // required
  issue_title: {type: String, required: true},
  issue_text: {type: String, required: true},
  created_on: Date, // {type: Date, default: Date.now}
  updated_on: Date,
  created_by: {type: String, required: true},
  assigned_to: String, // {type: String}
  open: Boolean, // {type: Boolean, default: true}
  status_text: String,
});

const Issue = mongoose.model('Issue', IssueSchema);

const ProjectSchema = new Schema({
   name: {type: String, required: true},
});
const Project = mongoose.model('Project', ProjectSchema);

exports.Issue = Issue;
exports.Project = Project;