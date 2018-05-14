import app from './app';
try {
  require('babel-polyfill');
} catch (ex) { }


const server = app.listen('9999', (error) => {
  if (error) {
    console.log('error ==> ', error)
  } else {
    console.log(`info ==> 🌎  Listening on port 9999. Open up http://localhost:9999/ in your browser.`);
  }
});



