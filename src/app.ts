import express, {Request, Response} from 'express'
import {db} from "./db/db";

import {productsRouter} from "./routes/products.router";
import {addressesRouter} from "./routes/addresses.router";
import {coursesRouter} from "./features/courses/courses.router";
import {usersRouter} from "./features/users/users.router";
import {videosRouter} from "./features/videos/videos.router";
import {usersCoursesBindingsRouter} from "./features/user-course-binding/users-courses-bindings.router";
import {blogsRepository} from "./repositories/blogs-repository";
import {blogsRouter} from "./features/blogs/blogs.router";

export const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,

    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404
}
type  HttpStatusKeys = keyof typeof HTTP_STATUSES
export type HttpStatus = (typeof HTTP_STATUSES)[HttpStatusKeys]
const routePrefix = '/api'
export const RoutePaths = {
    products: `${routePrefix}/products`,
    addresses: `${routePrefix}/addresses`,
    courses: `${routePrefix}/courses`,
    users: `${routePrefix}/users`,
    usersCoursesBindings: `${routePrefix}/users-courses-bindings`,
    videos: `${routePrefix}/videos`,
    blogs: `${routePrefix}/blogs`,
    posts: `${routePrefix}/posts`,
    __test__: `${routePrefix}/testing/all-data`
}
export const startApp = () => {
    const app = express()


    app.use(express.json())


    app.get('/', (req: Request, res: Response) => {
        let string =
            '<p>Hello World!</p>'
        res.send(string)
    })
    app.use(RoutePaths.products, productsRouter)
    app.use(RoutePaths.addresses, addressesRouter)
    app.use(RoutePaths.courses, coursesRouter)
    app.use(RoutePaths.users, usersRouter)
    app.use(RoutePaths.videos, videosRouter)
    app.use(RoutePaths.usersCoursesBindings, usersCoursesBindingsRouter)
    app.use(RoutePaths.blogs, blogsRouter)


    app.delete(RoutePaths.__test__, async (req: Request, res: Response) => {
        db.courses = [];
        db.videos = [];
        db.users = [];
        await blogsRepository.testDelete()
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })

    return app;
}






