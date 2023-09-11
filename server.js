const express = require("express");
const cors = require('cors');
const { MongoClient } = require("mongodb");
const bodyParser = require('body-parser');
const app = express();
const PORT = 5000;
const url = "mongodb://localhost:27017";
const dbName = "shop_db";
const client = new MongoClient(url, { useNewUrlParser: true});
app.use(cors())

async function fetch(){
    var dataTobeSent = {}
    await client.connect();
    
    const db = client.db(dbName);
    const collection = db.collection('orders');    
    const itemTypes = [ 'Cake', 'Cookies', 'Muffins']
    const OrderStates = [ 'Created', 'Shipped', 'Delivered', 'Canceled']
    const itemTypesObject = {}
    const OrderStatesObject = {}
    for (let i of itemTypes){
      itemTypesObject[i] = await collection.countDocuments({'item_type':i})
    }
    for (let i of OrderStates){
      OrderStatesObject[i] = await collection.countDocuments({'order_state':i})
    }
    const top_5 = collection.aggregate([
      {
        $group: {
          _id: "$branch",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 5
      }
    ])
    dataTobeSent['top_5'] = await top_5.toArray()
    dataTobeSent['itemTypesObject'] = itemTypesObject
    dataTobeSent['OrderStatesObject'] = OrderStatesObject
    return dataTobeSent
}
async function fetchFilter(requestData){
  var dataTobeSent = {}
  var queryFilter = {date:{$gte:new Date(requestData[0].slice(0, 10)),$lt:new Date(requestData[1].slice(0, 10))}}
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection('orders');
  const itemTypes = [ 'Cake', 'Cookies', 'Muffins']
  const OrderStates = [ 'Created', 'Shipped', 'Delivered', 'Canceled']
  const itemTypesObject = {}
  const OrderStatesObject = {}
  for (let i of itemTypes){
    itemTypesObject[i] = await collection.countDocuments({'item_type':i,...queryFilter})
  }
  for (let i of OrderStates){
    OrderStatesObject[i] = await collection.countDocuments({'order_state':i,...queryFilter})
  }
  const top_5 = collection.aggregate([
    {
      $group: {
        _id: "$branch",
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    },
    {
      $limit: 5
    }
  ])
  dataTobeSent['top_5'] = await top_5.toArray()
  dataTobeSent['itemTypesObject'] = itemTypesObject
  dataTobeSent['OrderStatesObject'] = OrderStatesObject
  return dataTobeSent
}
async function addEntry(){
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection('orders');
  await collection.insertMany([]) // entries can be added in the list 
}
app.get('/api/order/:customer_id', async function(req, res) {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection('orders');
  res.send(await collection.findOne({'customer_id':req.params.customer_id}));
});

app.get(`/api/order`,async (req, res) => {
  res.send(await addEntry())
});

app.get(`/api/list`,async (req, res) => {
  res.send(await fetch())
});
app.use(bodyParser.json());
app.post(`/api/list`,async (req, res) => {
  const requestData = await req.body;
  res.send(await fetchFilter(requestData))
});
app.listen(PORT, function (err) {
  if (err) console.log(err);
  console.log("Server listening on PORT", PORT);
});
