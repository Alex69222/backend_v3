import {Request, Response, Router} from "express";
import {db, VideoResolutions, VideoType} from "../db/db";
import {HTTP_STATUSES} from "../index";
import {isValidIsoString} from "../helpers/isValidIsoString/isValidIsoString";
const MAX_TITLE_LENGTH = 40;
const MAX_AUTHOR_LENGTH = 20;
export const videosRouter = Router({})
videosRouter.get('/', (req: Request, res: Response) => {
    res.send(db.videos)
})
videosRouter.post('/', (req: Request, res: Response) =>{
    if(!req.body.title) return res.status(HTTP_STATUSES.BAD_REQUEST_400).send('Video title is not provided');
    if(req.body.title.length > MAX_TITLE_LENGTH) return res.status(HTTP_STATUSES.BAD_REQUEST_400).send(`Max title length is ${MAX_TITLE_LENGTH} symbols.`);
    if(!req.body.author) return res.status(HTTP_STATUSES.BAD_REQUEST_400).send('Video author is not provided');
    if(req.body.title.author > MAX_AUTHOR_LENGTH) return res.status(HTTP_STATUSES.BAD_REQUEST_400).send(`Max author length is ${MAX_AUTHOR_LENGTH} symbols.`);
    if(req.body.minAgeRestriction && typeof +req.body.minAgeRestriction !== "number" || +req.body.minAgeRestriction < 1 || +req.body.minAgeRestriction > 18 ) return res.status(HTTP_STATUSES.BAD_REQUEST_400).send('minAgeRestriction should be null or a number between 1 and 18');
    if(!req.body.availableResolutions ||
        !Array.isArray(req.body.availableResolutions) ||
        req.body.availableResolutions.length === 0 ||
        !Object.values(VideoResolutions).includes(req.body.availableResolutions)
    ) return res.status(HTTP_STATUSES.BAD_REQUEST_400).send('Correct video resolutions are not provided');
    if(req.body.createdAt && !isValidIsoString(req.body.createdAt)) return res.status(HTTP_STATUSES.BAD_REQUEST_400).send('Date should be provided in ISOString format.');
    if(req.body.publicationDate && !isValidIsoString(req.body.publicationDate)) return res.status(HTTP_STATUSES.BAD_REQUEST_400).send('Date should be provided in ISOString format.');
    if(req.body.canBeDownloaded && (!req.body.canBeDownloaded !== true || !req.body.canBeDownloaded !== false)) return res.status(HTTP_STATUSES.BAD_REQUEST_400).send('canBeDownloaded should be boolean.');
    const newVideo: VideoType = {
        id: +(new Date()),
        title: req.body.title,
        author: req.body.author,
        minAgeRestriction: req.body.minAgeRestriction || null,
        createdAt: req.body.createdAt || new Date().toISOString(),
        publicationDate: req.body.publicationDate || new Date(new Date().getDate() + 1).toISOString(),
        canBeDownloaded: req.body.canBeDownloaded || false,
        availableResolutions: req.body.availableResolutions,
    }
    db.videos.push(newVideo)
    res.status(HTTP_STATUSES.CREATED_201).send(newVideo)
})
