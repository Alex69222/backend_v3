import request from 'supertest'
import {HTTP_STATUSES, RoutePaths, startApp} from "../../src/app";
import {usersTestManager} from "../utils/usersTestManager";
import {CreateUserModel} from "../../src/features/users/models/CreateUserModel";

const getRequest = () => request(startApp())
describe('tests for /users', () => {
    beforeAll(async () => {
        await getRequest().delete(RoutePaths.__test__)
    })
    it('should return 200 and empty array', async () => {
        await getRequest().get(RoutePaths.users)
            .expect(HTTP_STATUSES.OK_200, [])
    });
    it('should return 404 for not existing entity', async () => {
        await getRequest().get(`${RoutePaths.users}/1`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    });
    it(`shouldn't create entity with incorrect input data`, async () => {
        await usersTestManager.createUser({userName: ''}, HTTP_STATUSES.BAD_REQUEST_400)
        await getRequest().get(RoutePaths.users)
            .expect(HTTP_STATUSES.OK_200, [])
    })
    let createdEntity1: { id: number, userName: string };
    it(`should create entity with correct input data`, async () => {
        const data: CreateUserModel = {userName: 'new user'}
        const {response, createdEntity} = await usersTestManager.createUser(data, HTTP_STATUSES.CREATED_201)
        createdEntity1 = createdEntity

        await getRequest().get(RoutePaths.users)
            .expect(HTTP_STATUSES.OK_200, [createdEntity1])
    })
    let createdEntity2: { id: number, userName: string };
    it(`should create one more entity with correct input data`, async () => {
        const data2: CreateUserModel = { userName: 'new user2'}
        const {response, createdEntity} = await  usersTestManager.createUser(data2)
        createdEntity2 = createdEntity

        await getRequest().get(RoutePaths.users)
            .expect(HTTP_STATUSES.OK_200, [createdEntity1, createdEntity2])
    })
    it(`shouldn't update entity with incorrect input data`, async () => {
        await getRequest().put(`${RoutePaths.users}/${createdEntity1.id}`).send({userName: ''})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)
        await getRequest().get(`${RoutePaths.users}/${createdEntity1.id}`)
            .expect(HTTP_STATUSES.OK_200, createdEntity1)

    })
    it(`shouldn't update  entity that doesn't exist`, async () => {
        await getRequest().put(`${RoutePaths.users}/0`).send({userName: 'title'})
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })
    it(`should update entity with correct input data`, async () => {
        await getRequest().put(`${RoutePaths.users}/${createdEntity1.id}`).send({userName: 'new good user'})
            .expect(HTTP_STATUSES.NO_CONTENT_204)

         await getRequest().get(`${RoutePaths.users}/${createdEntity1.id}`)
            .expect(HTTP_STATUSES.OK_200, {...createdEntity1, userName: 'new good user'})

        await getRequest().get(`${RoutePaths.users}/${createdEntity2.id}`)
            .expect(HTTP_STATUSES.OK_200, createdEntity2)
    })

    it(`should delete both entities`, async () => {

        await getRequest().delete(`${RoutePaths.users}/${createdEntity1.id}`)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await getRequest().get(`${RoutePaths.users}/${createdEntity1.id}`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        await getRequest().delete(`${RoutePaths.users}/${createdEntity2.id}`)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await getRequest().get(`${RoutePaths.users}/${createdEntity2.id}`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        await getRequest().get(RoutePaths.users)
            .expect(HTTP_STATUSES.OK_200, [])
    })

})
