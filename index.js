const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion ,ObjectId} = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xfjzvlh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri)


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const addCraftCollection = client.db("addCraftDB").collection('addCraft');

    const craftItemCollection = client.db("addCraftDB").collection('craftItem');

    

    app.get('/addCraft', async(req, res) =>{
        const query = req.query
        const cursor =await addCraftCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
    })


    app.get('/addCraft/:id', async(req, res) =>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await addCraftCollection.findOne(query);
        res.send(result);
    })


    app.post('/addCraft', async(req, res) =>{
        const newCraft = req.body;
        const result = await addCraftCollection.insertOne(newCraft);
        res.send(result);
    })

    app.put('/addCraft/:id', async(req, res) =>{
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)}
        const options = { upsert: true };
        const updatedArts = req.body;
        const addCraft = {
            $set: {
                name: updatedArts.name,
                subcategory: updatedArts.subcategory,
                description: updatedArts.description,
                stock: updatedArts.stock,
                customization: updatedArts.customization,
                processing: updatedArts.processing,
                price: updatedArts.price,
                rating: updatedArts.rating,
                image: updatedArts.image
            }
        }
        const result = await addCraftCollection.updateOne(filter, addCraft, options);
        res.send(result);
    })

    app.delete('/addCraft/:id', async(req, res) =>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await addCraftCollection.deleteOne(query);
        res.send(result);
    })


    app.get('/craftItem', async(req, res) =>{
        const cursor =await craftItemCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.post('/craftItem', async(req, res) =>{
        const newCraft = req.body;
        const result = await craftItemCollection.insertOne(newCraft);
        res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Textile Arts server making is running')
})

app.listen(port, () => {
  console.log(`Textile server is running on port ${port}`)
})