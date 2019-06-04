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



/**
 * ------------------------
 * NWS Alert Retrieval
 * ------------------------
 */
app.get('/nws/alerts', async (req, res) => {

  // Get config options and join them by commas
  let alertAreas = config.weatherAlerts.areas.join(',') || undefined;
  let alertSeverity = config.weatherAlerts.severity.join(',') || undefined;
  let alertStatus = config.weatherAlerts.status.join(',') || undefined;
  let alertAlerts = config.weatherAlerts.alerts.join(',') || undefined;

  // Formulate the request URL
  let weatherAlerts = await axios.get('https://api.weather.gov/alerts/active', {
    params: {
      status: alertStatus,
      event: alertAlerts,
      severity: alertSeverity,
      area: alertAreas,
    },
  }).then((res) => {

    let weatherData = res.data.features;
    let weatherAlerts = [];

    weatherData.forEach((alert) => {

      weatherAlerts.push({
        id: alert.properties.id,
        area: alert.properties.areaDesc,
        status: alert.properties.status,
        severity: alert.properties.severity,
        urgency: alert.properties.urgency,
        certainty: alert.properties.certainty,
        event: alert.properties.event,
        senderName: alert.properties.senderName,
        headline: alert.properties.headline,
        description: alert.properties.description,
        dates: {
          sent: alert.properties.sent,
          effective: alert.properties.effective,
          expires: alert.properties.expires,
          ends: alert.properties.ends,
        },
      });

    });

    return weatherAlerts;
  }).catch((err) => {
    console.log('ERROR', err);
  });

  return res.json({ status: 'success', weatherAlerts});
});



app.get('/alert/say', async (req, res) => {


  // Get Query Params
  let alert = req.query.alert;
  let preamble = req.query.preamble;
  let postamble = req.query.postamble;

  // Check if alert query param was included
  if (!alert) {
    return res.json({
      status: 'fail',
      error: 'Alert text not sent',
    });
  }

  // Check if alert query param is too long
  if (alert.length > 150) {
    return res.json({
      status: 'fail',
      error: 'Alert text too long',
    });
  }

  // Determine if we have a preamble, it's valid, then play it
  if (preamble && config.validAlertWavs.includes(preamble)){
    await player.play({
      path: `./sounds/${preamble}.wav`,
      sync: true,
    }).catch((error) => {
      console.error('Unable to play sound: ', error);
    });
  }

  // TTS
  await say.speak(alert, config.ttsVoice, 0.90 , async (err) => {

    // Determine if we have a postamble, it's valid, then play it
    if (postamble && config.validAlertWavs.includes(postamble)){
      await player.play({
        path: `./sounds/${postamble}.wav`,
        sync: true,
      }).catch((error) => {
        console.error('Unable to play sound: ', error);
      });
    }


  });



  return res.json({ status: 'success', alert, preamble, postamble });

});


/**
 * Simple Alert Type Player
 * ------------------------
 */
app.get('/alert/:alertType', async (req, res) => {

  // Param Not Passed
  if (!req.params.alertType) {
    return res.status(400).json({
      status: 'fail',
      error: 'Alert type not supplied',
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





// Start the Server
app.listen(config.port, () => console.log(`Cajun Navy Alert Monitor running on port ${config.port}...`));

