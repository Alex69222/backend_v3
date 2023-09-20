import request from "supertest";
import {HTTP_STATUSES, RoutePaths, startApp} from "../../src/app";
import {blogsTestManager} from "../utils/blogsTestManager";
import {CreateBlogType} from "../../src/features/blogs/models/CreateBlogType";
import {BlogType} from "../../src/features/blogs/models/BlogType";

describe('tests for /blogs', () => {
    beforeAll(async () => {
        await request(startApp()).delete(RoutePaths.__test__)
    })
    let createdBlog1: BlogType;

    describe('get blogs', () => {
        it('should return 200 and empty array', async () => {
            const blogs = await blogsTestManager.getBlogs()
            expect(blogs).toEqual([])
        })
    })
    describe('create blog', () => {
        it('should create new blog', async () => {
            const data: CreateBlogType = {
                name: 'Best backend course',
                description: 'Description of backend course',
                websiteUrl: 'best-backend.com'
            }
            const {createdEntity} = await blogsTestManager.createBlog(data, HTTP_STATUSES.CREATED_201)
            createdBlog1 = createdEntity
            await request(startApp()).get(RoutePaths.blogs)
                .expect(HTTP_STATUSES.OK_200, [createdBlog1])
        })
    })
    describe('get blog by id', () => {
        it('should return 404 when blog with id does not exist', async () => {
            await blogsTestManager.getBlogById('0', HTTP_STATUSES.NOT_FOUND_404)
        })
        it('should return blog by id', async () => {
            const {requestedEntity} = await blogsTestManager.getBlogById(createdBlog1.id)
            expect(requestedEntity).toEqual(createdBlog1)
        })
    })
})
