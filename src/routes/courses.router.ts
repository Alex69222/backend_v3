import {Request, Response, Router} from "express";
import {db} from "../db/db";
import {HTTP_STATUSES} from "../app";

export const coursesRouter = Router({})

coursesRouter.get('/', (req:Request, res: Response) =>{
    let foundCourses = db.courses
    if(req.query.title){
        foundCourses = foundCourses.filter(c => c.title.indexOf(req.query.title as string) > -1)
    }
    res.json(foundCourses)
})
coursesRouter.get('/:id', (req:Request, res: Response) =>{
    let foundCourse = db.courses.find(c => c.id === +req.params.id)
    if(!foundCourse) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    res.send(foundCourse)
})
coursesRouter.post('/', (req: Request, res: Response) => {
    if(!req.body.title) return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)

    const createdCourse = {
        id: +(new Date()),
        title: req.body.title,
        studentsCount: 0
    }

    db.courses.push(createdCourse)
    res.status(201).send(createdCourse)
})
coursesRouter.put('/:id', (req:Request, res: Response) =>{
    let foundCourse = db.courses.find(c => c.id === +req.params.id)
    if(!req.body.title) return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    if(!foundCourse) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    foundCourse.title = req.body.title;
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})
coursesRouter.delete('/:id', (req:Request, res: Response) =>{
    for (let i = 0; i < db.courses.length; i++) {
        if (db.courses[i].id === +req.params.id) {
            db.courses.splice(i, 1)
            return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        }
    }
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
})
