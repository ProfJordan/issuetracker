'use strict';

module.exports = function (app) {

  const ProjectModel = require('../models.js').Project;
  const IssueModel = require('../models.js').Issue;

  app.route('/api/issues/:project')
  
    .get(async (req, res) => {
      let project = req.params.project;
      
    })
    
    .post(async (req, res) => {
      let project = req.params.project;
      const { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;
      if (!issue_title || !issue_text || !created_by) {
        return res.json({ error: 'required field(s) missing' });
      }
      try {
        let projectModel = await ProjectModel.findOne({ name: project });
        if (!projectModel) {
          projectModel = new ProjectModel({ name: project });
          projectModel = await projectModel.save();
        }
        const issueModel = new IssueModel({
          projectId: projectModel._id,
          issue_title: issue_title || '',
          issue_text: issue_text || '',
          created_on: new Date(),
          updated_on: new Date(),
          created_by: created_by || '',
          assigned_to: assigned_to || '',
          open: true,
          status_text: status_text || '',
        });
        const issue = await issueModel.save();
        res.json(issue);
      } catch (error) {
        res.json({ error: 'post error... post failed ' + error });
      }
    })
    
    .put(function (req, res){
      let project = req.params.project;
      
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      
    });
    
};
