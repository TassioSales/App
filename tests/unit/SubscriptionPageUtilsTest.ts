import {formatSubscriptionEndDate, getNewSubscriptionRenewalDate} from '@pages/settings/Subscription/utils';

import {nl, de, es, enUS} from 'date-fns/locale';

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
            expect(renewalDateNl).toMatch(/^\d{1,2}\s+[a-z]+\s+\d{4}$/);
        });
    });
});
