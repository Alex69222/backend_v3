import request from 'supertest'
import {app, HTTP_STATUSES} from "../../src";
import e from "express";

const getRequest = () => request(app)
describe('tests for /users', () => {
    beforeAll(async () => {
        await getRequest().delete('/__test___/data')
    })
    it('should return 200 and empty array', async () => {
        await getRequest().get('/courses')
            .expect(HTTP_STATUSES.OK_200, [])
    });
    it('should return 404 for not existing course', async () => {
        await getRequest().get('/courses/1')
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    });
    it(`shouldn't create course with incorrect input data`, async () => {
        await getRequest().post('/courses').send({title: ''})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await getRequest().get('/courses')
            .expect(HTTP_STATUSES.OK_200, [])
    })
    let createdCourse1: { id: number, title: string };
    it(`should create course with correct input data`, async () => {
        const createResponse = await getRequest().post('/courses').send({title: 'new title'})
            .expect(HTTP_STATUSES.CREATED_201)
        createdCourse1 = createResponse.body
        expect(createdCourse1).toEqual({id: expect.any(Number), title: 'new title', studentsCount: 0})

        await getRequest().get('/courses')
            .expect(HTTP_STATUSES.OK_200, [createdCourse1])
    })
    let createdCourse2: { id: number, title: string };
    it(`should create one more course with correct input data`, async () => {
        const createResponse = await getRequest().post('/courses').send({title: 'new title2'})
            .expect(HTTP_STATUSES.CREATED_201)
        createdCourse2 = createResponse.body
        expect(createdCourse2).toEqual({id: expect.any(Number), title: 'new title2', studentsCount: 0})

        await getRequest().get('/courses')
            .expect(HTTP_STATUSES.OK_200, [createdCourse1, createdCourse2])
    })
    it(`shouldn't update course with incorrect input data`, async () => {
        await getRequest().put(`/courses/${createdCourse1.id}`).send({title: ''})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)
        await getRequest().get(`/courses/${createdCourse1.id}`)
            .expect(HTTP_STATUSES.OK_200, createdCourse1)

    })
    it(`shouldn't update  course that doesn't exist`, async () => {
        await getRequest().put(`/courses/0`).send({title: 'title'})
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })
    it(`should update course with correct input data`, async () => {
        await getRequest().put(`/courses/${createdCourse1.id}`).send({title: 'new good title'})
            .expect(HTTP_STATUSES.NO_CONTENT_204)

         await getRequest().get(`/courses/${createdCourse1.id}`)
            .expect(HTTP_STATUSES.OK_200, {...createdCourse1, title: 'new good title'})

        await getRequest().get(`/courses/${createdCourse2.id}`)
            .expect(HTTP_STATUSES.OK_200, createdCourse2)
    })

    it(`should delete both courses`, async () => {

        await getRequest().delete(`/courses/${createdCourse1.id}`)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await getRequest().get(`/courses/${createdCourse1.id}`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        await getRequest().delete(`/courses/${createdCourse2.id}`)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await getRequest().get(`/courses/${createdCourse2.id}`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        await getRequest().get('/courses')
            .expect(HTTP_STATUSES.OK_200, [])
    })

})
