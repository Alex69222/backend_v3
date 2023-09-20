import {HTTP_STATUSES, HttpStatus, RoutePaths, startApp} from "../../src/app";
import request from "supertest";
import {CreateCourseModel} from "../../src/features/courses/models/CreateCourseModel";


export const coursesTestManager = {
    async createCourse(data: CreateCourseModel, expectedStatusCode: HttpStatus = HTTP_STATUSES.CREATED_201) {
        const response = await request(startApp()).post(RoutePaths.courses).send(data)
            .expect(expectedStatusCode)

        let createdEntity;
        if (expectedStatusCode === HTTP_STATUSES.CREATED_201) {
            createdEntity = response.body;
            expect(createdEntity).toEqual({
                id: expect.any(Number),
                title: data.title,
                usersCount: 0
            })
        }

        return {response, createdEntity}
    }
}
