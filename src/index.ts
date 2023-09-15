import { startApp} from "./app";
const app = startApp()
const port = 3000

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
