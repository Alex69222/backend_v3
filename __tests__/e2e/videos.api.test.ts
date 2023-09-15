import request from "supertest";
import {VideoResolutions, VideoType} from "../../src/db/db";
import {MAX_TITLE_LENGTH} from "../../src/features/videos/videos.router";
import {HTTP_STATUSES, RoutePaths, startApp} from "../../src/app";

const getRequest = () => request(startApp())

describe('/videos', () => {
    const newEntity1: Partial<VideoType> = {
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
    describe('create entity', () => {
        it('should return 200 and empty array', async () => {
            await getRequest().get(RoutePaths.videos)
                .expect(HTTP_STATUSES.OK_200, [])
        });
        it('should create new entity', async () => {
            const res = await getRequest().post(RoutePaths.videos)
                .send(newEntity1)
                .expect(HTTP_STATUSES.CREATED_201)
            expect(res.body).toEqual({...newEntity1, id: expect.any(Number), publicationDate: expect.any(String)})
            // .expect(HTTP_STATUSES.BAD_REQUEST_400)
        });
        it('should not create new entity if title is not provided', async () => {
            let {title, ...rest} = newEntity1
            await getRequest().post(RoutePaths.videos)
                .send(rest)
                .expect(HTTP_STATUSES.BAD_REQUEST_400)
        });
        it(`should not create new entity if title is more than ${MAX_TITLE_LENGTH}`, async () => {
            let newEntity = {
                ...newEntity1,
                title: `It is definitely very long title. The length of this title is longer than MAX_TITLE_LENGTH. At the moment, the constant MAX_TITLE_LENGTH equals to ${MAX_TITLE_LENGTH}`
            }
            await getRequest().post(RoutePaths.videos)
                .send(newEntity)
                .expect(HTTP_STATUSES.BAD_REQUEST_400)
        });
        it(`should not create new entity if author is more than ${MAX_TITLE_LENGTH}`, async () => {
            let newEntity = {...newEntity1, author: null}
            await getRequest().post(RoutePaths.videos)
                .send(newEntity)
                .expect(HTTP_STATUSES.BAD_REQUEST_400)
        });
        it('should create entity if minAgeRestriction is between 1 and 18', async () => {
            let newEntity = {...newEntity1, minAgeRestriction: 2}
            await getRequest().post(RoutePaths.videos)
                .send(newEntity)
                .expect(HTTP_STATUSES.CREATED_201)
        });
        it('should not create entity if minAgeRestriction is between less than 1, but not 0', async () => {
            let newEntity = {...newEntity1, minAgeRestriction: -1}
            await getRequest().post(RoutePaths.videos)
                .send(newEntity)
                .expect(HTTP_STATUSES.BAD_REQUEST_400)
        });
        it('should not create entity if minAgeRestriction is between more than 18', async () => {
            let newEntity = {...newEntity1, minAgeRestriction: 19}
            await getRequest().post(RoutePaths.videos)
                .send(newEntity)
                .expect(HTTP_STATUSES.BAD_REQUEST_400)
        });
        it('should not create entity if availableResolutions is not an array', async () => {
            let newEntity = {...newEntity1, availableResolutions: 1}
            await getRequest().post(RoutePaths.videos)
                .send(newEntity)
                .expect(HTTP_STATUSES.BAD_REQUEST_400)
        });
        it('should not create entity if availableResolutions is  an empty array', async () => {
            let newEntity = {...newEntity1, availableResolutions: []}
            await getRequest().post(RoutePaths.videos)
                .send(newEntity)
                .expect(HTTP_STATUSES.BAD_REQUEST_400)
        });
        it('should not create entity if availableResolutions array contains smth not from VideoResolutions enum', async () => {
            let newEntity = {...newEntity1, availableResolutions: ['222PX']}
            await getRequest().post(RoutePaths.videos)
                .send(newEntity)
                .expect(HTTP_STATUSES.BAD_REQUEST_400)
        });
        it('should  create entity if availableResolutions array contains smth  from VideoResolutions enum', async () => {
            let newEntity = {
                ...newEntity1,
                availableResolutions: [VideoResolutions.P144, VideoResolutions.P240, VideoResolutions.P1440]
            }
            await getRequest().post(RoutePaths.videos)
                .send(newEntity)
                .expect(HTTP_STATUSES.CREATED_201)
        });
        it('should not create entity if createdAt or publicationDate are not valid ISOStrings', async () => {
            let newEntity = {...newEntity1, createdAt: '2023-09-11T99:30:27.782Z'}
            await getRequest().post(RoutePaths.videos)
                .send(newEntity)
                .expect(HTTP_STATUSES.BAD_REQUEST_400)
            let newEntity2 = {...newEntity1, publicationDate: '2023-09-11T18:30:99.782Z'}
            await getRequest().post(RoutePaths.videos)
                .send(newEntity2)
                .expect(HTTP_STATUSES.BAD_REQUEST_400)
        });
        it('should create entity if createdAt or publicationDate are  valid ISOStrings', async () => {
            let newEntity = {...newEntity1, createdAt: '2023-09-11T18:30:27.782Z'}
            await getRequest().post(RoutePaths.videos)
                .send(newEntity)
                .expect(HTTP_STATUSES.CREATED_201)
            let newVideo2 = {...newEntity1, publicationDate: '2023-09-22T18:30:27.782Z'}
            await getRequest().post(RoutePaths.videos)
                .send(newVideo2)
                .expect(HTTP_STATUSES.CREATED_201)
        })

    })
    describe('get entity by id', () => {
        it('should return video by id if it exists', async () => {
            const createdEntity = await getRequest().post(RoutePaths.videos).send(newEntity1).expect(HTTP_STATUSES.CREATED_201)
            await getRequest().get(RoutePaths.videos + `/${createdEntity.body.id}`).expect(HTTP_STATUSES.OK_200)
        });
        it('should return 404 for not existing entity', async () => {
            await getRequest().get(RoutePaths.videos + '0').expect(HTTP_STATUSES.NOT_FOUND_404)
        });
    })
    describe('update entity by id', () => {
        it('should return 404 error if entity with provided id does not exist', () => {
            getRequest().put(RoutePaths.videos + '/0').send(newEntity1).expect(HTTP_STATUSES.NOT_FOUND_404)
        });
        it('should update existing entity', async () => {
            const data : Partial<VideoType> = {
                ...newEntity1,
                title: 'Eating',
                author: 'Alexey'
            }
            const response = await getRequest().post(RoutePaths.videos).send(newEntity1).expect(HTTP_STATUSES.CREATED_201)
            await getRequest().put(RoutePaths.videos + `/${response.body.id}`).send(data)
                .expect(HTTP_STATUSES.NO_CONTENT_204)
            const response2 = await getRequest().get(RoutePaths.videos + `/${response.body.id}`).expect(HTTP_STATUSES.OK_200)
            expect(response2.body.title).toBe(data.title)
            expect(response2.body.author).toBe(data.author)
        });
    });
    describe('delete entity by id', () => {
        it('should return 404 if entity with id not found', async () => {
            getRequest().delete(RoutePaths.videos + '/0').expect(HTTP_STATUSES.NOT_FOUND_404)
        });
        it('it should delete entity by id', async () => {
            const res = await getRequest().post(RoutePaths.videos).send(newEntity1);
            await getRequest().delete(RoutePaths.videos + `/${res.body.id}`).expect(HTTP_STATUSES.NO_CONTENT_204)
            await getRequest().get(RoutePaths.videos + `/${res.body.id}`).expect(HTTP_STATUSES.NOT_FOUND_404)
        });
    });

})
