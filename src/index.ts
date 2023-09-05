import express, {Request, Response} from 'express'

const app = express()
const port = 3000

let products = [{id: 1, title: 'tomato'}, {id: 2, title: 'orange'}]
let addresses = [{id: 1, value: 'Gorgiladze 14'}, {id: 2, title: 'Chaikovskogo 191'}]
app.use(express.json())
app.get('/', (req: Request, res: Response) => {
    let string =
        '<p>Hello Best Backend developer Ever!</p>' +
        '<p>You can do it! Just do it!</p>' +
        '<p>Simple as it is!</p>' +
        '<p>You know you can do it!</p>'
    res.send(string)
})
app.get('/products', (req: Request, res: Response) => {
    const queryTitle = req.query.title
    if (queryTitle && typeof queryTitle === "string") {
        const filteredProducts = products.filter(p => p.title.includes(queryTitle))
        if (!filteredProducts.length) return res.sendStatus(404)
        res.send(filteredProducts)
    } else {
        res.send(products)
    }
})
app.get('/products/:id', (req: Request, res: Response) => {
    const product = products.find(p => p.id === +req.params.id)
    if (!product) return res.sendStatus(404)
    res.send(product)
})

app.post('/products', (req: Request, res: Response) => {
    const newProduct = {
        id: +(new Date),
        title: req.body.title
    }
    products.push(newProduct)
    res.status(201).send(newProduct)
})
app.put('/products/:id', (req: Request, res: Response) => {
    const product = products.find(p => p.id === +req.params.id)
    if (!product) return res.sendStatus(404)
    product.title = req.body.title;
    res.send(product)
})
app.delete('/products/:id', (req: Request, res: Response) => {

    for (let i = 0; i < products.length; i++) {
        if (products[i].id === +req.params.id) {
            products.splice(i, 1)
            return res.sendStatus(204)
        }
    }
    res.sendStatus(404)
})
app.get('/addresses', (req: Request, res: Response) => {
    res.send(addresses)
})
app.get('/addresses/:id', (req: Request, res: Response) => {
    const address = addresses.find(a => a.id === +req.params.id)
    if (!address) return res.sendStatus(404)
    res.send(address)
})
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
