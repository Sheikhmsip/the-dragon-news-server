const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://The_Dragon_NewsPepar:CF9i1gmPHCjr2Mso@cluster0.vvvwsgj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const newsCollection = client.db("The_Dragon_NewsPaper").collection("news");

    app.get("/news", async (req, res) => {
      const news = newsCollection.find();
      const result = await news.toArray();
      res.send(result);
    });

    app.get("/news/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      try {
        const query = { _id: new ObjectId(id) };
        console.log(query);
        const result = await newsCollection.findOne(query);

        if (!result) {
          return res.status(404).send({ message: "News not found" });
        }

        res.send(result);
      } catch (err) {
        console.error("Error fetching news by ID:", err);
        res.status(500).send({ message: "Internal Server Error", error: err });
      }
    });

    // app.get("/editNews/:id", async (req, res) => {
    //   const id = req.params.id;
    //   // console.log(id);
    //   try {
    //     const query = { _id: new ObjectId(id) };
    //     console.log(query);
    //     const result = await newsCollection.findOne(query);

    //     if (!result) {
    //       return res.status(404).send({ message: "News not found" });
    //     }

    //     res.send(result);
    //   } catch (err) {
    //     console.error("Error fetching news by ID:", err);
    //     res.status(500).send({ message: "Internal Server Error", error: err });
    //   }
    // });

    app.post("/news", async (req, res) => {
      const newses = req.body;
      const result = await newsCollection.insertOne(newses);
      res.send(result);
    });
    
    app.delete("/news/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await newsCollection.deleteOne(query);
      res.send(result);
    });

    app.put("/news/:id", async(req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = {upsert: true};
      const editNews= req.body;
      const news = {
        $set: {
          title: editNews.title,
          details: editNews.details,
          image_url: editNews.image_url
        }
      }
      const result = await newsCollection.updateOne(filter, news, options);
      res.send(result)
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


app.get("/", (req, res) => {
  res.send("News is running");
});

app.listen(port, () => {
  console.log(`News server is running on port ${port}`);
});
