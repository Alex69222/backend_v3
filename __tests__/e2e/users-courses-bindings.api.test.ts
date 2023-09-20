import request from 'supertest'
import {HTTP_STATUSES, RoutePaths, startApp} from "../../src/app";
import {CreateUserCourseBindingModel} from "../../src/features/user-course-binding/models/CreateUserCourseBindingModel";
import {usersCoursesBindingTestManager} from "../utils/usersCoursesBindingTestManager";
import {usersTestManager} from "../utils/usersTestManager";
import {coursesTestManager} from "../utils/coursesTestManager";

const getRequest = () => request(startApp())
describe('tests for /users-courses-bindings', () => {
    beforeAll(async () => {
        await getRequest().delete(RoutePaths.__test__)
    })


    it(`should create entity with correct input data`, async () => {
        const {createdEntity: user} = await usersTestManager.createUser({userName: 'Alex'})
        const {createdEntity: course} = await coursesTestManager.createCourse({title: 'Backend v3.0'})
        const data: CreateUserCourseBindingModel = {userId: user.id, courseId: course.id}
        await usersCoursesBindingTestManager.createBinding(data)
        // await getRequest().get(RoutePaths.users)
        //     .expect(HTTP_STATUSES.OK_200, [])
    })

    it(`shouldn't create courseBinding because it already exists`, async () => {
        const {createdEntity: user} = await usersTestManager.createUser({userName: 'Alex'})
        const {createdEntity: course} = await coursesTestManager.createCourse({title: 'Backend v3.0'})
        const data: CreateUserCourseBindingModel = {userId: user.id, courseId: course.id}
        await usersCoursesBindingTestManager.createBinding(data)
        await usersCoursesBindingTestManager.createBinding(data, HTTP_STATUSES.BAD_REQUEST_400)
        // await getRequest().get(RoutePaths.users)
        //     .expect(HTTP_STATUSES.OK_200, [])
    })

})
