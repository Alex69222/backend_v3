import {Request, Response, Router} from "express";
import {blogsRepository} from "../../repositories/blogs-repository";
import {HTTP_STATUSES} from "../../app";

export const blogsRouter = Router({});
blogsRouter.get('/', async (req: Request, res: Response) => {
    const blogs = await blogsRepository.getBlogs();
    res.send(blogs)
})

blogsRouter.post('/', async (req: Request, res: Response) => {
    const newBlog = await blogsRepository.createBlog({
        name: req.body.name,
        description: req.body.description,
        websiteUrl: req.body.websiteUrl
    })
    res.status(HTTP_STATUSES.CREATED_201).send(newBlog)
})

blogsRouter.get('/:id', async (req: Request, res: Response) => {
    const blog = await blogsRepository.getBlogById(req.params.id)
    if(!blog) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    res.send(blog)
})
