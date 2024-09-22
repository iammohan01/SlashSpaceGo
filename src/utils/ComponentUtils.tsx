type LineBreaker = {
    str: string;
};

function LineBreaker({str}: LineBreaker) {
    return str.split('\n').map((subStr) => {
        return (
            <>
                {subStr.replace(/\u00a0/g, ' ')}
                <br/>
            </>
        );
    });
}

export {LineBreaker};
