const express = require('express');
const https = require('https');
const axios = require('axios')
const redis = require("redis");
const client = redis.createClient();
let app = express();


function sendResponse(key,value) {
    return(`<h1> ${key} has id ${value} <h1>`)

}
async function fetchData(req,res,next) {
    try{
        let name2 =req.params.name;
        console.log("Param => "+name2);
        let response =await axios(`https://api.github.com/users/kaungmyat999`).then((result)=>{
            let {id}=result.data;
            client.set(name2, id, redis.print);
            res.send(sendResponse(name2,id))
        });
        //let response2 = awaita url.parse(`https://api.github.com/users/${name2}`);
        
    }catch(err){
        console.log(err);
        res.status(500)
    }
    //res.send(data);
}

function cache(req,res,next){
    const {name} = req.params;
    client.get(name,(err,data)=>{
        if(err) throw err;

        if(data){
            res.send(sendResponse(name,data));
        }else{
            next();
        }
    });

}
app.get("/:name",cache,fetchData);

app.listen(3000,()=>console.log("Server is running on port "+3000))