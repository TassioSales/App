import {formatSubscriptionEndDate, getNewSubscriptionRenewalDate} from '@pages/settings/Subscription/utils';

import {de} from 'date-fns/locale/de';
import {enUS} from 'date-fns/locale/en-US';
import {nl} from 'date-fns/locale/nl';

jest.mock('@src/libs/Log');
jest.mock('@expensify/react-native-hybrid-app', () => ({
    __esModule: true,
    default: {
        isHybridApp: jest.fn(() => false),
    },
}));

describe('Subscription/utils', () => {
    describe('formatSubscriptionEndDate', () => {
        it('formats Dutch dates with day first', () => {
            expect(formatSubscriptionEndDate('2026-12-20', nl)).toBe('20 december 2026');
        });

        it('formats German dates with day first', () => {
            expect(formatSubscriptionEndDate('2026-06-20', de)).toBe('20. Juni 2026');
        });

        it('formats English dates with month first', () => {
            expect(formatSubscriptionEndDate('2026-12-20', enUS)).toBe('December 20, 2026');
        });

        it('returns empty string when date is empty or undefined', () => {
            expect(formatSubscriptionEndDate(undefined, nl)).toBe('');
            expect(formatSubscriptionEndDate('', nl)).toBe('');
        });
    });

    describe('getNewSubscriptionRenewalDate', () => {
        it('formats renewal date with locale-aware ordering', () => {
            const renewalDateNl = getNewSubscriptionRenewalDate(nl);
            expect(renewalDateNl).toBeTruthy();
        });
    });
});
