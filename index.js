const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", async (req, res) => {
  res.send("Server is running");
});

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.t9lecvs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // api
    const passwordCollection = client.db("passwordDB").collection("passwords");
   
     // show datas  by specific user using query
    app.get("/password", async (req, res) => {
       
       console.log(req.query)
        
         let query = {}
         if(req.query?.email)
         {
            query = {email:req.query.email}
         }

      const cursor = passwordCollection.find(query);
      const result = await cursor.toArray();

      res.send(result);
    });
    app.post("/password", async (req, res) => {

      const user = req.body;
      const result = await passwordCollection.insertOne(user);

      res.send(result);
    });

    //Edit password
    app.get("/password/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: new ObjectId(id) };

      const result = await passwordCollection.findOne(query);

      res.send(result);
    });

     app.put("/password/:id",async(req,res)=>{

        const id = req.params.id;

          const data= req.body
            
          
        const filter = {_id:new ObjectId(id)}

        const options = {upsert:true};

        const datas= {

                $set:{
                   
                   email: data.email,
                   site : data.site,
                   username : data.username,
                   password : data.password,


                    
                }
        }

        const result = await passwordCollection.updateOne(filter,datas,options)
             
          res.send(result)
     })

     // Delete password

     app.delete("/password/:id",async(req,res)=>{


     
           const id = req.params.id;

           const query = {_id:new ObjectId(id)}

            const result = await passwordCollection.deleteOne(query)




     })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`password manager running with backend server ${port}`);
});
