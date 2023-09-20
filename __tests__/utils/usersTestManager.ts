import {HTTP_STATUSES, HttpStatus, RoutePaths, startApp} from "../../src/app";
import request from "supertest";
import {CreateUserModel} from "../../src/features/users/models/CreateUserModel";


export const usersTestManager = {
    async createUser(data: CreateUserModel, expectedStatusCode: HttpStatus = HTTP_STATUSES.CREATED_201) {
        const response = await request(startApp()).post(RoutePaths.users).send(data)
            .expect(expectedStatusCode)

        let createdEntity;
        if (expectedStatusCode === HTTP_STATUSES.CREATED_201) {
            createdEntity = response.body;
            expect(createdEntity).toEqual({
                id: expect.any(Number),
                userName: data.userName
            })
        }

        return {response, createdEntity}
    }
}
