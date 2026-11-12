jest.mock('@expensify/react-native-hybrid-app', () => ({
    isHybridApp: jest.fn(() => false),
}));

import * as MemberActions from '@libs/actions/Policy/Member';
import type {Policy} from '@src/types/onyx';
import * as API from '@src/libs/API';

describe('removeMembers with secondary login cleanup', () => {
    let writeSpy: jest.SpyInstance;

    beforeEach(() => {
        writeSpy = jest.spyOn(API, 'write').mockImplementation(() => Promise.resolve());
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('clears primaryLoginsInvited when the member invited via secondary login is removed', () => {
        const secondaryLogin = 'secondary@example.com';
        const primaryLogin = 'primary@example.com';

        const mockPolicy = {
            id: 'test_policy_1',
            employeeList: {
                [secondaryLogin]: {role: 'user', errors: {}},
                [primaryLogin]: {role: 'user', errors: {}},
                'other@example.com': {role: 'admin', errors: {}},
            },
            primaryLoginsInvited: {
                [secondaryLogin]: primaryLogin,
            },
        } as unknown as Policy;

        // User removes the invited member using the secondary login email
        MemberActions.removeMembers(mockPolicy, [secondaryLogin], []);

        expect(writeSpy).toHaveBeenCalledTimes(1);
        const [, , onyxData] = writeSpy.mock.calls[0];

        // Verify optimisticData clears primaryLoginsInvited
        const optimisticPolicyUpdate = onyxData.optimisticData.find(
            (update: {key: string; value: Record<string, unknown>}) => update.key === 'policy_test_policy_1' && update.value.primaryLoginsInvited !== undefined,
        );
        expect(optimisticPolicyUpdate).toBeDefined();
        expect(optimisticPolicyUpdate.value.primaryLoginsInvited).toBeNull();

        // Verify successData also clears primaryLoginsInvited
        const successPolicyUpdate = onyxData.successData.find(
            (update: {key: string; value: Record<string, unknown>}) => update.key === 'policy_test_policy_1' && update.value.primaryLoginsInvited !== undefined,
        );
        expect(successPolicyUpdate).toBeDefined();
        expect(successPolicyUpdate.value.primaryLoginsInvited).toBeNull();
    });

    it('clears only the deleted member when other members with secondary logins remain', () => {
        const secondaryLogin1 = 'sec1@example.com';
        const primaryLogin1 = 'prim1@example.com';
        const secondaryLogin2 = 'sec2@example.com';
        const primaryLogin2 = 'prim2@example.com';

        const mockPolicy = {
            id: 'test_policy_2',
            employeeList: {
                [secondaryLogin1]: {role: 'user', errors: {}},
                [primaryLogin1]: {role: 'user', errors: {}},
                [secondaryLogin2]: {role: 'user', errors: {}},
                [primaryLogin2]: {role: 'user', errors: {}},
            },
            primaryLoginsInvited: {
                [secondaryLogin1]: primaryLogin1,
                [secondaryLogin2]: primaryLogin2,
            },
        } as unknown as Policy;

        // User removes only user 1
        MemberActions.removeMembers(mockPolicy, [secondaryLogin1], []);

        expect(writeSpy).toHaveBeenCalledTimes(1);
        const [, , onyxData] = writeSpy.mock.calls[0];

        // Verify optimisticData clears only secondaryLogin1
        const optimisticPolicyUpdate = onyxData.optimisticData.find(
            (update: {key: string; value: Record<string, unknown>}) => update.key === 'policy_test_policy_2' && update.value.primaryLoginsInvited !== undefined,
        );
        expect(optimisticPolicyUpdate).toBeDefined();
        expect(optimisticPolicyUpdate.value.primaryLoginsInvited).toEqual({
            [secondaryLogin1]: null,
        });

        // Verify successData clears only secondaryLogin1
        const successPolicyUpdate = onyxData.successData.find(
            (update: {key: string; value: Record<string, unknown>}) => update.key === 'policy_test_policy_2' && update.value.primaryLoginsInvited !== undefined,
        );
        expect(successPolicyUpdate).toBeDefined();
        expect(successPolicyUpdate.value.primaryLoginsInvited).toEqual({
            [secondaryLogin1]: null,
        });
    });
});
