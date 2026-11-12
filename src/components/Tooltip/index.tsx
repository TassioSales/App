import React from 'react';

import type {TooltipExtendedProps} from './types';

import BaseTooltip from './BaseTooltip';

function Tooltip({shouldRender = true, children, ...props}: TooltipExtendedProps) {
    return (
        <BaseTooltip
            shouldRender={shouldRender}
            {...props}
        >
            {children}
        </BaseTooltip>
    );
}

export default Tooltip;
