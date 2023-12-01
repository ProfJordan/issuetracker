'use strict';

module.exports = function (app) {

  const ProjectModel = require('../models.js').Project;
  const IssueModel = require('../models.js').Issue;

  app.route('/api/issues/:project/')
  
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
    
  //   .delete(async (req, res) => {
  //     let projectName = req.params.project;
  //     const { _id } = req.body;
  // if (!_id) {
  //         return res.json({ error: 'missing _id' });
  //     }
  //     try {
  //         const projectModel = await ProjectModel.findOne({ name: projectName });
  //         if (!projectModel) {
  //             throw new Error('project not found');
  //         }
  
  //         const result = await IssueModel.deleteOne({ _id: _id, projectId: projectModel._id });
  // if (result.deletedCount === 0) {
  //             throw new Error('ID not found.');
  //         }
  
  //         res.json({ result: 'successfully deleted', '_id': _id });
  //     } catch (error) {
  //         console.error('Error deleting issue:', error.message);
  //         res.status(500).json({ error: 'could not delete', '_id': _id });
  //     }
  // });

  .delete(async (req, res) => {
    const projectName = req.params.project;
    if (req.body._id === undefined) {
        res.json({ error: 'missing _id' });
    } else {
        const reqId = req.body._id;
        try {
            let findProject = await ProjectModel
                .findOne({ name: projectName })
            let deleteIssue = await IssueModel
                .deleteOne({ projectId: findProject._id, _id: reqId })
            if (deleteIssue.deletedCount == 0) {
                res.json({ error: 'could not delete', '_id': reqId });
            } else {
                res.json({ result: 'successfully deleted', '_id': reqId });
            }
        } catch (err) {
            console.log(err);
            res.json({ error: 'could not delete', '_id': reqId });
        }
    }
})
  
};
