import {Request, Response, Router} from "express";
import {HTTP_STATUSES} from "../app";
let products = [{id: 1, title: 'tomato'}, {id: 2, title: 'orange'}]

export const productsRouter = Router({})

productsRouter.get('/', (req: Request, res: Response) => {
    const queryTitle = req.query.title
    if (queryTitle && typeof queryTitle === "string") {
        const filteredProducts = products.filter(p => p.title.includes(queryTitle))
        if (!filteredProducts.length) return res.sendStatus(404)
        res.send(filteredProducts)
    } else {
        res.send(products)
    }
})
productsRouter.get('/:id', (req: Request, res: Response) => {
    const product = products.find(p => p.id === +req.params.id)
    if (!product) return res.sendStatus(404)
    res.send(product)
})
productsRouter.post('/', (req: Request, res: Response) => {
    const newProduct = {
        id: +(new Date),
        title: req.body.title
    }
    products.push(newProduct)
    res.status(HTTP_STATUSES.CREATED_201).send(newProduct)
})
productsRouter.put('/:id', (req: Request, res: Response) => {
    const product = products.find(p => p.id === +req.params.id)
    if (!product) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    product.title = req.body.title;
    res.send(product)
})
productsRouter.delete('/:id', (req: Request, res: Response) => {

    for (let i = 0; i < products.length; i++) {
        if (products[i].id === +req.params.id) {
            products.splice(i, 1)
            return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        }
    }
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
})
