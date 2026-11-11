import MigratedUserWelcomeModal from '@components/MigratedUserWelcomeModal';

import Navigation from '@libs/Navigation/Navigation';
import {buildCannedSearchQuery} from '@libs/SearchQueryUtils';

import CONST from '@src/CONST';
import ROUTES from '@src/ROUTES';

import {render} from '@testing-library/react-native';
import React from 'react';

jest.mock('@src/libs/Log');
jest.mock('@components/RenderHTML', () => () => null);
jest.mock('@expensify/react-native-hybrid-app', () => ({
    __esModule: true,
    default: {
        isHybridApp: jest.fn(() => false),
    },
}));
jest.mock('@libs/Navigation/Navigation');
jest.mock('@hooks/useResponsiveLayout', () =>
    jest.fn(() => ({
        isSmallScreenWidth: false,
        shouldUseNarrowLayout: false,
        isInLandscapeNarrowScreen: false,
    })),
);
jest.mock('@hooks/useIsPaidPolicyAdmin', () => jest.fn(() => false));
jest.mock('@hooks/useBeforeRemove', () => jest.fn());
jest.mock('@libs/Accessibility', () => ({
    __esModule: true,
    default: {
        useScreenReaderStatus: () => false,
        useScreenReaderState: () => 'disabled',
        useAutoHitSlop: () => [undefined, jest.fn()],
        useReducedMotion: () => false,
    },
    useReducedMotion: () => false,
    useScreenReaderState: () => 'disabled',
    useAutoHitSlop: () => [undefined, jest.fn()],
}));

let capturedOnBackdropPress: (() => void) | undefined;
let capturedOnClose: (() => void) | undefined;
let capturedOnConfirm: (() => void) | undefined;

jest.mock('@components/CenteredModalLayout', () => ({
    __esModule: true,
    default: ({children, onBackdropPress}: {children: React.ReactNode; onBackdropPress?: () => void}) => {
        capturedOnBackdropPress = onBackdropPress;
        return children;
    },
}));

jest.mock('@components/FeatureTraining', () => {
    const Component = ({children, onConfirm, onClose}: {children: React.ReactNode; onConfirm?: () => void; onClose?: () => void}) => {
        capturedOnConfirm = onConfirm;
        capturedOnClose = onClose;
        return children;
    };
    Component.Illustration = () => null;
    Component.Body = ({children}: {children: React.ReactNode}) => children;
    Component.BodyText = ({children}: {children: React.ReactNode}) => children;
    Component.Title = ({children}: {children: React.ReactNode}) => children;
    Component.Description = ({children}: {children: React.ReactNode}) => children;
    Component.HelpButton = () => null;
    Component.ConfirmButton = () => null;
    return Component;
});

describe('MigratedUserWelcomeModal', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        capturedOnBackdropPress = undefined;
        capturedOnClose = undefined;
        capturedOnConfirm = undefined;
    });

    it('calls Navigation.goBack() without arguments when dismissed via close (X) button', () => {
        render(<MigratedUserWelcomeModal />);

        expect(capturedOnClose).toBeDefined();
        capturedOnClose?.();
        expect(Navigation.goBack).toHaveBeenCalledTimes(1);
        expect(Navigation.goBack).toHaveBeenCalledWith();
    });

    it('calls Navigation.goBack() without arguments when backdrop is pressed', () => {
        render(<MigratedUserWelcomeModal />);

        expect(capturedOnBackdropPress).toBeDefined();
        capturedOnBackdropPress?.();
        expect(Navigation.goBack).toHaveBeenCalledTimes(1);
        expect(Navigation.goBack).toHaveBeenCalledWith();
    });

    it('calls Navigation.goBack with spendRoute when confirm is pressed', () => {
        render(<MigratedUserWelcomeModal />);

        expect(capturedOnConfirm).toBeDefined();
        capturedOnConfirm?.();

        const expectedRoute = ROUTES.SEARCH_ROOT.getRoute({
            query: buildCannedSearchQuery({type: CONST.SEARCH.DATA_TYPES.EXPENSE_REPORT}),
            searchKey: CONST.SEARCH.SEARCH_KEYS.REPORTS,
        });
        expect(Navigation.goBack).toHaveBeenCalledTimes(1);
        expect(Navigation.goBack).toHaveBeenCalledWith(expectedRoute);
    });
});
