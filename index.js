import {serve} from "@hono/node-server";
import {app} from './src/app.js'

serve(app, (info) => {
    console.log(
        `App started on http://localhost:${info.port}`
    )
})