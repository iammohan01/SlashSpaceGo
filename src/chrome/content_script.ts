import {RequestEvent} from "../@types/background";

let inputForRequest: string | null = null;
let target: HTMLInputElement | null = null
function expander(e: Event) {

    target = e.target as HTMLInputElement;
    const isContentEditable = !!target?.isContentEditable;
    const isInputFiled = target?.tagName.toLowerCase() === 'input'
    const isTextArea = target?.tagName.toLowerCase() === 'textarea'
    const isInputOrTextarea = isInputFiled || isTextArea;
    const input = isTextArea || isInputFiled ? target?.value : target.innerText
    const indexOfSlash = input.indexOf('/')
    if ((isInputOrTextarea || isContentEditable) && indexOfSlash >= 0) {
        inputForRequest = input.slice(indexOfSlash)
        console.log(inputForRequest)
    } else {
        inputForRequest = null
    }
}

document.addEventListener("keydown", (e) => {
    console.log(e)

    const isInputFiled = target?.tagName.toLowerCase() === 'input'
    const isTextArea = target?.tagName.toLowerCase() === 'textarea'
    console.log(inputForRequest != null, target != null, e.key === "Tab")
    if (inputForRequest != null && target != null && e.key === "Tab") {
        chrome.runtime.sendMessage({
            event: RequestEvent.EXPANDER,
            action: "getText",
            key: inputForRequest
        }, function (response) {
            console.log(response);
            if (response.length) {
                response = response as []
                const data = response.filter((val) => {
                    console.log(`/${val.key}`, inputForRequest)
                    return `/${val.key}` === inputForRequest
                })

                console.log(data)
                if (data) {
                    if (inputForRequest != null && target != null) {
                        const x = inputForRequest.replace("/", "").replace(data[0].key, data[0].value);
                        if (isInputFiled || isTextArea) {
                            target.value = x;
                        } else {
                            target.innerText = x;
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

