import request from 'supertest'
import {HTTP_STATUSES, RoutePaths, startApp} from "../../src/app";
import {CourseType} from "../../src/db/db";
import {CreateCourseModel} from "../../src/features/courses/models/CreateCourseModel";
import {coursesTestManager} from "../utils/coursesTestManager";

const getRequest = () => request(startApp())
describe('/course', () => {
    beforeAll(async () => {
        await getRequest().delete(RoutePaths.__test__)
    })
    it('should return 200 and empty array', async () => {
        await getRequest().get(RoutePaths.courses)
            .expect(HTTP_STATUSES.OK_200, [])
    });
    it('should return 404 for not existing entity', async () => {
        await getRequest().get(`${RoutePaths.courses}/1`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    });
    it(`shouldn't create course with incorrect input data`, async () => {
        await coursesTestManager.createCourse({title: ''}, HTTP_STATUSES.BAD_REQUEST_400)

        await getRequest().get(RoutePaths.courses)
            .expect(HTTP_STATUSES.OK_200, [])
    })
    let createdCourse1: CourseType;
    it(`should create course with correct input data`, async () => {
        const data: CreateCourseModel = {title: 'new title'};
        const {createdEntity} = await coursesTestManager.createCourse(data, HTTP_STATUSES.CREATED_201)
        createdCourse1 = createdEntity
        expect(createdCourse1).toEqual({id: expect.any(Number), title: data.title, usersCount: 0})

        await getRequest().get(RoutePaths.courses)
            .expect(HTTP_STATUSES.OK_200, [createdCourse1])
    })
    let createdCourse2: CourseType;
    it(`should create one more course with correct input data`, async () => {
        const data: CreateCourseModel = {title: 'new title2'};
        const {createdEntity} = await coursesTestManager.createCourse(data, HTTP_STATUSES.CREATED_201)
        createdCourse2 = createdEntity
        expect(createdCourse2).toEqual({id: expect.any(Number), title: data.title, usersCount: 0})

        await getRequest().get(RoutePaths.courses)
            .expect(HTTP_STATUSES.OK_200, [createdCourse1, createdCourse2])
    })
    it(`shouldn't update course with incorrect input data`, async () => {
        await getRequest().put(`${RoutePaths.courses}/${createdCourse1.id}`).send({title: ''})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)
        await getRequest().get(`${RoutePaths.courses}/${createdCourse1.id}`)
            .expect(HTTP_STATUSES.OK_200, createdCourse1)

    })
    it(`shouldn't update  course that doesn't exist`, async () => {
        await getRequest().put(`${RoutePaths.courses}/0`).send({title: 'title'})
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })
    it(`should update course with correct input data`, async () => {
        await getRequest().put(`${RoutePaths.courses}/${createdCourse1.id}`).send({title: 'new good title'})
            .expect(HTTP_STATUSES.NO_CONTENT_204)

         await getRequest().get(`${RoutePaths.courses}/${createdCourse1.id}`)
            .expect(HTTP_STATUSES.OK_200, {...createdCourse1, title: 'new good title'})

        await getRequest().get(`${RoutePaths.courses}/${createdCourse2.id}`)
            .expect(HTTP_STATUSES.OK_200, createdCourse2)
    })

    it(`should delete both courses`, async () => {

        await getRequest().delete(`${RoutePaths.courses}/${createdCourse1.id}`)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await getRequest().get(`${RoutePaths.courses}/${createdCourse1.id}`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        await getRequest().delete(`${RoutePaths.courses}/${createdCourse2.id}`)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await getRequest().get(`${RoutePaths.courses}/${createdCourse2.id}`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        await getRequest().get(RoutePaths.courses)
            .expect(HTTP_STATUSES.OK_200, [])
    })

})
