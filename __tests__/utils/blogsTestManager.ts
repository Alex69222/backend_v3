import {CreateBlogType} from "../../src/features/blogs/models/CreateBlogType";
import {HTTP_STATUSES, HttpStatus, RoutePaths, startApp} from "../../src/app";
import request from "supertest";

export const blogsTestManager = {
    async createBlog(data: CreateBlogType, expectedStatusCode: HttpStatus = HTTP_STATUSES.CREATED_201){
        const response = await request(startApp()).post(RoutePaths.blogs).send(data)
            .expect(expectedStatusCode)
        let createdEntity;
        if (expectedStatusCode === HTTP_STATUSES.CREATED_201) {
            createdEntity = response.body;
            expect(createdEntity).toEqual({
                id: expect.any(String),
                name: data.name,
                description: data.description,
                websiteUrl: data.websiteUrl
            })
        }
        return {response, createdEntity}
    },
    async getBlogs(expectedStatusCode: HttpStatus = HTTP_STATUSES.OK_200){
        const response = await request(startApp()).get(RoutePaths.blogs)
            .expect(expectedStatusCode)
        const blogs = response.body
        return blogs
    },
    async getBlogById(id: string, expectedStatusCode: HttpStatus = HTTP_STATUSES.OK_200){
        const response = await request(startApp()).get(RoutePaths.blogs + '/' + id)
            .expect(expectedStatusCode)
        let requestedEntity;
        if (expectedStatusCode === HTTP_STATUSES.OK_200) {
            requestedEntity = response.body;
            expect(requestedEntity).toEqual({
                id: expect.any(String),
                name: expect.any(String),
                description: expect.any(String),
                websiteUrl: expect.any(String)
            })
        }
        return {response, requestedEntity}
    }
}
