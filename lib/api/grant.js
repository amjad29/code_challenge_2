import accountList from '../../data/accounts'
import { grantValidator }  from '../lib/validator'
import fs from 'fs'

const dataRootFile = './shared/';
const companyUsers = 'companyUsers.json';
const offersList = 'offersList.json';

function existInIflixRecord(number){
  return accountList.users.find(o => o.number === number);
}

function addClientToCompany(number, companyName, period, date){
  return new Promise(async (resolve, reject) => {
    try {
          const data = JSON.parse(await fs.readFileSync(`${dataRootFile}${companyUsers}`, 'utf8'));
          const expireDate = new Date(new Date(date).setMonth(new Date(date).getMonth() + period));

          if (data && data[number]) {
            if (data[number].expireDate > date || data[number].expireDate === expireDate) {
              resolve(false);
              return;
            }
          }

          const newRecord = new Object();

          newRecord[number] = {
            companyName,
            expireDate
          };

          await fs.writeFileSync(`${dataRootFile}${companyUsers}`, JSON.stringify({ ...data, ...newRecord }))
          resolve(true);

    } catch(error) {
      console.error('error==>', error, ', number ==>', number, ', companyName ==>', companyName, 'date==>', date, ' ', typeof date)
      reject(error)
    }

  });
}

function addOffer(number, companyName, userRecord, period){

  return new Promise((resolve, reject) => {
    try {
      const data = JSON.parse(fs.readFileSync(`${dataRootFile}${offersList}`, 'utf8'));
  
      if (data && data.subscriptions[userRecord.name]) {
        if (data.subscriptions[userRecord.name][companyName]) {
          data.subscriptions[userRecord.name][companyName] = data.subscriptions[userRecord.name][companyName] + period;
        } else {
          // add new company to the user record
          data.subscriptions[userRecord.name] = {
            ...data.subscriptions[userRecord.name],
            [companyName]: period
          }
        }

      } else {
        // create new record 
        data.subscriptions = {
          ...data.subscriptions,
          [userRecord.name]: {
            [companyName]: period
          }
        }
      }

      fs.writeFileSync(`${dataRootFile}${offersList}`, JSON.stringify({ ...data }));
      resolve(true)
    } catch(error){
      console.error('error==>', error, ', number ==>', number)
      reject(error)
    }

  })
}

export default async function (req, res) {

  const { clientsList, companyName} = req.body;
  let badRecords = [];
  
  try {
    console.log('info ==> start granting for ', companyName)
    clientsList.forEach(async (client) => {
      const error = grantValidator(client);

      if (error.length) {
        badRecords.push(error[0]);
        return;
      }

      const userRecord = existInIflixRecord(client.number);
          
      if (userRecord && await addClientToCompany(client.number, companyName, client.period, client.date)) {
        await addOffer(client.number, companyName, userRecord, client.period);
      }  
    });
    res.status(200).send({ badRecords: badRecords});
  } catch(error){
    res.status(400).send();
  }


}