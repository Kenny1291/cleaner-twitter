const { filesToAdd, foldersToAdd } = require('./make-publish-zip')
const fs = require('fs-extra');

const destinationFolder = 'dist/cleaner-twitter/'

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

make();
