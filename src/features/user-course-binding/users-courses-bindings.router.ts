import {Request, Response, Router} from "express";
import {UserCourseBindingViewModel} from "./models/UserCourseBindingViewModel";
import {HTTP_STATUSES} from "../../app";
import {CourseType, db, UserCourseBinding, UserType} from "../../db/db";

export const usersCoursesBindingsRouter = Router({})
const courseBindingViewModel = (courseBinding: UserCourseBinding, user: UserType, course: CourseType): UserCourseBindingViewModel => {
    const {date, ...rest} = courseBinding
    return {
        ...rest,
        userName: user.userName,
        courseTitle: course.title
    }
}
usersCoursesBindingsRouter.post('/', (req: Request, res: Response): UserCourseBindingViewModel | Response => {
    if(!req.body.userId || !req.body.courseId) return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);

    const user = db.users.find( (u:UserType) => u.id === req.body.userId);
    if(!user) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);

    const course = db.courses.find((c: CourseType) => c.id === req.body.courseId)
    if(!course) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);

    const existingBinding = db
        .userCourseBindings
        .find((b: UserCourseBinding) => b.courseId === req.body.courseId && b.userId === req.body.userId)

    if(existingBinding) return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)

    const createdEntity: UserCourseBinding = {
        userId: req.body.userId,
        courseId: req.body.courseId,
        date: new Date(),
    }
    db.userCourseBindings.push(createdEntity)
    return res.status(HTTP_STATUSES.CREATED_201).send(courseBindingViewModel(createdEntity, user, course))
})
