console.log("Hello guys")

function expander(e){
        let target = e.target;
        let isContentEditable = !!target?.isContentEditable;
        let isInputFiled = target?.tagName.toLowerCase() === 'input'
        let isTextArea = target?.tagName.toLowerCase() === 'textarea'
        let isInputOrTextarea = isInputFiled || isTextArea;
        let input = isTextArea || isInputFiled ? target?.value : target.innerText
        console.log(input,target,target.value,target.innerText)

        if ((isInputOrTextarea || isContentEditable) && input.indexOf('/ ') >= 0) {
            console.log("search key : " , input)
            chrome.runtime.sendMessage({event: "expander",action:"getText",key:input}, function(response) {
                console.log("Response from background script: ", response);
                if(response.length){
                    let key = response[0]?.key
                    let value = response[0]?.value
                    let x = input.replace("/ ",'').replace(key,value)
                    if(isInputFiled || isTextArea){
                        target.value = x;
                    }
                    else{
                        target.innerText = x
                    }
                }
            });
        }
    }
document.addEventListener("input",expander)
document.getElementsByName("iframe").forEach(node=>{
    return node.addEventListener("input",expander)
})

function checkAndAttachToIframe(mutationsList, observer) {
    for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(node => {
                if (node.tagName === "INPUT") {
                    node.addEventListener("input",expander)
                }
                 else if(node.tagName === 'DIV' && node.hasAttribute("contenteditable")){
                    node.addEventListener("input",expander)
                }
            });
        }
    }
}


const observer = new MutationObserver(checkAndAttachToIframe);
observer.observe(document.body, { childList: true, subtree: true, attributeFilter: ["contenteditable"] });
window.onload = function() {
    console.log("Page fully loaded");
    let inp = document.querySelectorAll('textarea,input,*[contenteditable=true],[contenteditable=""],[contenteditable=plaintext-only]') || []
    console.log("inp :" , inp)
    inp.forEach(node=>{node.addEventListener("change",expander)})
};

