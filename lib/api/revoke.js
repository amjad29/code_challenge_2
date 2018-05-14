import fs from 'fs'
import { revokeValidator } from '../lib/validator'

const dataRootFile = './shared/';
const companyUsers = 'companyUsers.json';


function revokeOffer(number, companyName, date){

  return new Promise(resolve => {
    const data = JSON.parse(fs.readFileSync(`${dataRootFile}${companyUsers}`, 'utf8'));
    let fileUpdated = false;

    if (data && data[number]) {
      if (data[number].companyName === companyName) {
        fileUpdated = true;

        if (data[number].expireDate > date){
          data[number].expireDate = date
        } else {
          delete data[number];
        }
      }
    }

    if(fileUpdated){
      fs.writeFileSync(`${dataRootFile}${companyUsers}`, JSON.stringify({ ...data }))
    }
    
    resolve(true);
  });

}

export default async function (req, res) {
  const { clientsList, companyName } = req.body;
  let badRecords = [];

  try {
    console.log('info ==> start revoking for ', companyName);

    clientsList.forEach(async (client) => {
      const error = revokeValidator(client);

      if (error.length) {
        badRecords.push(error[0]);
        return;
      }

      await revokeOffer(client.number, companyName, client.date)
    });
    res.status(200).send({ badRecords: badRecords });
  } catch(error){
    res.status(400).send();
  }
}
