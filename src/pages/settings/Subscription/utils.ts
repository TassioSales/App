import DateUtils from '@libs/DateUtils';

import type PrivatePromoDiscount from '@src/types/onyx/PrivatePromoDiscount';

import type {Locale as DateFnsLocale} from 'date-fns';

import {addMonths, startOfMonth} from 'date-fns';

type PrivatePromoDiscountInfo = {
    isSecretPromoCode: boolean;
    promoDiscountValue: number | undefined;
};

function getPrivatePromoDiscountInfo(privatePromoDiscount: PrivatePromoDiscount | null | undefined, isAnnual: boolean): PrivatePromoDiscountInfo {
    if (typeof privatePromoDiscount === 'number') {
        return {
            isSecretPromoCode: false,
            promoDiscountValue: privatePromoDiscount,
        };
    }

    if (!privatePromoDiscount) {
        return {
            isSecretPromoCode: false,
            promoDiscountValue: undefined,
        };
    }

    const promoDiscountValue = isAnnual ? privatePromoDiscount.yearlySubscriptionDiscount : privatePromoDiscount.monthlySubscriptionDiscount;

    return {
        isSecretPromoCode: !!privatePromoDiscount.isSecretPromoCode,
        promoDiscountValue,
    };
}

function formatSubscriptionEndDate(date: string | undefined, dateFnsLocale: DateFnsLocale | undefined): string {
    if (!date) {
        return '';
    }

    return DateUtils.formatToLongDateInUTC(date, dateFnsLocale);
}

function getNewSubscriptionRenewalDate(dateFnsLocale: DateFnsLocale | undefined): string {
    return DateUtils.formatToLongDateInUTC(startOfMonth(addMonths(new Date(), 12)).toISOString(), dateFnsLocale);
}

export {getNewSubscriptionRenewalDate, formatSubscriptionEndDate, getPrivatePromoDiscountInfo};
