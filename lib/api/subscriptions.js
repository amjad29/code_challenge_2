import fs from 'fs'

export default async function (req, res) {
  console.log('info ==> getting subscriptions')
  try {
    res.status(200).json(JSON.parse(await fs.readFileSync(`./shared/offersList.json`, 'utf8')));
  } catch (error){
    console.log('get subscription error ==>', error)
    res.status(400).send()
  }  
}
