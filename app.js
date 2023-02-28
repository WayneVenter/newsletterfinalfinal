
//Include modules
const express = require("express");
const https = require('https');
const bodyParser = require("body-parser");

//App Variables
const app = express();
const port = 3000;

//Mailchimp configuration
const apiKey = "4bec746e77422aebec3593f82324d136-us21";
const listId = "fc879086f3";
const serverPrefix = "us21";

//App usage
app.use('/css', express.static('css'));
app.use('/images', express.static('images'));

// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({extended:true});


//(GET) request from browser
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html"); 
});

//(POST) request from browser
app.post("/", urlencodedParser, (req, res) => {

  var data = {
    email_address: req.body.email,
    status: "subscribed",
    merge_fields: {
    FNAME: req.body.firstName,
    LNAME: req.body.lastName
    }
  }

  const jsonData = JSON.stringify(data);
  const url = "https://" + serverPrefix + ".api.mailchimp.com/3.0/lists/" + listId + "/members";

  const options = {
    method: "POST",
    auth: "wayne:" + apiKey
  };
  
  //HTTPS (POST) request to mailchimp API
  const request = https.request(url, options, (response) => {

    //console.log('statusCode:', res.statusCode);
    //console.log('headers:', res.headers);

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
  
    response.on('data', (data) => {
      //console.log(JSON.parse(data));
    });
  });

  request.on('error', (e) => {
    console.error(e);
  });

  request.write(jsonData);
  request.end();
});


//Failure (POST) request from browser
app.post("/failure", (req, res) => {
  res.redirect("/");
});

//App listener
app.listen(process.env.PORT || port, () => {
  console.log(`Newsletter app running on port ${port}.`);
});