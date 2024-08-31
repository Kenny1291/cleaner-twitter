import { updateDefaultCSSRules } from "../../utils/defaultRulesUpdate.js"

const updateNowContainer = document.getElementById('update-now-container')

let updateNowClicked = false
updateNowContainer.addEventListener('click', async () => {
    if(updateNowClicked) return
    
    updateNowClicked = true
    const response = await updateDefaultCSSRules(true)
    updateNowContainer.insertAdjacentHTML(
        'beforebegin', 
        `<div 
            style="
                display: flex;
                justify-content: center;
                align-items: center;
            "
        >
            <p 
                id="updateFeedbackMsg"
                style="
                    font-size: 11px;
                    margin: 0 0 8 0;
                    padding: 5px;
                    background-color: #1f2937;
                    color: white;
                    border-radius: 5px;
                    border: 1px solid #4b5563;
                    width: min-content;
                "
            >
                ${response}
            </p>
        </div>`    
    )
})

export {}