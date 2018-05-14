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
      readFileSync: readFileSync,
      writeFileSync: writeFileSync
    },
    '../shared/accountsNumber': {
      '@global': true,
      accountsNumber: [77902601451, 2585076194]
    },
    '../../data/accounts': {
      '@global': true,
      users: [
        {
          "number": "45875660609",
          "name": "John"
        },
        {
          "number": "49509330262",
          "name": "Jenny"
        },
        {
          "number": "99994739873",
          "name": "Ahmad"
        },
        {
          "number": "77902601451",
          "name": "Hussain"
        }
      ]
    }

  }).default;
});

async function sendRequest({ api = '/revoke', revokeList = [], companyName = 'test' }) {
  return await request(app)
    .put(api)
    .set('Accept', 'application/json')
    .send({
      clientsList: revokeList,
      companyName: companyName
    });
}

describe('calling revoke api', () =>{
  describe('When revoke data is valid', () => {
    let result;
    before(async () => {
      let revokeList = [
        {
          "number": "77902601451",
          "date": "2015-10-16T22:24:24+00:00"
        },
        {
          "number": "2585076194",
          "date": "2015-10-16T22:24:24+00:00"
        },
        {
          "number": "30969230305",
          "date": "2015-07-23T12:34:10+00:00"
        },
        {
          "number": "90702746086111",
          "date": "2015-07-23T12:34:10+00:00"
        }
      ];

      readFileSync.withArgs('./shared/companyUsers.json').returns("{ \"77902601451\": { \"companyName\": \"wondertel\", \"expireDate\": \"2015-11-14T16:24:24.000Z\" }  }");
      writeFileSync.withArgs('./shared/companyUsers.json').returns("{ \"77902601451\": { \"companyName\": \"wondertel\", \"expireDate\": \"2015-11-14T16:24:24.000Z\" }  }");
      result = await sendRequest({ revokeList });
    });

    it('returns a 200 http status code', () => {
      expect(result.status).to.equal(200);
    });

    it('and it is returning the corrupted records if any ', () => {
      expect(result.text).to.equal('{"badRecords":[{"message":"instance.number does not conform to the \\"phoneNumberFormat\\" format","property":"instance.number","record":{"number":"2585076194","date":"2015-10-16T22:24:24+00:00"}},{"message":"instance.number does not conform to the \\"phoneNumberFormat\\" format","property":"instance.number","record":{"number":"90702746086111","date":"2015-07-23T12:34:10+00:00"}}]}');
    });
  });

  describe('When the data is invalid', () => {
    let result;
    before(async () => {
      let revokeList = {
        data: [
          {
            "period": 2,
            "number": "77902601451",
            "date": ""
          },
          {
            "period": 0,
            "number": "2585076194",
            "date": "2015-10-16T22:24:24+00:00"
          },
          {
            "number": "30969230305",
            "date": "2015-07-23T12:34:10+00:00"
          },
          {
            "period": 6,
            "number": "90702746086",
            "date": ""
          }
        ]
      };

      readFileSync.withArgs('../lib/shared/companyUsers.json').returns("{ \"77902601451\": { \"companyName\": \"wondertel\", \"expireDate\": \"2015-11-14T16:24:24.000Z\" }  }");
      result = await sendRequest({ revokeList });
    });

    it('returns a 400 http status code', () => {
      expect(result.status).to.equal(400);
    });
  });

})

