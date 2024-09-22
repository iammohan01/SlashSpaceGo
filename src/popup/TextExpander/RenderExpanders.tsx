import {Expanders} from '../../@types/expanders';
import {Dispatch, SetStateAction, useState} from 'react';
import {message, Tooltip} from 'antd';

type MakeExpanderProperties = {
    expanderProperty: Expanders[];
};
type ItemProperty = {
    expanderProperty: Expanders;
    index: number;
    selectedCard: [number, Dispatch<SetStateAction<number>>];
};
export type {MakeExpanderProperties};

export function RenderExpanders({expanderProperty}: MakeExpanderProperties) {
    const selectedCard = useState(-1);
    return (
        <div className={'frq-expanders'}>
            {expanderProperty.map((value, index) => {
                return (
                    <RenderExpanderItems
                        selectedCard={selectedCard}
                        key={value.id}
                        expanderProperty={value}
                        index={index}
                    />
                );
            })}
        </div>
    );
}

function RenderExpanderItems({
                                 expanderProperty,
                                 index,
                                 selectedCard
                             }: ItemProperty) {
    const [selected, changeSelected] = selectedCard;
    const [messageApi, contextHolder] = message.useMessage();

    function viewExpanderInfo() {
        if (index == selected) {
            changeSelected(-1);
        } else {
            changeSelected(index);
        }
    }

    function copyToClipboard() {
        navigator.clipboard
            .writeText(expanderProperty.value)
            .then(() => {
                messageApi.success('Copied !!!');
            })
            .catch(() => {
                messageApi.error('Error while copying text !!');
            });
    }

    return (
        <div className={'list hover-visibility'}>
            {contextHolder}
            <div onClick={viewExpanderInfo} className={'expander-title'}>
                <h4>
                    {index} . {expanderProperty.key}
                </h4>
                <i
                    style={
                        selected == index
                            ? {rotate: '180deg', visibility: 'unset'}
                            : {}
                    }
                    className={'rotate bi bi-caret-down-fill'}
                ></i>
            </div>
            {index == selected && (
                <div
                    style={{position: 'relative'}}
                    className={'expander-property'}
                >
                    <Tooltip title={'copy to clipboard'} mouseEnterDelay={2}>
                        <i
                            onClick={copyToClipboard}
                            style={{
                                position: 'absolute',
                                aspectRatio: '1/1',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: 5,
                                right: 10,
                                visibility: 'visible'
                            }}
                            className="bi bi-clipboard hover:backdrop-blur"
                        ></i>
                    </Tooltip>
                    <pre
                        className={'monospace'}
                        style={{
                            border: 'none',
                            outline: 'none',
                            overflow: 'scroll',
                            width: '100%'
                        }}
                    >
                        {expanderProperty.value}
                    </pre>
                </div>
            )}
        </div>
    );
}
