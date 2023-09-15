import {Request, Response, Router} from "express";
import {HTTP_STATUSES} from "../app";
let addresses = [{id: 1, value: 'Gorgiladze 14'}, {id: 2, title: 'Chaikovskogo 191'}]
export const addressesRouter = Router({})

addressesRouter.get('/', (req: Request, res: Response) => {
    res.send(addresses)
})
addressesRouter.get('/:id', (req: Request, res: Response) => {
    const address = addresses.find(a => a.id === +req.params.id)
    if (!address) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    res.send(address)
})
