import Text from '@components/Text';
import Tooltip from '@components/Tooltip';

import {COPYABLE_TEXT_DATA_SET} from '@libs/SelectionScraper';

import React, {useState} from 'react';

import type TextWithTooltipProps from './types';

type LayoutChangeEvent = {
    target: HTMLElement;
};

function TextWithTooltip({testID, text, shouldShowTooltip, style, numberOfLines = 1, forwardedFSClass, isSelectable = false}: TextWithTooltipProps) {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <Tooltip
            shouldRender={showTooltip}
            text={text}
        >
            <Text
                testID={testID}
                style={style}
                numberOfLines={numberOfLines}
                selectable={isSelectable}
                onLayout={(e) => {
                    const target = (e.nativeEvent as unknown as LayoutChangeEvent).target;
                    if (!shouldShowTooltip) {
                        return;
                    }
                    const isTruncated = target.scrollWidth - target.offsetWidth > 1 || target.scrollHeight - target.offsetHeight > 1;
                    setShowTooltip((prev) => (prev !== isTruncated ? isTruncated : prev));
                }}
                fsClass={forwardedFSClass}
                dataSet={isSelectable ? COPYABLE_TEXT_DATA_SET : undefined}
            >
                {text}
            </Text>
        </Tooltip>
    );
}

export default TextWithTooltip;
