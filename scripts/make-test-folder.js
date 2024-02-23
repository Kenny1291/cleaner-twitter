import { filesToAdd, foldersToAdd } from './make-publish-zip.js';
import fs from 'fs-extra';

const destinationFolder = 'dist/cleaner-twitter/'

/**
 * @param {string} fileOrFolder 
 */
async function copyToDestDir(fileOrFolder) {
    await fs.copy(fileOrFolder, destinationFolder + fileOrFolder);
}

async function make() {
    for (const file of filesToAdd) {
        await copyToDestDir(file)
    }
    for (const folder of foldersToAdd) {
        await copyToDestDir(folder)
    }
}

make()
