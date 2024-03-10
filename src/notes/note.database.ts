import { Note, Notes, UnitNote } from "./note.interface";
import { v4 as random } from "uuid";
import fs from "fs";

let notes: Notes = loadsNotes();

function loadsNotes(): Notes {
  try {
    const data = fs.readFileSync("./notes.json", "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.log(`Error ${error}`);
    return {};
  }
}

function saveNotes() {
    try {
        fs.writeFileSync("./notes.json", JSON.stringify(notes), "utf-8");
        console.log("Notes saved successfully!")
    } catch (error) {
        console.log("Error", error)
    }
}


export const findAll = async () : Promise<UnitNote[]> => Object.values(notes)

export const findOne = async (id : string) : Promise<UnitNote> => notes[id]

export const create = async (noteInfo : Note) : Promise<null | UnitNote> => {

    let id = random()

    let note = await findOne(id)

    while (note) {
        id = random ()
        await findOne(id)
    }

    notes[id] = {
        id : id,
        ...noteInfo
    }

    saveNotes()

    return notes[id]
}

export const update = async (id : string, updateValues : Note) : Promise<UnitNote | null> => {

    const note = await findOne(id) 

    if (!note) {
        return null
    }

    notes[id] = {
        id,
        ...updateValues
    }

    saveNotes()

    return notes[id]
}

export const remove = async (id : string) : Promise<null | void> => {

    const note = await findOne(id)

    if (!note) {
        return null
    }

    delete notes[id]

    saveNotes()

}