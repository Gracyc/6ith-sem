let express = require('express');
let app = express();
let morgan = require('morgan');
let dotenv = require('dotenv');
dotenv.config();
let port = process.env.PORT || 7800;
let mongo = require('mongodb');
let cors = require('cors')
let MongoClient = mongo.MongoClient;
let bodyParser = require('body-parser')
let mongoUrl = "mongodb+srv://Mercy:loloklol.12A@myfdatabse.qrcf595.mongodb.net/?retryWrites=true&w=majority";
let db;

app.use(morgan('common'))
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());

app.get('/',(req,res)=>{
    res.send('Students Grievence Redrassal System')
})

function auth(key){
    if(process.env.KEY == key){
        return true
    }else{
        return false
    }  
}

app.get('/complaints',(req,res) => {
    let key = req.header('x-basic-token')
    if(auth(key)) {
        db.collection('complaints').find().toArray((err,result) => {
            if(err) throw err;
            res.send(result)
        })
    } else {
        res.send('Unauthorized Request.')
    }
})

app.delete('/deleteOrder/:id',(req,res) => {
    let _id = mongo.ObjectId(req.params.id);
    db.collection('complaints').remove({_id},(err,result) => {
        if(err) throw err;
        res.send('complaint deleted ')
    })
})





app.post('/writecomplaints',(req,res) => {
    db.collection('complaints').insert(req.body, (err,result) => {
        if(err) throw err;
        res.send('Complaint Sent Successfully.')
    })
})



// connection with db
MongoClient.connect(mongoUrl,(err,client) =>{
    if(err) console.log(`Error While Connecting`);
    db = client.db('Myproject');
    app.listen(port,() => {
        console.log(`listening on port ${port}`)
    })
})

