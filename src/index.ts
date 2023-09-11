import express, {Request, Response} from 'express'
import {db} from "./db/db";
import {productsRouter} from "./routes/products.router";
import {addressesRouter} from "./routes/addresses.router";
import {coursesRouter} from "./routes/courses.router";
import {usersRouter} from "./routes/users.router";
import {videosRouter} from "./routes/videos.router";

export const app = express()
const port = 3000


export const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,

    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404
}
export const RoutePaths = {
    prefix: '/api',
    products: '/products',
    addresses: '/addresses',
    courses: '/courses',
    users: '/users',
    videos: '/videos',
    __test__: '/testing/all-data'
}
app.use(express.json())


app.get('/', (req: Request, res: Response) => {
    let string =
        '<p>Hello World!</p>'
    res.send(string)
})
app.use(RoutePaths.prefix + RoutePaths.products, productsRouter)
app.use(RoutePaths.prefix + RoutePaths.addresses, addressesRouter)
app.use(RoutePaths.prefix + RoutePaths.courses, coursesRouter)
app.use(RoutePaths.prefix + RoutePaths.users, usersRouter)
app.use(RoutePaths.prefix + RoutePaths.videos, videosRouter)






app.delete(RoutePaths.prefix + RoutePaths.__test__, (req: Request, res: Response) => {
    db.courses = [];
    db.videos = [];
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
