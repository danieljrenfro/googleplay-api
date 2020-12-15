const app = require('../app');
const expect = require('chai').expect;
const supertest = require('supertest');

describe('GET /apps endpoint', () => {
  it('should return a list of apps', () => {
    const appObjectKeys = [
      "App", "Category", "Rating", "Reviews", "Size", "Installs", "Type", "Price", "Content Rating", "Genres", "Last Updated", "Current Ver", "Android Ver"
    ];
    

    return supertest(app)
      .get('/apps')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        expect(Object.keys(res.body[0])).to.have.members(appObjectKeys);
      });
  });

  it('should return 400 if wrong sort option', () => {
    const requestQuery = { sort: 'Mistake' };

    return supertest(app)
      .get('/apps')
      .query(requestQuery)
      .expect(400, 'Apps must be sorted by "rating" or "app".');
  });

  it('should return 400 if wrong genre entered', () => {
    const requestQuery = { genres: 'Mistake' };

    return supertest(app)
      .get('/apps')
      .query(requestQuery)
      .expect(400, /You must select one of these genres:/);
  });

  it('should sort results by rating', () => {
    return supertest(app)
      .get('/apps')
      .query({ sort: 'rating' })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        let sorted = true;
        let i = 0;

        while (i < res.body.length - 1) {
          const appAtI = res.body[i];
          const appAtIPlus1 = res.body[i + 1];

          if (appAtI['Rating'] > appAtIPlus1['Rating']) {
            sorted = false;
            break;
          }
          i++;
        }
        expect(sorted).to.be.true;
      });
  });

  it('should sort results by app name', () => {
    return supertest(app)
      .get('/apps')
      .query({ sort: 'app' })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        let sorted = true;
        let i = 0;

        while(i < res.body.length - 1) {
          const appAtI = res.body[i];
          const appAtIPlus1 = res.body[i + 1];

          if (appAtI['App'] < appAtIPlus1['App']) {
            sorted = false;
            break;
          }
          i++;
        }
      });
  });

  it('should filter results by genres', () => {
    return supertest(app)
      .get('/apps')
      .query({ genres: 'Action' })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array')
        let filtered = true;
        let i = 0;

        while (i < res.body.length) {
          if (!res.body[i]['Genres'].includes('Action')) {
            filtered = false;
            break;
          }
          i++;
        }
        expect(filtered).to.be.true;
      });
  });
});