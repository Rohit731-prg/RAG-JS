import { app } from "./index.js"

export const startServer = (port) => {
    app.listen(port, () => {
        console.log("Server is on port no: ", port);
    })
}