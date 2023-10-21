tippy.setDefaultProps({
        delay: 500,
        allowHTML: true,
        // followCursor: 'horizontal'
    }
);
tippy('.help-icon.shortcut', {
    placement: 'top',
    content: '<p style="font-size: 10px">For quick access to a saved website: Press "/", followed by a space and the shortcut name. Then, hit Enter.<p/>'
});
tippy('.freq-suggest-wrapper span', {
    placement: 'left',
    content: '<p style="font-size: 10px">Change View<p/>',
    style: {
        "font-size": "10px"
    }
});


let addTippy = (selector, content, style,delay) => {
    tippy(selector, {
        content: content,
        style: style,
        delay : delay
    })
}