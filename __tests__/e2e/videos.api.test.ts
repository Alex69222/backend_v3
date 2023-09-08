import request from "supertest";
import {app, HTTP_STATUSES, RoutePaths} from "../../src";

const getRequest = () => request(app)
describe('/videos', () => {
    beforeAll(async () => {
        await getRequest().delete(RoutePaths.__test__)
    })
    it('should return 200 and empty array', async () => {
        await getRequest().get(RoutePaths.videos)
            .expect(HTTP_STATUSES.OK_200, [])
    });
})
