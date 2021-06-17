const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
//for sending html and css(static we ue the following 
app.use(express.static("public"));
// create a public dir

app.get('/', function(req,res){
    res.sendFile(__dirname+"/signup.html");
});

app.post("/", function(req,res){
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;

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
        //changed to json
        const jsonData = JSON.stringify(data);

        const url = "https://us6.api.mailchimp.com/3.0/lists/67271748d5";

        const options = {
            method: "POST",
            auth: "user_admin:"
        }

        const request = https.request(url, options, function(response){
            if (response.statusCode === 200){
                res.sendFile(__dirname+"/success.html");
            }
            else{
                res.sendFile(__dirname+"/failure.html");
            }
            response.on("data", function(data){
                console.log(JSON.parse(data));

            })
        });

        app.post('/failure', function(req, res){
            res.redirect("/");
        })

        app.post("/renew", function(req,res){
            res.redirect("/");
        })

        // for sending this to mail chimp along with "JSON DATA"
        // the following is done 
        // we set the http request to a variable request
        // then do the following
        
        request.write(jsonData)
        request.end(); 
    

    // we got to post to the api hence no http.get
    
});

app.listen(process.env.PORT || 3000, function(){
    console.log("Listen on 3000");
}); 

