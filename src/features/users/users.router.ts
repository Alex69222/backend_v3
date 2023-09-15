import {Request, Response, Router} from "express";
import {db} from "../../db/db";
import {HTTP_STATUSES} from "../../app";

export const usersRouter = Router({})

usersRouter.get('/', (req:Request, res: Response) =>{
    let foundUsers = db.users
    if(req.query.userName){
        foundUsers = foundUsers.filter(c => c.userName.indexOf(req.query.userName as string) > -1)
    }
    res.json(foundUsers)
})
usersRouter.get('/:id', (req:Request, res: Response) =>{
    let foundUser = db.users.find(c => c.id === +req.params.id)
    if(!foundUser) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    res.send(foundUser)
})
usersRouter.post('/', (req: Request, res: Response) => {
    if(!req.body.userName) return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)

    const createdUser = {
        id: +(new Date()),
        userName: req.body.userName,
    }

    db.users.push(createdUser)
    res.status(201).send(createdUser)
})
usersRouter.put('/:id', (req:Request, res: Response) =>{
    let foundUser = db.users.find(c => c.id === +req.params.id)
    if(!req.body.userName) return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    if(!foundUser) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    foundUser.userName = req.body.userName;
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})
usersRouter.delete('/:id', (req:Request, res: Response) =>{
    for (let i = 0; i < db.users.length; i++) {
        if (db.users[i].id === +req.params.id) {
            db.users.splice(i, 1)
            return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        }
    }
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
})
