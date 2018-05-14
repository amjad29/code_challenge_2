import chai from 'chai';
import sinon from 'sinon';
import request from 'supertest';
import proxyquire from 'proxyquire';

const { expect } = chai;

let app, readFileSync, writeFileSync;

before(() => {
  readFileSync = sinon.stub();
  writeFileSync = sinon.stub();
  app = proxyquire('../src/app', {
    'fs': {
      '@global': true,
      readFileSync: readFileSync
    },
  }).default;
});

async function sendRequest() {
  return await request(app)
    .get('/subscriptions')
    .set('Accept', 'application/json')
    .send();
}


describe('calling subscriptions api', () => {
  let result;
  before(async () => {
    readFileSync.withArgs('./shared/offersList.json').returns("{\"subscriptions\":{\"Eyad\":{\"amazecom\":52,\"wondertel\":62},\"Ahmad\":{\"amazecom\":34,\"wondertel\":35}}}");
    result = await sendRequest();
  });

  it('returns a 200 http status code', () => {
    expect(result.status).to.equal(200);
  });

  it('and it is returning the corrupted records if any ', () => {
    expect(result.text).to.equal('{"subscriptions":{"Eyad":{"amazecom":52,"wondertel":62},"Ahmad":{"amazecom":34,"wondertel":35}}}');
  });
});


