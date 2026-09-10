import { app } from "./index.js"

const port = process.env.PORT || 8000

export const start_server = () => {
    app.listen(port, () => {
        console.log("Server is running on port no: ", port);
    })
}