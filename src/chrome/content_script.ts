import {RequestEvent} from "../@types/background";
import sound from '../../public/resources/sound/txtReplaceSound.wav?url'

let inputForRequest: string | null = null;
let target: HTMLInputElement | null = null
function expander(e: Event) {

    target = e.target as HTMLInputElement;
    const isContentEditable = !!target?.isContentEditable;
    const isInputFiled = target?.tagName.toLowerCase() === 'input'
    const isTextArea = target?.tagName.toLowerCase() === 'textarea'
    const isInputOrTextarea = isInputFiled || isTextArea;
    const input = isTextArea || isInputFiled ? target?.value : target.innerText
    if ((isInputOrTextarea || isContentEditable) && input) {
        const arrOfSplit = input.split(" ")
        inputForRequest = arrOfSplit[arrOfSplit.length - 1]
    } else {
        inputForRequest = null
    }
}

function playFillSound() {
    const audioSrc = chrome.runtime.getURL(sound)
    const audio = new Audio(audioSrc);
    audio.play();
}
document.addEventListener("keydown", (e) => {
    if (e.code === "Tab") {
        e.preventDefault()
    }
    const isInputFiled = target?.tagName.toLowerCase() === 'input'
    const isTextArea = target?.tagName.toLowerCase() === 'textarea'
    if (inputForRequest != null && target != null && e.key === "Tab") {
        chrome.runtime.sendMessage({
            event: RequestEvent.EXPANDER,
            action: "getText",
            key: inputForRequest
        }, function (response) {
            if (response.length) {
                response = response as []
                const data = response.filter((val) => {
                    return val.key === inputForRequest
                })
                if (data) {
                    if (inputForRequest != null && target != null) {
                        if (isInputFiled || isTextArea) {
                            const value = target.value
                            const indexOfKeyInInput = value.lastIndexOf(data[0].key);
                            if (indexOfKeyInInput !== -1) {
                                const updatedInput = value.substring(0, indexOfKeyInInput) + data[0].value + value.substring(indexOfKeyInInput + data[0].key.length);
                                target.value = updatedInput;
                                playFillSound()

                            }
                        } else {
                            const value = target.innerText
                            const indexOfKeyInInput = value.lastIndexOf(data[0].key);
                            if (indexOfKeyInInput !== -1) {
                                const updatedInput = value.substring(0, indexOfKeyInInput) + data[0].value + value.substring(indexOfKeyInInput + data[0].key.length);
                                target.innerText = updatedInput;
                                playFillSound()

                            }
                        }
                    }
                }
            }
        });
    }
})
document.addEventListener("input", expander)
document.getElementsByName("iframe").forEach(node => {
    return node.addEventListener("input", expander)
})

function checkAndAttachToIframe(mutationsList: any) {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(addInputListenerForMutated);
        }
    }
}

function addInputListenerForMutated(node: {
    tagName: string;
    addEventListener: (arg0: string, arg1: { (e: Event): void; (e: Event): void; }) => void;
    hasAttribute: (arg0: string) => any;
}) {
    if (node.tagName === "INPUT" || (node.tagName === 'DIV' && node.hasAttribute("contenteditable"))) {
        node.addEventListener("input", expander)
    }
}

const observer = new MutationObserver(checkAndAttachToIframe);
observer.observe(document.body, {childList: true, subtree: true, attributeFilter: ["contenteditable"]});
window.onload = function () {
    const inputFields = document.querySelectorAll('textarea,input,*[contenteditable=true],[contenteditable=""],[contenteditable=plaintext-only]') || []
    inputFields.forEach(inputNode => {
        inputNode.addEventListener("change", expander)
    })
};

