import { dialog } from "electron"
import pkg, { remove } from "fs-extra"
import { isEmpty } from "lodash"
import { homedir } from "os"
import path from "path"
import welcomeNoteFile from "../../../resources/welcomeNote.md?asset"
import { appDirectoryName, fileEncoding, welcomeNoteFilename } from "../../shared/constants"
import { NoteInfo } from "../../shared/models"
import { CreateNote, DeleteNote, GetNotes, ReadNote, WriteNote } from "../../shared/types"
const { ensureDir, readdir, readFile, stat, writeFile } = pkg

export const getRootDir = () => {
    return `${homedir()}/${appDirectoryName}`
}

export const getNotes: GetNotes = async () => {
    const rootDir = getRootDir()

    await ensureDir(rootDir)

    const notesFileNames = await readdir(rootDir, {
        encoding: fileEncoding,
        withFileTypes: true,
    })

    const notes = notesFileNames.filter((fileName) => fileName.name.endsWith(".md"))

    if (isEmpty(notes)) {
        console.info('No notes found, creating a welcome note')

        const content = await readFile(welcomeNoteFile, { encoding: fileEncoding })

        //create the welcome note
        await writeFile(`${rootDir}/${welcomeNoteFilename}`, content, { encoding: fileEncoding })

        // Create a Dirent-like object for the welcome note
        const welcomeNoteDirent = {
            name: welcomeNoteFilename
        } as unknown as pkg.Dirent
        notes.push(welcomeNoteDirent);
    }

    return Promise.all(notes.map((dirent) => getNoteInfoFromFileName(dirent.name)))
}

export const getNoteInfoFromFileName = async (filename: string): Promise<NoteInfo> => {
    const fileStats = await stat(`${getRootDir()}/${filename}`)

    return {
        title: filename.replace(/\.md$/, ''),
        lastEditTime: fileStats.mtimeMs,
    }

}

export const readNote: ReadNote = async (filename) => {
    const rootDir = getRootDir()

    return readFile(`${rootDir}/${filename}.md`, { encoding: fileEncoding })
}

export const writeNote: WriteNote = async (filename, content) => {
    const rootDir = getRootDir()

    console.info(`Writing note ${filename}.md`)
    return writeFile(`${rootDir}/${filename}.md`, content, { encoding: fileEncoding })
}

export const createNote: CreateNote = async () => {
    const rootDir = getRootDir()

    await ensureDir(rootDir)

    const { filePath, canceled } = await dialog.showSaveDialog({
        title: 'New note',
        defaultPath: `${rootDir}/Untitled.md`,
        buttonLabel: 'Create',
        properties: ['showOverwriteConfirmation'],
        showsTagField: false,
        filters: [{ name: 'Markdown', extensions: ['md'] }]
    })

    if (canceled || !filePath) {
        console.info('Note creation canceled')
        return false
    }

    const { name: filename, dir: parentDir } = path.parse(filePath)

    if (parentDir !== rootDir) {
        await dialog.showMessageBox({
            type: 'error',
            title: 'Creation failed',
            message: `All notes must be saved under ${rootDir}.
            Avoid using other directories!`,
        })
        return false;
    }

    console.info(`Creating note: ${filePath}`)
    await writeFile(filePath, '')

    return filename
}

export const deleteNote: DeleteNote = async (filename) => {
    const rootDir = getRootDir()

    const { response } = await dialog.showMessageBox({
        type: 'warning',
        title: 'Delete note',
        message: `Are you sure you want to delete ${filename}?`,
        buttons: ['Delete', 'Cancel'],// 0 is delete, 1 is cancel
        defaultId: 1,
        cancelId: 1,
    })

    if (response === 1) {
        console.info('Note deletion canceled')
        return false
    }

    console.info(`Deleting note: ${filename}`)
    await remove(`${rootDir}/${filename}.md`)
    return true
}