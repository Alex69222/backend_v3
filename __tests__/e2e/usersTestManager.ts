import {HTTP_STATUSES, RoutePaths, startApp} from "../../src/app";
import request from "supertest";
import {CreateUserModel} from "../../src/features/users/models/CreateUserModel";

export const usersTestManager = {
    async  createUser (data: CreateUserModel){
    const response = await request(startApp()).post(RoutePaths.users).send(data)
        .expect(HTTP_STATUSES.CREATED_201)
        return response
    }
}
