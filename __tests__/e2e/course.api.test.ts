import request from 'supertest'
import {app, HTTP_STATUSES} from "../../src";
import e from "express";

describe('/course', () => {
    beforeAll(async () => {
        await request(app).delete('/__test___/data')
    })
    it('should return 200 and empty array', async () => {
        await request(app).get('/courses')
            .expect(HTTP_STATUSES.OK_200, [])
    });
    it('should return 404 for not existing course', async () => {
        await request(app).get('/courses/1')
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    });
    it(`shouldn't create course with incorrect input data`, async () => {
        await request(app).post('/courses').send({title: ''})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app).get('/courses')
            .expect(HTTP_STATUSES.OK_200, [])
    })
    let createdCourse1: { id: number, title: string };
    it(`should create course with correct input data`, async () => {
        const createResponse = await request(app).post('/courses').send({title: 'new title'})
            .expect(HTTP_STATUSES.CREATED_201)
        createdCourse1 = createResponse.body
        expect(createdCourse1).toEqual({id: expect.any(Number), title: 'new title'})

        await request(app).get('/courses')
            .expect(HTTP_STATUSES.OK_200, [createdCourse1])
    })
    let createdCourse2: { id: number, title: string };
    it(`should create one more course with correct input data`, async () => {
        const createResponse = await request(app).post('/courses').send({title: 'new title2'})
            .expect(HTTP_STATUSES.CREATED_201)
        createdCourse2 = createResponse.body
        expect(createdCourse2).toEqual({id: expect.any(Number), title: 'new title2'})

        await request(app).get('/courses')
            .expect(HTTP_STATUSES.OK_200, [createdCourse1, createdCourse2])
    })
    it(`shouldn't update course with incorrect input data`, async () => {
        await request(app).put(`/courses/${createdCourse1.id}`).send({title: ''})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)
        await request(app).get(`/courses/${createdCourse1.id}`)
            .expect(HTTP_STATUSES.OK_200, createdCourse1)

    })
    it(`shouldn't update  course that doesn't exist`, async () => {
        await request(app).put(`/courses/0`).send({title: 'title'})
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })
    it(`should update course with correct input data`, async () => {
        await request(app).put(`/courses/${createdCourse1.id}`).send({title: 'new good title'})
            .expect(HTTP_STATUSES.NO_CONTENT_204)

         await request(app).get(`/courses/${createdCourse1.id}`)
            .expect(HTTP_STATUSES.OK_200, {...createdCourse1, title: 'new good title'})

        await request(app).get(`/courses/${createdCourse2.id}`)
            .expect(HTTP_STATUSES.OK_200, createdCourse2)
    })

    it(`should delete both courses`, async () => {

        await request(app).delete(`/courses/${createdCourse1.id}`)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app).get(`/courses/${createdCourse1.id}`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        await request(app).delete(`/courses/${createdCourse2.id}`)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app).get(`/courses/${createdCourse2.id}`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        await request(app).get('/courses')
            .expect(HTTP_STATUSES.OK_200, [])
    })

})
