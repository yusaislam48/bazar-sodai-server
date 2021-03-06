const express = require('express')
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
app.use(cors());
app.use(bodyParser.json());
const { ObjectID } = require('mongodb').ObjectID;
const port = process.env.PORT || 4000

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sfmoe.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("bazar-sodai").collection("products");
  const orderCollection = client.db("bazar-sodai").collection("orderProducts");

  console.log('connect');

  // add product
  app.post('/addProduct', (req, res) => {
    const newProduct = req.body;
    console.log('adding new product', newProduct)

    collection.insertOne(newProduct)
    .then(result => {
      console.log('inserted count', result.insertedCount);
      res.send(result.insertedCount > 0);
    })
  }); 

  //add order product
  app.post('/addOrderProduct', (req, res) => {
    const newOrder = req.body;
    console.log('adding new order', newOrder)

    orderCollection.insertOne(newOrder)
    .then(result => {
      console.log('inserted count', result.insertedCount);
      res.send(result.insertedCount > 0);
    })
  });

  //find product
  app.get('/products', (req, res) => {
    collection.find()
    .toArray((error, documents) => {
      res.send(documents);
    })
  });

  // find order
  app.get('/orders/:email', (req, res) => {
    const email = req.params.email;
    console.log(email)
    orderCollection.find({customerEmail: email})
    .toArray((error, documents) => {
      res.send(documents);
    })
  });

  //delete product
  app.delete('/deleteProduct/:id', (req, res) => {
    const id = ObjectID(req.params.id)
    console.log('detele this id', id);
    collection.findOneAndDelete({_id: id})
    .then(documents => res.send(!! documents.value))
  });

  //find product for checkout
  app.get('/product/:id', (req, res) => {
    const id = ObjectID(req.params.id)
    console.log('find this id', id);
    collection.find({_id: id})
    .toArray((error, documents) => {
      res.send(documents);
    })
  });

});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})