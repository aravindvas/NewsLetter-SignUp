const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}))

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html")
})

app.post("/", function(req, res){
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;
  // console.log(firstName, lastName, email);

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us20.api.mailchimp.com/3.0/lists/be2d9a7a04"

  const options = {
    method: "POST",
    auth: "aru:d4c5d10e46b6a84c8b6c1aab77e75b9e-us20",

  }

  const request = https.request(url, options, function(respose){

    if (respose.statusCode === 200) {
      res.sendFile(__dirname + "/success.html")
    } else {
      res.sendFile(__dirname + "/failure.html")
    }

    respose.on("data", function(data){
      console.log(JSON.parse(data));
    })
  })

  request.write(jsonData);
  request.end();

  });

app.post("/failure", function(req, res) {
  res.redirect("/")
})

app.listen(process.env.PORT || 3000, function(req, res){
  console.log("server is live on 3000");
})

//To work locally
// app.listen(3000, function(req, res){
//   console.log("server is live on 3000");
// })

//API key
//d4c5d10e46b6a84c8b6c1aab77e75b9e-us20
//List id
//be2d9a7a04
