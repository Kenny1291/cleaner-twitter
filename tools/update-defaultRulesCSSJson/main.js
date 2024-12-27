/* global processDefaultRulesUpdate */

const fieldSet = document.querySelector('form')
/**@type {defaultCSSRules} */
let defaultCSSRulesJson

fetch('https://raw.githubusercontent.com/Kenny1291/cleaner-twitter/main/data/defaultCSSRulesV2.json')
    .then(response => response.json())
    .then(data => {
        defaultCSSRulesJson = data

        fieldSet.innerText = ""

        for (const defaultRuleObj of defaultCSSRulesJson.defaultRules) {
            const ruleUUID = defaultRuleObj.UUID
            const rule = defaultRuleObj.rule
            const group = defaultRuleObj.group
            fieldSet.insertAdjacentHTML(
                'afterbegin',
                `
                    <fieldset role="group">
                        <textarea UUID=${ruleUUID}>${rule}</textarea>
                        <select name="ruleGroup">
                            <option ${group === 'menuCard' ? 'selected' : ''} value="menuCard">Menu</option>
                            <option ${group === 'timelineCard' ? 'selected' : ''} value="timelineCard">Timeline</option>
                            <option ${group === 'sidebarCard' ? 'selected' : ''} value="sidebarCard">Sidebar</option>
                            <option ${group === 'otherCard' ? 'selected' : ''} value="otherCard">Other</option>
                        </select>
                        <button class="outline deleteBtn" type="button">Delete</button>
                    </fieldset>
                `
                )
        }

        for (const deleteBtn of document.getElementsByClassName('deleteBtn')) {
            //@ts-ignore
            deleteBtn.addEventListener('click', event => event.target.parentElement.remove())
        }
    })

let counter = 0
document.getElementById('addBtn').addEventListener('click', () => {
    fieldSet.insertAdjacentHTML(
        'beforeend',
        `
            <fieldset role="group">
                <textarea UUID=${crypto.randomUUID()} placeholder="CSS rule"></textarea>
                <select name="ruleGroup" required>
                    <option value=""></option>
                    <option value="menuCard">Menu</option>
                    <option value="timelineCard">Timeline</option>
                    <option value="sidebarCard">Sidebar</option>
                    <option value="otherCard">otherCard</option>
                </select>
                <button class="outline deleteBtn" type="button" id=newDeleteBtn${counter}>Delete</button>
            </fieldset>
        `
        )
    //@ts-ignore
    document.getElementById('newDeleteBtn' + counter++).addEventListener('click', event => event.target.parentElement.remove())
})

document.getElementById('applyUpdateBtn').addEventListener('click', event => {
    //@ts-ignore
    event.target.disabled = true
    const newDefaultRules = getNewDefaultRules()
    processDefaultRulesUpdate(newDefaultRules, defaultCSSRulesJson)
})

/**
 * @typedef {Object} updatedDefaultRules
 * @property {string} UUID
 * @property {string} rule
 * @property {string} group
 */

/**
 * @returns {updatedDefaultRules[]}
 */
function getNewDefaultRules() {
    const newDefaultRules = []
    const textAreas = document.getElementsByTagName('textarea')
    for (const textArea of textAreas) {
        const UUID = textArea.getAttribute('UUID')
        const rule = textArea.value
        /**@type {HTMLSelectElement} */
        // @ts-ignore
        const selectEl = textArea.nextElementSibling
        const group = selectEl.value

        if (rule.trim().length !== 0 && group !== '') {
            newDefaultRules.push({ UUID, rule, group })
        }
    }
    return newDefaultRules
}
