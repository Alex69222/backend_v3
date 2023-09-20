import {CreateUserCourseBindingModel} from "../../src/features/user-course-binding/models/CreateUserCourseBindingModel";
import {HTTP_STATUSES, HttpStatus, RoutePaths, startApp} from "../../src/app";
import request from "supertest";

export const usersCoursesBindingTestManager = {
    async createBinding(data: CreateUserCourseBindingModel, expectedStatusCode: HttpStatus = HTTP_STATUSES.CREATED_201){

        const response = await request(startApp()).post(RoutePaths.usersCoursesBindings).send(data)
            .expect(expectedStatusCode)

        let createdEntity;
        if (expectedStatusCode === HTTP_STATUSES.CREATED_201) {
            createdEntity = response.body;
            expect(createdEntity).toEqual({
                userId: data.userId,
                courseId: data.courseId,
                courseTitle: expect.any(String),
                userName: expect.any(String),
            })
        }

        return {response, createdEntity}
    }
}
