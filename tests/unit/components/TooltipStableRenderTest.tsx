import Tooltip from '@components/Tooltip';
import {render} from '@testing-library/react-native';
import React, {useRef} from 'react';
import {Text} from 'react-native';

describe('Tooltip stable DOM hierarchy and layout loop prevention', () => {
    it('does not remount children when shouldRender toggles between false and true', () => {
        let mountCount = 0;

        function MonitoredChild() {
            const isInitialMount = useRef(true);
            if (isInitialMount.current) {
                mountCount += 1;
                isInitialMount.current = false;
            }
            return <Text>Report Cell Content</Text>;
        }

        const {rerender} = render(
            <Tooltip
                text="Report Cell Content"
                shouldRender={false}
            >
                <MonitoredChild />
            </Tooltip>,
        );

        expect(mountCount).toBe(1);

        // Toggle shouldRender to true (as triggered when text truncates onLayout)
        rerender(
            <Tooltip
                text="Report Cell Content"
                shouldRender
            >
                <MonitoredChild />
            </Tooltip>,
        );

        // The child component MUST NOT remount or reset its DOM/React state
        expect(mountCount).toBe(1);

        // Toggle shouldRender back to false (as triggered when wrapper width changes bounds)
        rerender(
            <Tooltip
                text="Report Cell Content"
                shouldRender={false}
            >
                <MonitoredChild />
            </Tooltip>,
        );

        expect(mountCount).toBe(1);
    });
});
