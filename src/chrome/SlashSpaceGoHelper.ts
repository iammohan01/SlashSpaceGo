import {request, RequestEvent} from "../@types/background";

function expander(e: Event) {
    const target = e.target as HTMLInputElement;
    const isContentEditable = !!target?.isContentEditable;
    const isInputFiled = target?.tagName.toLowerCase() === 'input'
    const isTextArea = target?.tagName.toLowerCase() === 'textarea'
    const isInputOrTextarea = isInputFiled || isTextArea;
    const input = isTextArea || isInputFiled ? target?.value : target.innerText

    if ((isInputOrTextarea || isContentEditable) && input.indexOf('/ ') >= 0) {
        chrome.runtime.sendMessage({
            event: RequestEvent.EXPANDER,
            action: "getText",
            key: input
        } as request, function (response) {
            if (response.length) {
                const key = response[0]?.key
                const value = response[0]?.value
                const x = input.replace("/ ", '').replace(key, value)
                if (isInputFiled || isTextArea) {
                    target.value = x;
                } else {
                    target.innerText = x
                }
            }
        });
    }
}

document.addEventListener("input", expander)
document.getElementsByName("iframe").forEach(node => {
    return node.addEventListener("input", expander)
})

function checkAndAttachToIframe(mutationsList: any, observer: any) {
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
    if (node.tagName === "INPUT") {
        node.addEventListener("input", expander)
    } else if (node.tagName === 'DIV' && node.hasAttribute("contenteditable")) {
        node.addEventListener("input", expander)
    }
}

const observer = new MutationObserver(checkAndAttachToIframe);
observer.observe(document.body, {childList: true, subtree: true, attributeFilter: ["contenteditable"]});
window.onload = function () {
    console.log("Page fully loaded");
    const inputFields = document.querySelectorAll('textarea,input,*[contenteditable=true],[contenteditable=""],[contenteditable=plaintext-only]') || []
    console.log("inputFields :", inputFields)
    inputFields.forEach(inputNode => {
        inputNode.addEventListener("change", expander)
    })
};

