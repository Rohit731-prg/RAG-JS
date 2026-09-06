import express from 'express';
import "dotenv/config.js";
import router from './Router/pdf-readerRouter.js';
import { connectPinecone } from './Config/ConnectDB.js';

const app = express();
const port = 3000

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, World!');
});


app.use("/api/pdf-note", router)

await connectPinecone()
app.listen(port, () => {{
    console.log("Server is on port: ", port);
}});