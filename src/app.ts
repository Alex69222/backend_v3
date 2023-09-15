
import express, {Request, Response} from 'express'
import {db} from "./db/db";

import {productsRouter} from "./routes/products.router";
import {addressesRouter} from "./routes/addresses.router";
import {coursesRouter} from "./routes/courses.router";
import {usersRouter} from "./features/users/users.router";
import {videosRouter} from "./features/videos/videos.router";

export const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,

    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404
}
const routePrefix = '/api'
export const RoutePaths = {
    products: `${routePrefix}/products`,
    addresses: `${routePrefix}/addresses`,
    courses: `${routePrefix}/courses`,
    users: `${routePrefix}/users`,
    videos: `${routePrefix}/videos`,
    __test__: `${routePrefix}/testing/all-data`
}
export  const  startApp = () => {
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






    app.delete(RoutePaths.__test__, (req: Request, res: Response) => {
        db.courses = [];
        db.videos = [];
        db.users = [];
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })

    return app;
}






