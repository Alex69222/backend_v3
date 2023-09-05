import express, {Request, Response} from 'express'
const app = express()
const port = 3000

app.get('/', (req: Request, res: Response) => {
    let string =
        '<p>Hello Best Backend developer Ever!</p>' +
        '<p>You can do it! Just do it!</p>' +
        '<p>Simple as it is!</p>'
        '<p>You know you can do it!</p>'
    res.send(string)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
