import fs from 'fs'
import fetch from 'node-fetch';

const partnerList = ['amazecom', 'wondertel'];
const dataRootFile = '../data'

function getPartnerRecords() {
  let dataList = fs.readdirSync(dataRootFile).map(file => file);

  return dataList.filter(fileName => {

    const splitArray = fileName.split('.');
    const length = splitArray.length;

    if (length > 1 && partnerList.indexOf(splitArray[0]) >= 0 && splitArray[length - 1] === 'json') {
      return true;
    }
  });
}

async function revoke(revocationsList, companyName) {
  let result = await fetch('http://localhost:9999/revoke',
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        clientsList: revocationsList,
        companyName
      })
    });
  return await result.json();
}

async function grant(grantsList, companyName) {
  let result = await fetch('http://localhost:9999/grant',
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        clientsList: grantsList,
        companyName
      })
    });
  return await result.json();
}

async function getSubscriptions() {
  let result = await fetch('http://localhost:9999/subscriptions',
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
  return await result.json();
}

async function applicationRun() {
  try {
    const lists = getPartnerRecords();

    lists.forEach(async (fileName) => {
      const data = JSON.parse(fs.readFileSync(`${dataRootFile}/${fileName}`, 'utf8'));
      const partner = fileName.split('.')[0];

      console.log('processing ', partner, 'records')
      
      const revokeData =  await revoke(data.revocations, partner)
      const grantData =  await grant(data.grants, partner)

      console.log('bad records in revoke==>', revokeData, 'bad records in grant==>', grantData)
     
    });
    
    const result = await getSubscriptions();
     
    fs.writeFile('./../output/result.json', JSON.stringify({ ...result }), function (err) {
      if (err) throw err;
    });

  } catch (error) {
    console.log('error==>', error)
  }

}

applicationRun();


