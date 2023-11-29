'use strict';

module.exports = function (app) {

  const ProjectModel = require('../models.js').Project;
  const IssueModel = require('../models.js').Issue;

  app.route('/api/issues/:project')
  
    .get(async (req, res) => {
      let projectName = req.params.project;
      try {
        const project = await ProjectModel.findOne({ name: projectName });
        if(!project) {
          return res.json({ error: 'project not found' });
        } else {
          const issues = await IssueModel.find({ projectId: project._id, ...req.query, });
          if(!issues) {
            return res.json({ error: 'no issues found' });
          }
          return res.json(issues);
        }
      } catch (error) {
        res.json({ error: 'get error... get failed '});
      }
      
    })
    
    .post(async (req, res) => {
      let projectName = req.params.project;
      const { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;
      if (!issue_title || !issue_text || !created_by) {
        return res.json({ error: 'required field(s) missing' });
      }
      try {
        let projectModel = await ProjectModel.findOne({ name: projectName });
        if (!projectModel) {
          projectModel = new ProjectModel({ name: projectName });
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
        res.json({ error: 'post error... post failed ', _id: _id});
      }
    })
    
    .put(async (req, res) => {
      let projectName = req.params.project;
      const { _id, issue_title, issue_text, created_by, assigned_to, status_text, open } = req.body;
      if (!_id) {
        return res.json({ error: 'missing _id' });
      }
      if (!issue_title && !issue_text && !created_by && !assigned_to && !status_text && !open) {
        return res.json({ error: 'no update field(s) sent', _id: _id });
      }

      try {
        const projectModel = await ProjectModel.findOne({ name: projectName });
        if (!projectModel) {
          throw new Error('project not found');
        }
        let issue = await IssueModel.findByIdAndUpdate(_id, {
          ...req.body,
          updated_on: new Date(),
        });
        await issue.save();
        res.json({ result: 'successfully updated', _id: _id });
      } catch (error) {
        res.json({ error: 'could not update', _id: _id });
      }
      
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      
    });
    
};
