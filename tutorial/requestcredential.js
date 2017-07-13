
var express = require('express');
var uport = require('../lib/index.js');
var jsontokens = require('jsontokens')
var bodyParser = require('body-parser')

var signer = uport.SimpleSigner('5acea265dcbf01355956b36f82793a13caf1be650bb74ca7a40da74b412d44b5')


var credentials = new uport.Credentials({
  appName: 'Credential Tutorial',
  address: '2opiNrGSxTW6sFo6ervHZnEeEXGNGAoupFN',
  signer: signer
//  networks: {'0x4': {'registry' : '0x2cc31912b2b0f3075a87b3640923d45a26cef3ee', 'rpcUrl' : 'https://rinkeby.infura.io'}}
  // Note: we use Rinkeby by default, the above is the explicit format for selecting a network
})

var app = express();

app.use(bodyParser.json({ type: '*/*' }))

app.get('/', function (req, res) {

  credentials.createRequest({
    verified: ['Custom Attestation'],
    callbackUrl: 'http://192.168.1.124:8081/callback',
  }).then( function(requestToken) {
    var uri = 'me.uport:me?requestToken=' + requestToken
    var qrurl = 'http://chart.apis.google.com/chart?cht=qr&chs=400x400&chl=' + uri
    console.log(uri)
    res.send('<img src=' + qrurl + '></img>');
  })

})

app.post('/callback', function (req, res) {

  var jwt = req.body.access_token
  console.log(jwt)

  credentials.receive(jwt).then( function(creds) {
    if (creds.address == creds.verified[0].sub && 
       creds.verified[0].iss == '2od4Re9CL92phRUoAhv1LFcFkx2B9UAin92' &&
       creds.verified[0].claim['Custom Attestation'] === 'Custom Value')
    {
      console.log('Credential verified.');
    } else {
      console.log('Verification failed.');
    }
  })

})

var server = app.listen(8081, function () {
  
  console.log("Tutorial app running...")
})
