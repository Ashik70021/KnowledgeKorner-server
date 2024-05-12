const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
require('dotenv').config()
const port = process.env.PORT || 9000
const app = express()

const corsOptions = {
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
    ],
    credentials: true,
    optionSuccessStatus: 200,
}
app.use(cors(corsOptions))
app.use(express.json())

// MongoDB connection

const uri = `mongodb+srv://${process.env.DB_ID}:${process.env.DB_PASS}@cluster0.tpk7gxo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const blogsCollection = client.db('KnowledgeKorner').collection('blogs')
        const commentsCollection = client.db('KnowledgeKorner').collection('comments')
         
        // Get all blogs data from db
        app.get('/blogs', async (req, res) =>{
            const result = await blogsCollection.find().toArray()
            res.send(result)
        })

        // Get single blog data by id
        app.get('/blog/:id', async (req, res) =>{
            const id = req.params.id
            const query = {_id: new ObjectId(id)}
            const result = await blogsCollection.findOne(query)
            res.send(result)
        })

        // post blog by author
        app.post('/blog', async (req, res) =>{
            const blogData = req.body
            const result = await blogsCollection.insertOne(blogData)

            res.send(result)
        })
        // post comment by user
        app.post('/comment', async (req, res) =>{
            const comment = req.body
            const result = await commentsCollection.insertOne(comment)

            res.send(result)
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

    }
    finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello from Knowledge Korner Server')
})

app.listen(port, () =>
    console.log(`Server running on port ${port}`)
)

