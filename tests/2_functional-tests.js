const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let issue1;
let issue2;


// Create an issue with every field: POST request to /api/issues/{project}
// Create an issue with only required fields: POST request to /api/issues/{project}
// Create an issue with missing required fields: POST request to /api/issues/{project}
// View issues on a project: GET request to /api/issues/{project}
// View issues on a project with one filter: GET request to /api/issues/{project}
// View issues on a project with multiple filters: GET request to /api/issues/{project}
// Update one field on an issue: PUT request to /api/issues/{project}
// Update multiple fields on an issue: PUT request to /api/issues/{project}
// Update an issue with missing _id: PUT request to /api/issues/{project}
// Update an issue with no fields to update: PUT request to /api/issues/{project}
// Update an issue with an invalid _id: PUT request to /api/issues/{project}
// Delete an issue: DELETE request to /api/issues/{project}
// Delete an issue with an invalid _id: DELETE request to /api/issues/{project}
// Delete an issue with missing _id: DELETE request to /api/issues/{project}


suite('Functional Tests', function () {
    const project = 'testing';
    let reqId;
    let invalidID = 'invalidID';
    let fakeID = '5c4a4b8185266dfe0e81d58a';
    suite('Routing tests', function () {

        //////// POST TESTS ////////
        suite('3 Post requests', function () {
            test('#1 Create an issue with every field: POST request to /api/issues/{project}', function (done) {
                chai.request(server)
                    .post('/api/issues/testing')
                    .set('content-type', 'application/json')
                    .send({
                        issue_title: 'Issue 1',
                        issue_text: 'Functional Test',
                        created_by: 'Functional Test - Every field filled in',
                        assigned_to: 'Chai and Mocha',
                        status_text: 'In QA'
                    })
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        issue1 = res.body;
                        assert.equal(res.body.issue_title, 'Issue 1');
                        assert.equal(res.body.issue_text, 'Functional Test');
                        assert.equal(res.body.created_by, 'Functional Test - Every field filled in');
                        assert.equal(res.body.assigned_to, 'Chai and Mocha');
                        assert.equal(res.body.status_text, 'In QA');
                        issue1 = res.body;
                        done();
                    });
            }).timeout(10000);
            test('#2 Create an issue with only required fields: POST request to /api/issues/{project}', function (done) {
                chai.request(server)
                    .post('/api/issues/testing')
                    .set('content-type', 'application/json')
                    .send({
                        issue_title: 'Issue 2',
                        issue_text: 'Functional Test',
                        created_by: 'Functional Test - Only required fields filled in',
                        assigned_to: '',
                        status_text: '',
                    })
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        issue2 = res.body;
                        assert.equal(res.body.issue_title, 'Issue 2');
                        assert.equal(res.body.issue_text, 'Functional Test');
                        assert.equal(res.body.created_by, 'Functional Test - Only required fields filled in');
                        assert.equal(res.body.assigned_to, '');
                        assert.equal(res.body.status_text, '');
                        done();
                    });
            }).timeout(10000);
            test('#3 Create an issue with missing required fields: POST request to /api/issues/{project}', function (done) {
                chai.request(server)
                    .post('/api/issues/testing')
                    .set('content-type', 'application/json')
                    .send({
                        issue_title: '',
                        issue_text: '',
                        created_by: 'Functional Test - Missing required fields',
                        assigned_to: '',
                        status_text: '',
                    })
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.equal(res.body.error, 'required field(s) missing');
                        done();
                    });
            }).timeout(10000);
        });

        //////// GET TESTS ////////
        suite('3 Get requests', function () {
            test('#4 View issues on a project: GET request to /api/issues/{project}', function (done) {
                chai.request(server)
                    .get('/api/issues/testing')
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        done();
                    });
            }).timeout(10000);
            test('#5 View issues on a project with one filter: GET request to /api/issues/{project}', function (done) {
                chai.request(server)
                    .get('/api/issues/testing?issue_title=Issue 1')
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.equal(res.status, 200);
                        assert.equal(res.body[0].issue_title, issue1.issue_title);
                        assert.equal(res.body[0].issue_text, issue1.issue_text);
                        done();
                    });
            }).timeout(10000);
            test('#6 View issues on a project with multiple filters: GET request to /api/issues/{project}', function (done) {
                chai.request(server)
                    .get('/api/issues/testing')
                    .query({
                        issue_title: issue1.issue_title,
                        issue_text: issue1.issue_text,
                    })
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.equal(res.body[0].issue_title, issue1.issue_title);
                        assert.equal(res.body[0].issue_text, issue1.issue_text);
                        done();
                    });
            }).timeout(10000);
        });

        //////// PUT TESTS ////////

        suite('5 Put requests', function () {
            test('#7 Update one field on an issue: PUT request to /api/issues/{project}', function (done) {
                chai.request(server)
                    .put('/api/issues/testing')
                    .send({
                        _id: issue1._id,
                        issue_title: 'Updated Issue 1'
                    })
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.equal(res.body.result, 'successfully updated');
                        assert.equal(res.body._id, issue1._id);
                        done();
                    });
            }).timeout(10000);
            test('#8 Update multiple fields on an issue: PUT request to /api/issues/{project}', function (done) {
                chai.request(server)
                    .put('/api/issues/testing')
                    .send({
                        _id: issue1._id,
                        issue_title: 'Updated Issue 1',
                        issue_text: 'Updated Issue 1',
                    })
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.equal(res.body.result, 'successfully updated');
                        assert.equal(res.body._id, issue1._id);
                        done();
                    });
            }).timeout(10000);
            test('#9 Update an issue with missing _id: PUT request to /api/issues/{project}', function (done) {
                chai.request(server)
                    .put('/api/issues/testing')
                    .set('content-type', 'application/json')
                    .send({
                        issue_title: 'Updated Issue 1 title',
                        issue_text: 'Updated Issue 1 text',
                    })
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.equal(res.body.error, 'missing _id');
                        done();
                    });
            }).timeout(10000);
            test('#10 Update an issue with no fields to update: PUT request to /api/issues/{project}', function (done) {
                chai.request(server)
                    .put('/api/issues/testing')
                    .send({
                        _id: issue1._id,
                    })
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.equal(res.body.error, 'no update field(s) sent');
                        assert.equal(res.body._id, issue1._id);
                        done();
                    });
            }).timeout(10000);
            test('#11 Update an issue with an invalid _id: PUT request to /api/issues/{project}', function (done) {
                chai.request(server)
                    .put('/api/issues/testing')
                    .send({
                        _id: '656a4b8185266dfe0e81d58a',
                        issue_title: 'Updated Issue 1 title again',
                        issue_text: 'Updated Issue 1 text again',
                    })
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.equal(res.body.error, 'could not update');
                        done();
                    })
                    .timeout(10000);
            });

            //////// DELETE TESTS ////////
            suite('3 Delete requests', function () {
                // test('Delete an issue: DELETE request to /api/issues/{project}', function (done) {
                //     chai.request(server)
                //         .delete('/api/issues/testing')
                //         .send({
                //             _id: issue1._id,
                //         })
                //         .end(function (err, res) {
                //             assert.equal(res.status, 200);
                //             assert.equal(res.body.result, 'successfully deleted');
                //         })
                //         .timeout(10000);
                // }),
                //     chai.request(server)
                //         .delete('/api/issues/testing')
                //         .send({
                //             _id: issue2._id,
                //         })
                //         .end(function (err, res) {
                //             assert.equal(res.status, 200);
                //             assert.equal(res.body.result, 'successfully deleted');
                //             done();
                //         })
                //     .timeout(10000);
                // test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', function (done) {
                //     chai.request(server)
                //         .delete('/api/issues/testing')
                //         .send({
                //             _id: '656a4b8185266dfe0e81d58a',
                //         })
                //         .end(function (err, res) {
                //             assert.equal(res.status, 200);
                //             assert.equal(res.body.error, 'could not delete');
                //             done();
                //         })
                //         .timeout(10000);
                // });
                // test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', function (done) {
                //     chai.request(server)
                //         .delete('/api/issues/testing')
                //         .send({})
                //         .end(function (err, res) {
                //             assert.equal(res.status, 200);
                //             assert.equal(res.body.error, 'missing _id');
                //             done();
                //         })
                //         .timeout(10000);
                // });
                test('#12 Delete an issue: DELETE request to /api/issues/{project}', function (done) {
                    chai.request(server)
                        .delete(`/api/issues/testing/`)
                        .send({
                            _id: issue1._id,
                        })
                        .end(function (err, res) {
                            assert.equal(res.status, 200);
                            assert.equal(res.body.result, 'successfully deleted');
                        });

                    chai.request(server)
                        .delete(`/api/issues/testing/`)
                        .send({
                            _id: issue2._id,
                        })
                        .end(function (err, res) {
                            assert.equal(res.status, 200);
                            assert.equal(res.body.result, 'successfully deleted');
                            done();
                        })
                        .timeout(10000);
                });

                test('#13 Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', function (done) {
                    chai.request(server)
                        .delete('/api/issues/testing/')
                        .send({
                            _id: '0123456789abcdef01234567',
                        })
                        .end(function (err, res) {
                            assert.equal(res.status, 200);
                            assert.equal(res.body.error, 'could not delete');
                            done();
                        })
                        .timeout(10000);
                });

                test('#14 Delete an issue with missing _id: DELETE request to /api/issues/{project}', function (done) {
                    chai.request(server)
                        .delete('/api/issues/testing/')
                        .send({})
                        .end(function (err, res) {
                            assert.equal(res.status, 200);
                            assert.equal(res.body.error, 'missing _id');
                            done();
                        })
                        .timeout(10000);
                });

            });

        });
    });

});