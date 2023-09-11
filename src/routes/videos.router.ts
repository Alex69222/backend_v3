import {Request, Response, Router} from "express";
import {db, VideoResolutions, VideoType} from "../db/db";
import {HTTP_STATUSES} from "../index";
import {isValidIsoString} from "../helpers/isValidIsoString/isValidIsoString";

export const MAX_TITLE_LENGTH = 40;
const MAX_AUTHOR_LENGTH = 20;
export const videosRouter = Router({})
const validateVideo = (req: Request) => {
    const errorsMessages = []
    if (!req.body.title) errorsMessages.push({field: 'title', message: 'Video title is not provided'});
    if (req.body.title?.length > MAX_TITLE_LENGTH) errorsMessages.push({
        message: `Max title length is ${MAX_TITLE_LENGTH} symbols.`,
        field: 'title'
    });
    if (!req.body.author) errorsMessages.push({field: 'author', message: 'Video author is not provided'});
    if (req.body.author?.length > MAX_AUTHOR_LENGTH) errorsMessages.push({
        message: `Max author length is ${MAX_AUTHOR_LENGTH} symbols.`,
        field: 'author'
    });
    if (req.body.minAgeRestriction &&
        (typeof +req.body.minAgeRestriction !== "number" ||
            +req.body.minAgeRestriction < 1 ||
            +req.body.minAgeRestriction > 18)) errorsMessages.push({
        message: 'minAgeRestriction should be null or a number between 1 and 18',
        field: 'minAgeRestriction',
    });
    if (req.body.availableResolutions &&
        (!Array.isArray(req.body.availableResolutions) ||
            req.body.availableResolutions.length === 0 ||
            !req.body.availableResolutions.every((v: VideoResolutions) => Object.values(VideoResolutions).includes(v)))
    ) errorsMessages.push({
        message: `Correct video resolutions are ${VideoResolutions.P144}, ${VideoResolutions.P240}, ${VideoResolutions.P360} and so on.`,
        field: 'availableResolutions'
    });
    if (req.body.createdAt && !isValidIsoString(req.body.createdAt)) errorsMessages.push({
        message: 'Date should be provided in ISOString format.',
        field: 'createdAt',
    });
    if (req.body.publicationDate && !isValidIsoString(req.body.publicationDate)) errorsMessages.push({
        message: 'Date should be provided in ISOString format.',
        field: 'publicationDate',
    });
    if (req.body.canBeDownloaded && typeof req.body.canBeDownloaded !== 'boolean') errorsMessages.push({
        message: 'canBeDownloaded should be boolean.',
        field: 'canBeDownloaded',
    });
    return errorsMessages
}
videosRouter.post('/', (req: Request, res: Response) => {
    const errorsMessages = validateVideo(req)
    if (errorsMessages.length) return res.status(HTTP_STATUSES.BAD_REQUEST_400).send({errorsMessages})
    const date = req.body.createdAt ? new Date(req.body.createdAt) : new Date()
    const date2 = req.body.createdAt ? new Date(req.body.createdAt) : new Date()
    date2.setDate(date2.getDate() + 1)

    const newVideo: VideoType = {
        id: +(new Date()),
        title: req.body.title,
        author: req.body.author,
        minAgeRestriction: req.body.minAgeRestriction || null,
        createdAt: date.toISOString(),
        publicationDate: req.body.publicationDate || new Date(date2).toISOString(),
        canBeDownloaded: req.body.canBeDownloaded || false,
        availableResolutions: req.body.availableResolutions,
    }
    db.videos.push(newVideo)
    res.status(HTTP_STATUSES.CREATED_201).send(newVideo)
})

videosRouter.get('/', (req: Request, res: Response) => {
    res.send(db.videos)
})
videosRouter.get('/:id', (req: Request, res: Response) => {
    const video = db.videos.find((v: VideoType) => v.id === +req.params.id)
    if (!video) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    res.send(video)
})

videosRouter.put('/:id', (req: Request, res: Response) => {
    let video = db.videos.find((v: VideoType) => v.id === +req.params.id)
    if (!video) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    const errorMessages = validateVideo(req)
    if (errorMessages.length) return res.status(HTTP_STATUSES.BAD_REQUEST_400).send({errorMessages})
    video.title = req.body.title;
    video.author = req.body.author;
    video.availableResolutions = req.body.availableResolutions || video.availableResolutions;
    video.canBeDownloaded = req.body.canBeDownloaded || video.canBeDownloaded;
    video.minAgeRestriction = req.body.minAgeRestriction || video.minAgeRestriction;
    video.publicationDate = req.body.publicationDate || video.publicationDate;
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

videosRouter.delete('/:id', (req: Request, res: Response) => {
    let video = db.videos.find((v: VideoType) => v.id === +req.params.id)
    if (!video) return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    db.videos = db.videos.filter((v: VideoType) => v.id !== +req.params.id)
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})
