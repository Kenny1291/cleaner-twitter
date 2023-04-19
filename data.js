const fileURL = "content.css"

async function getFirstClassesFromCSSFile(fileURL) {
    const response = await fetch(fileURL)
    const text = await response.text()
    const regex = /\.([\w-]+)[^,{]*/g
    const firstClasses = [...text.matchAll(regex)].map(match => match[1])
    return firstClasses
}

let pieces = []

const piecesPromise = getFirstClassesFromCSSFile(chrome.runtime.getURL(fileURL)).then(
  firstClasses => {
    pieces = firstClasses
    return pieces
  }
)

export function getPieces() {
  return piecesPromise
}