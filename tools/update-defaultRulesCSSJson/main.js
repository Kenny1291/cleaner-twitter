const fieldSet = document.querySelector('form')
let defaultCSSRulesJson

fetch('https://raw.githubusercontent.com/Kenny1291/cleaner-twitter/main/data/defaultCSSRules.json')
    .then(response => response.json())
    .then(data => {
        defaultCSSRulesJson = data

        fieldSet.innerText = ""

        for (const defaultRule of Object.entries(defaultCSSRulesJson.defaultRules)) {
            const ruleUUID = defaultRule[0]
            const rule = defaultRule[1]
            fieldSet.insertAdjacentHTML(
                'afterbegin',
                `
                    <fieldset role="group">
                        <textarea UUID=${ruleUUID}>${rule}</textarea>
                        <button class="outline deleteBtn" type="button">Delete</button>
                    </fieldset>
                `
                )    
        }

        for (const deleteBtn of document.getElementsByClassName('deleteBtn')) {
            deleteBtn.addEventListener('click', (event) => event.target.parentElement.remove())
        }
    })

let counter = 0
document.getElementById('addBtn').addEventListener('click', () => {
    fieldSet.insertAdjacentHTML(
        'beforeend',
        `
            <fieldset role="group">
                <textarea UUID=${crypto.randomUUID()} placeholder="CSS rule"></textarea>
                <button class="outline deleteBtn" type="button" id=newDeleteBtn${counter}>Delete</button>
            </fieldset>
        `
        )
    document.getElementById('newDeleteBtn' + counter++).addEventListener('click', (event) => event.target.parentElement.remove())
})

document.getElementById('applyUpdateBtn').addEventListener('click', () => {
    const newDefaultRules = getNewDefaultRules()
    processDefaultRulesUpdate(newDefaultRules, defaultCSSRulesJson)
})

function getNewDefaultRules() {
    const newDefaultRules = []
    const textAreas = document.getElementsByTagName('textarea')
    for (const textArea of textAreas) {
        const UUID = textArea.getAttribute('UUID')
        const rule = textArea.value
        if(rule.trim().length !== 0) newDefaultRules.push({ UUID, rule })
    }
    return newDefaultRules
}
