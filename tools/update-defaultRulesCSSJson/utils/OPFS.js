/**Interact with the origin private file system */
class OPFS {
    static #opfsRoot = navigator.storage.getDirectory()

    /**
     * Write to a file. Creates the file if it doesn't exist
     *
     * @param {string} fileName
     * @param {string} content
     * @returns {Promise<boolean>}
     */
    static async writeFile(fileName, content) {
        let globalWritableFileStream
        const opfsRoot = await OPFS.#opfsRoot

        return opfsRoot.getFileHandle(fileName, { create: true })
            .then(fileHandle => fileHandle.createWritable())
            .then(writableFileStream => {
                globalWritableFileStream = writableFileStream
                writableFileStream.write(content)
            })
            .then(() => globalWritableFileStream.close())
            .then(() => true)
            .catch(() => false)
    }

    /**
     * @param {string} fileName
     * @returns {Promise<string|boolean>}
     */
    static async readFile(fileName) {
        const opfsRoot = await OPFS.#opfsRoot

        return opfsRoot.getFileHandle(fileName)
            .then(fileHandle => fileHandle.getFile())
            .then(file => file.text())
            .then(text => text)
            .catch(() => false)
    }
}
