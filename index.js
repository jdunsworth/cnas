// Imports
const express = require('express');
const app = express();
const say = require('say');
const axios = require('axios');
const player = require('node-wav-player');

// Config
const config = require('./config');



// Initialize Audio

// Register Public Folder as Default
app.use('/', express.static('public'));

/**
 *
 * AA5PD@yahoo.com
 * --------------------
 *  ROUTES
 * --------------------
 */

app.get('/control/say', async (req, res) => {

  await player.play({
    path: './alert.wav',
    sync: true,
  }).catch((error) => {
    console.error(error);
  });
  await say.speak('Severe Thunderstorm Watch issued for Oklahoma County', config.ttsVoice);



  res.json({ status: 'success' });
});


app.get('/alert/:alertType', async (req, res) => {

  if (!req.params.alertType) {
    return res.status(400).json({
      status: 'fail',
      error: {
        code: 400,
        message: 'Alert type not supplied',
      },
    });
  }

  let alertType = req.params.alertType;
  let alertMessage;

  if (alertType == 'tornadowarning') {
    alertMessage = 'Tornado Warning';
  } else if (alertType == 'tornadowatch') {
    alertMessage = 'Tornado Watch';
  }

  await player.play({
    path: './alert.wav',
    sync: true,
  }).catch((error) => {
    console.error(error);
  });

  await say.speak(`${alertMessage}`, config.ttsVoice);

  res.json({ status: 'success' });
});





app.get('/nws/alerts', async (req, res) => {



  // https://api.weather.gov/alerts/active?status=actual&message_type=alert&severity=severe,extreme&area=OK,TX,AR,MS,KS,MO
  let weatherAlerts = 'https://api.weather.gov/alerts/active?status=actual&message_type=alert&severity=severe,extreme&area=OK,TX,AR,MS,KS,MO';
  res.json({ status: 'success' });
});




// Start the Server
app.listen(config.port, () => console.log(`Zello Weather Responder running on port ${config.port}...`));

