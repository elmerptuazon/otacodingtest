import express, {Request, Response} from "express"
import * as database from "./note.database"
import {StatusCodes} from "http-status-codes"

export const noteRouter = express.Router()

noteRouter.get('/notes', async (req : Request, res : Response) => {
    try {
       const allNotes = await database.findAll()
       
       if (!allNotes) {
        return res.status(StatusCodes.NOT_FOUND).json({error : `No notes found!`})
       }

       return res.status(StatusCodes.OK).json({total : allNotes.length, allNotes})
    } catch (error) {
       return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error}) 
    }
})

noteRouter.get("/note/:id", async (req : Request, res : Response) => {
    try {
        const note = await database.findOne(req.params.id)

        if (!note) {
            return res.status(StatusCodes.NOT_FOUND).json({error : "Note does not exist"})
        }

        return res.status(StatusCodes.OK).json({note})
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error})
    }
})


noteRouter.post("/note", async (req : Request, res : Response) => {
    try {
        const {title, body} = req.body

        if (!title || !body) {
            return res.status(StatusCodes.BAD_REQUEST).json({error : `Please provide all the required parameters..`})
        }
        const newNote = await database.create({...req.body})
        return res.status(StatusCodes.CREATED).json({newNote})
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error})
    }
})

noteRouter.put("/note/:id", async (req : Request, res : Response) => {
    try {
        const id = req.params.id

        const newNote = req.body

        const findNote = await database.findOne(id)

        if (!findNote) {
            return res.status(StatusCodes.NOT_FOUND).json({error : `Note does not exist..`})
        }

        const updateNote = await database.update(id, newNote)

        return res.status(StatusCodes.OK).json({updateNote})
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error})
    }
})


noteRouter.delete("/note/:id", async (req : Request, res : Response) => {
    try {
        const getNote = await database.findOne(req.params.id)

        if (!getNote) {
            return res.status(StatusCodes.NOT_FOUND).json({error : `No note with ID ${req.params.id}`})
        }

        await database.remove(req.params.id)

        return res.status(StatusCodes.OK).json({msg : `Note deleted..`})

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error})
    }
})