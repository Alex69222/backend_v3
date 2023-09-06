import express, {Request, Response} from 'express'

export const app = express()
const port = 3000

let products = [{id: 1, title: 'tomato'}, {id: 2, title: 'orange'}]
let addresses = [{id: 1, value: 'Gorgiladze 14'}, {id: 2, title: 'Chaikovskogo 191'}]
export const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,

    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404
}
const db = {
    courses: [
        {id: 1, title: 'front-end'},
        {id: 1, title: 'back-end'},
        {id: 1, title: 'automation qa'},
        {id: 1, title: 'devops'},
    ]
}
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
    res.status(HTTP_STATUSES.CREATED_201).send(newProduct)
})
app.put('/products/:id', (req: Request, res: Response) => {
    const product = products.find(p => p.id === +req.params.id)
    if (!product) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    product.title = req.body.title;
    res.send(product)
})
app.delete('/products/:id', (req: Request, res: Response) => {

    for (let i = 0; i < products.length; i++) {
        if (products[i].id === +req.params.id) {
            products.splice(i, 1)
            return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        }
    }
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
})
app.get('/addresses', (req: Request, res: Response) => {
    res.send(addresses)
})
app.get('/addresses/:id', (req: Request, res: Response) => {
    const address = addresses.find(a => a.id === +req.params.id)
    if (!address) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    res.send(address)
})


app.get('/courses', (req:Request, res: Response) =>{
    let foundCourses = db.courses
    if(req.query.title){
        foundCourses = foundCourses.filter(c => c.title.indexOf(req.query.title as string) > -1)
    }
    res.json(foundCourses)
})
app.get('/courses/:id', (req:Request, res: Response) =>{
    let foundCourse = db.courses.find(c => c.id === +req.params.id)
    if(!foundCourse) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    res.send(foundCourse)
})
app.post('/courses', (req: Request, res: Response) => {
    if(!req.body.title) return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)

    const createdCourse = {
        id: +(new Date()),
        title: req.body.title
    }

    db.courses.push(createdCourse)
    res.status(201).send(createdCourse)
})
app.put('/courses/:id', (req:Request, res: Response) =>{
    let foundCourse = db.courses.find(c => c.id === +req.params.id)
    if(!req.body.title) return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    if(!foundCourse) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    foundCourse.title = req.body.title;
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})
app.delete('/courses/:id', (req:Request, res: Response) =>{
    for (let i = 0; i < db.courses.length; i++) {
        if (db.courses[i].id === +req.params.id) {
            db.courses.splice(i, 1)
            return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        }
    }
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
})


app.delete('/__test___/data', (req: Request, res: Response) => {
    db.courses = [];
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
