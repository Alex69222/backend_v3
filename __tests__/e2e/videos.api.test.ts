import request from "supertest";
import {app, HTTP_STATUSES, RoutePaths} from "../../src";
import {VideoResolutions, VideoType} from "../../src/db/db";
import {MAX_TITLE_LENGTH} from "../../src/routes/videos.router";

const getRequest = () => request(app)

describe('/videos', () => {
    const newVideo1: Partial<VideoType> = {
        title: 'Cooking',
        author: 'Alex',
        availableResolutions: [VideoResolutions.P1440],
        canBeDownloaded: true,
        createdAt: new Date().toISOString(),
        minAgeRestriction: null,
    }
    beforeAll(async () => {
        await getRequest().delete(RoutePaths.__test__)
    })
    describe('create video', () => {
        it('should return 200 and empty array', async () => {
            await getRequest().get(RoutePaths.videos)
                .expect(HTTP_STATUSES.OK_200, [])
        });
        it('should create new video', async () => {
            const res = await getRequest().post(RoutePaths.videos)
                .send(newVideo1)
                .expect(HTTP_STATUSES.CREATED_201)
            expect(res.body).toEqual({...newVideo1, id: expect.any(Number), publicationDate: expect.any(String)})
            // .expect(HTTP_STATUSES.BAD_REQUEST_400)
        });
        it('should not create new video if title is not provided', async () => {
            let {title, ...rest} = newVideo1
            await getRequest().post(RoutePaths.videos)
                .send(rest)
                .expect(HTTP_STATUSES.BAD_REQUEST_400)
        });
        it(`should not create new video if title is more than ${MAX_TITLE_LENGTH}`, async () => {
            let newVideo = {
                ...newVideo1,
                title: `It is definitely very long title. The length of this title is longer than MAX_TITLE_LENGTH. At the moment, the constant MAX_TITLE_LENGTH equals to ${MAX_TITLE_LENGTH}`
            }
            await getRequest().post(RoutePaths.videos)
                .send(newVideo)
                .expect(HTTP_STATUSES.BAD_REQUEST_400)
        });
        it(`should not create new video if author is more than ${MAX_TITLE_LENGTH}`, async () => {
            let newVideo = {...newVideo1, author: null}
            await getRequest().post(RoutePaths.videos)
                .send(newVideo)
                .expect(HTTP_STATUSES.BAD_REQUEST_400)
        });
        it('should create video if minAgeRestriction is between 1 and 18', async () => {
            let newVideo = {...newVideo1, minAgeRestriction: 2}
            await getRequest().post(RoutePaths.videos)
                .send(newVideo)
                .expect(HTTP_STATUSES.CREATED_201)
        });
        it('should not create video if minAgeRestriction is between less than 1, but not 0', async () => {
            let newVideo = {...newVideo1, minAgeRestriction: -1}
            await getRequest().post(RoutePaths.videos)
                .send(newVideo)
                .expect(HTTP_STATUSES.BAD_REQUEST_400)
        });
        it('should not create video if minAgeRestriction is between more than 18', async () => {
            let newVideo = {...newVideo1, minAgeRestriction: 19}
            await getRequest().post(RoutePaths.videos)
                .send(newVideo)
                .expect(HTTP_STATUSES.BAD_REQUEST_400)
        });
        it('should not create video if availableResolutions is not an array', async () => {
            let newVideo = {...newVideo1, availableResolutions: 1}
            await getRequest().post(RoutePaths.videos)
                .send(newVideo)
                .expect(HTTP_STATUSES.BAD_REQUEST_400)
        });
        it('should not create video if availableResolutions is  an empty array', async () => {
            let newVideo = {...newVideo1, availableResolutions: []}
            await getRequest().post(RoutePaths.videos)
                .send(newVideo)
                .expect(HTTP_STATUSES.BAD_REQUEST_400)
        });
        it('should not create video if availableResolutions array contains smth not from VideoResolutions enum', async () => {
            let newVideo = {...newVideo1, availableResolutions: ['222PX']}
            await getRequest().post(RoutePaths.videos)
                .send(newVideo)
                .expect(HTTP_STATUSES.BAD_REQUEST_400)
        });
        it('should  create video if availableResolutions array contains smth  from VideoResolutions enum', async () => {
            let newVideo = {
                ...newVideo1,
                availableResolutions: [VideoResolutions.P144, VideoResolutions.P240, VideoResolutions.P1440]
            }
            await getRequest().post(RoutePaths.videos)
                .send(newVideo)
                .expect(HTTP_STATUSES.CREATED_201)
        });
        it('should not create video if createdAt or publicationDate are not valid ISOStrings', async () => {
            let newVideo = {...newVideo1, createdAt: '2023-09-11T99:30:27.782Z'}
            await getRequest().post(RoutePaths.videos)
                .send(newVideo)
                .expect(HTTP_STATUSES.BAD_REQUEST_400)
            let newVideo2 = {...newVideo1, publicationDate: '2023-09-11T18:30:99.782Z'}
            await getRequest().post(RoutePaths.videos)
                .send(newVideo2)
                .expect(HTTP_STATUSES.BAD_REQUEST_400)
        });
        it('should create video if createdAt or publicationDate are  valid ISOStrings', async () => {
            let newVideo = {...newVideo1, createdAt: '2023-09-11T18:30:27.782Z'}
            await getRequest().post(RoutePaths.videos)
                .send(newVideo)
                .expect(HTTP_STATUSES.CREATED_201)
            let newVideo2 = {...newVideo1, publicationDate: '2023-09-22T18:30:27.782Z'}
            await getRequest().post(RoutePaths.videos)
                .send(newVideo2)
                .expect(HTTP_STATUSES.CREATED_201)
        })

    })
    describe('get video by id', () => {
        it('should return video by id if it exists', async () => {
            const createdVideo = await getRequest().post(RoutePaths.videos).send(newVideo1).expect(HTTP_STATUSES.CREATED_201)
            await getRequest().get(RoutePaths.videos + `/${createdVideo.body.id}`).expect(HTTP_STATUSES.OK_200)
        });
        it('should not return video by id if it does not exist', async () => {
            await getRequest().get(RoutePaths.videos + '0').expect(HTTP_STATUSES.NOT_FOUND_404)
        });
    })
    describe('update video by id', () => {
        it('should return 404 error if video with provided id does not exist', () => {
            getRequest().put(RoutePaths.videos + '/0').send(newVideo1).expect(HTTP_STATUSES.NOT_FOUND_404)
        });
        it('should update existing video', async () => {
            const response = await getRequest().post(RoutePaths.videos).send(newVideo1).expect(HTTP_STATUSES.CREATED_201)
            await getRequest().put(RoutePaths.videos + `/${response.body.id}`).send({
                ...newVideo1,
                title: 'Eating',
                author: 'Alexey'
            })
                .expect(HTTP_STATUSES.NO_CONTENT_204)
            const response2 = await getRequest().get(RoutePaths.videos + `/${response.body.id}`).expect(HTTP_STATUSES.OK_200)
            expect(response2.body.title).toBe('Eating')
            expect(response2.body.author).toBe('Alexey')
        });
    });
    describe('delete video by id', () => {
        it('should return 404 if video with id not found', async () => {
            getRequest().delete(RoutePaths.videos + '/0').expect(HTTP_STATUSES.NOT_FOUND_404)
        });
        it('it should delete video by id', async () => {
            const res = await getRequest().post(RoutePaths.videos).send(newVideo1);
            await getRequest().delete(RoutePaths.videos + `/${res.body.id}`).expect(HTTP_STATUSES.NO_CONTENT_204)
            await getRequest().get(RoutePaths.videos + `/${res.body.id}`).expect(HTTP_STATUSES.NOT_FOUND_404)
        });
    });

})
