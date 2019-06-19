const test = require('unit.js');

const api = require('./index');

describe('jwt demo tests', function() {
  // $auth tests
  it('protected endpoint with no auth', function(done) {
    test
      .httpAgent(api)
      .get('/')
      .expect(401)
      .end((err, res) => {
        if (err) test.fail(err.message);
        else done();
      });
  });

  it('protected endpoint with incorrect auth', function(done) {
    test
      .httpAgent(api)
      .get('/')
      .set('Authorization', `Bearer foobar`)
      .expect(403)
      .end((err, res) => {
        if (err) test.fail(err.message);
        else done();
      });
  });

  let token;

  it('get auth', function(done) {
    test
      .httpAgent(api)
      .post('/login')
      .send({ username: "admin", password: "password" })
      .expect(200)
      .end((err, res) => {
        if (err) test.fail(err.message);
        test.assert(res.body.token);
        token = res.body.token;
        done();
      });
  });

  it('protected endpoint with auth', function(done) {
    test
      .httpAgent(api)
      .get('/')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .end((err, res) => {
        if (err) test.fail(err.message);
        else done();
      });
  });

  after(function() {
    api.close();
  });

});
