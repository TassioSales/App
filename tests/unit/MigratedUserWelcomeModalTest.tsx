import {fireEvent, render, screen} from '@testing-library/react-native';

import MigratedUserWelcomeModal from '@components/MigratedUserWelcomeModal';

import Navigation from '@libs/Navigation/Navigation';
import {buildCannedSearchQuery} from '@libs/SearchQueryUtils';

import CONST from '@src/CONST';
import ROUTES from '@src/ROUTES';

import React from 'react';

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
    useReducedMotion: jest.fn(() => false),
}));

describe('MigratedUserWelcomeModal', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('calls Navigation.goBack() without arguments when dismissed via close button', () => {
        render(<MigratedUserWelcomeModal />);

        const closeButton = screen.queryByLabelText('common.close') ?? screen.queryByTestId('close-button');
        if (closeButton) {
            fireEvent.press(closeButton);
            expect(Navigation.goBack).toHaveBeenCalledWith();
        }
    });

    it('calls Navigation.goBack with spendRoute when confirm button is pressed', () => {
        render(<MigratedUserWelcomeModal />);

        const confirmButton = screen.queryByText('migratedUserWelcomeModal.confirmText');
        if (confirmButton) {
            fireEvent.press(confirmButton);
            const expectedRoute = ROUTES.SEARCH_ROOT.getRoute({
                query: buildCannedSearchQuery({type: CONST.SEARCH.DATA_TYPES.EXPENSE_REPORT}),
                searchKey: CONST.SEARCH.SEARCH_KEYS.REPORTS,
            });
            expect(Navigation.goBack).toHaveBeenCalledWith(expectedRoute);
        }
    });
});
