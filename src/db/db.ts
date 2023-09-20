export type UserType = {
    id: number,
    userName: string
}
export type CourseType = {
    id: number,
    title: string,
    usersCount: number
}
export type UserCourseBinding = {
    userId: number,
    courseId: number,
    date: Date
}
export enum VideoResolutions  {
    P144 = "P144",
    P240 = "P240",
    P360 = "P360",
    P480 = "P480",
    P720 = "P720",
    P1080 = "P1080",
    P1440 = "P1440",
    P2160 = "P2160"
}
export type VideoType = {
    id: number,
    title: string,
    author: string,
    canBeDownloaded?: boolean,
    minAgeRestriction?:  number | null,
    createdAt?: string,
    publicationDate?: string,
    availableResolutions?: VideoResolutions[] | null
}
export type DBType = {
    courses: CourseType[],
    users: UserType[],
    userCourseBindings: UserCourseBinding[],
    videos: VideoType[]
}
export const db: DBType = {
    courses: [
        {id: 1, title: 'front-end', usersCount: 10},
        {id: 2, title: 'back-end', usersCount: 10},
        {id: 3, title: 'automation qa', usersCount: 10},
        {id: 4, title: 'devops', usersCount: 10},
    ],
    users: [
        {id:1, userName: 'dimych'},
        {id:2, userName: 'ivan'}
    ],
    userCourseBindings: [
        { userId: 1, courseId: 1, date: new Date(2022, 10, 1)},
        { userId: 1, courseId: 2, date: new Date(2022, 10, 1)},
        { userId: 2, courseId: 2, date: new Date(2022, 10, 1)},
    ],
    videos: [
        {
            id: 1,
            title: 'Backend lesson 01',
            author: 'Dimych',
            availableResolutions: [VideoResolutions.P144, VideoResolutions.P2160, VideoResolutions.P1440, VideoResolutions.P1080],
            canBeDownloaded: true, createdAt: new Date(2023, 5,12).toISOString(),
            publicationDate: new Date(2023, 5,12).toISOString(),
            minAgeRestriction: null
        },
        {
            id: 2,
            title: 'Backend lesson 02',
            author: 'Dimych',
            availableResolutions: [ VideoResolutions.P1440, VideoResolutions.P1080],
            canBeDownloaded: true, createdAt: new Date(2023, 5,13).toISOString(),
            publicationDate: new Date(2023, 5,14).toISOString(),
            minAgeRestriction: null
        },
    ]
}

