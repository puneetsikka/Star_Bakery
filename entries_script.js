const { MongoClient } = require('mongodb');
const { v4: uuidv4 } = require('uuid');
const url = 'mongodb://localhost:27017';
const dbName = 'shop_db';
function generateRandomDate(from, to) {
  return new Date(
    from.getTime() +
      Math.random() * (to.getTime() - from.getTime()),
  );
}
async function addEntries() {
  const client = new MongoClient(url);

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('orders');
    const itemTypes = [ 'Cake', 'Cookies', 'Muffins']
    const OrderStates = [ 'Created', 'Shipped', 'Delivered', 'Canceled']
    const prices = [500,50,100]
    const entries = [];
    for (let i = 0; i < 100000; i++) {
        const randomIndexItemType = Math.floor(Math.random() * itemTypes.length);
        const randomElementItemType = itemTypes[randomIndexItemType];
        const randomIndexOrderState = Math.floor(Math.random() * OrderStates.length);
        const randomElementOrder = OrderStates[randomIndexOrderState];
      entries.push({
        'item_type':randomElementItemType,
        'order_state':randomElementOrder,
        'last_update_time':Math.floor(Math.random() * 30) + 1,
        'branch':Math.floor(Math.random() * 1000) + 1,
        'price':prices[randomIndexItemType],
        'date':generateRandomDate(new Date(2023, 0, 1), new Date()),
        'customer_id':uuidv4()
      }); 
    }

    await collection.insertMany(entries);

    console.log('100,000 entries added to the database');
  } finally {
    client.close();
  }
}

addEntries().catch(console.error);
