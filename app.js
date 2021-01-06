const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const https = require("https");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


//When the user lands on the site we will send this page
app.get("/", function(request, response) {
  response.sendFile(__dirname + "/signup.html");
});


app.post("/", function(req, res) {
  //we have to refer to the fields by name
  var firstName = req.body.fName;
  var lastName = req.body.lName;
  var email = req.body.email;

  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };

  const jsonData = JSON.stringify(data);
  const url = "https://us7.api.mailchimp.com/3.0/lists/4c06a0cf78"

  const options = {
    method: "POST",
    auth: "laszlo:a4bd8fd0c8f8d1558e69e061a722f8ae-us7"
  }

//send a https request
  const request = https.request(url, options, function(response) {
//the callback function we catch the response

    if (response.statusCode===200){ //if it was successful than load the success.html
      res.sendFile(__dirname + "/success.html");
    } else{
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data) {
      console.log(JSON.parse(data));
    })
  })

  request.write(jsonData);
  request.end();


  console.log(firstName, lastName, email);
})


//add a new route for the failure, the failure route
app.post("/failure", function(req, res) {
//redirect the user to the home route
res.redirect("/");
})

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});


//API LEY: a4bd8fd0c8f8d1558e69e061a722f8ae-us7
// unique list id: 4c06a0cf78
