import { SettingsConfig } from '@adguard/tswebextension';
import metadata from '../../Extension/filters/chromium/filters.json';
import i18nMetadata from '../../Extension/filters/chromium/filters_i18n.json';
import { GetStatisticsDataResponse } from '../../Extension/src/background/api';

import {
    metadataValidator,
    i18nMetadataValidator,
    Config,
    SettingOption,
    PageStatsData,
    Metadata,
    I18nMetadata,
    RootOption,
    PROTOCOL_VERSION,
    GeneralSettingsOption,
    ExtensionSpecificSettingsOption,
    FiltersOption,
    UserFilterOption,
    AllowlistOption,
    StealthOption,
    CustomFilterOption,
} from '../../Extension/src/background/schema';
import { PageStatsStorage } from '../../Extension/src/background/storages';
import { defaultSettings } from '../../Extension/src/common/settings';
import { UserAgent } from '../../Extension/src/common/user-agent';

export const getMetadataFixture = (): Metadata => metadataValidator.parse(metadata);

export const getI18nMetadataFixture = (): I18nMetadata => i18nMetadataValidator.parse(i18nMetadata);

export const getFilterTextFixture = (): string => `
example.org##h1\n
!#if !adguard\n
adguard.com##h1\n
!#endif\n
example.org##p\n`;

const currentDateWithoutMS = new Date().toISOString().slice(0, -5);
export const filterNameFixture = 'AdGuard Fixture Filter';
export const filterTextFixture = `
! Title: ${filterNameFixture}
! Description: Mock filter
! Version: 1.0.0.0
! TimeUpdated: ${currentDateWithoutMS}+00:00
! Expires: 7 days (update frequency)
||example.org^$document`;

export const getDefaultExportFixture = (): Config => ({
    [RootOption.ProtocolVersion]: PROTOCOL_VERSION,
    [RootOption.GeneralSettings]: {
        [GeneralSettingsOption.AllowAcceptableAds]: true,
        [GeneralSettingsOption.ShowBlockedAdsCount]: true,
        [GeneralSettingsOption.AutodetectFilters]: true,
        [GeneralSettingsOption.SafebrowsingEnabled]: false,
        [GeneralSettingsOption.FiltersUpdatePeriod]: -1,
        [GeneralSettingsOption.AppearanceTheme]: 'system',
    },
    [RootOption.ExtensionSpecificSettings]: {
        [ExtensionSpecificSettingsOption.UseOptimizedFilters]: false,
        [ExtensionSpecificSettingsOption.CollectHitsCount]: false,
        [ExtensionSpecificSettingsOption.ShowContextMenu]: true,
        [ExtensionSpecificSettingsOption.ShowInfoAboutAdguard]: true,
        [ExtensionSpecificSettingsOption.ShowAppUpdatedInfo]: true,
        [ExtensionSpecificSettingsOption.HideRateAdguard]: false,
        [ExtensionSpecificSettingsOption.UserRulesEditorWrap]: false,
    },
    [RootOption.Filters]: {
        [FiltersOption.EnabledFilters]: [2, 10],
        [FiltersOption.EnabledGroups]: [0, 1, 6, 7],
        [FiltersOption.CustomFilters]: [],
        [FiltersOption.UserFilter]: {
            [UserFilterOption.Enabled]: true,
            [UserFilterOption.Rules]: '',
            [UserFilterOption.DisabledRules]: '',
        },
        [FiltersOption.Allowlist]: {
            [AllowlistOption.Enabled]: true,
            [AllowlistOption.Inverted]: false,
            [AllowlistOption.Domains]: [],
            [AllowlistOption.InvertedDomains]: [],
        },
    },
    [RootOption.Stealth]: {
        [StealthOption.DisableStealthMode]: true,
        [StealthOption.HideReferrer]: true,
        [StealthOption.HideSearchQueries]: true,
        [StealthOption.SendDoNotTrack]: true,
        [StealthOption.BlockWebRTC]: false,
        [StealthOption.RemoveXClientData]: UserAgent.isChrome,
        [StealthOption.SelfDestructThirdPartyCookies]: true,
        [StealthOption.SelfDestructThirdPartyCookiesTime]: 2880,
        [StealthOption.SelfDestructFirstPartyCookies]: false,
        [StealthOption.SelfDestructFirstPartyCookiesTime]: 4320,
        [StealthOption.BlockKnownTrackers]: false,
        [StealthOption.StripTrackingParams]: false,
    },
});

export const getCustomExportFixture = (): Config => ({
    [RootOption.ProtocolVersion]: PROTOCOL_VERSION,
    [RootOption.GeneralSettings]: {
        [GeneralSettingsOption.AllowAcceptableAds]: false,
        [GeneralSettingsOption.ShowBlockedAdsCount]: false,
        [GeneralSettingsOption.AutodetectFilters]: false,
        [GeneralSettingsOption.SafebrowsingEnabled]: true,
        [GeneralSettingsOption.FiltersUpdatePeriod]: 3600000,
        [GeneralSettingsOption.AppearanceTheme]: 'dark',
    },
    [RootOption.ExtensionSpecificSettings]: {
        [ExtensionSpecificSettingsOption.UseOptimizedFilters]: true,
        [ExtensionSpecificSettingsOption.CollectHitsCount]: true,
        [ExtensionSpecificSettingsOption.ShowContextMenu]: true,
        [ExtensionSpecificSettingsOption.ShowInfoAboutAdguard]: false,
        [ExtensionSpecificSettingsOption.ShowAppUpdatedInfo]: true,
        [ExtensionSpecificSettingsOption.HideRateAdguard]: true,
        [ExtensionSpecificSettingsOption.UserRulesEditorWrap]: false,
    },
    [RootOption.Filters]: {
        [FiltersOption.EnabledFilters]: [1, 2, 3, 4, 7, 13, 14, 15, 17, 242, 1000],
        [FiltersOption.EnabledGroups]: [0, 1, 2, 3, 4, 5, 6, 7],
        [FiltersOption.CustomFilters]: [{
            // eslint-disable-next-line max-len
            [CustomFilterOption.CustomUrl]: 'https://testcases.agrd.dev/Filters/element-hiding-rules/test-element-hiding-rules.txt',
            [CustomFilterOption.Title]: 'Rules for element hiding rules test',
            [CustomFilterOption.Trusted]: true,
            [CustomFilterOption.Enabled]: true,
        },
        {
            // eslint-disable-next-line max-len
            [CustomFilterOption.CustomUrl]: 'https://testcases.agrd.dev/Filters/generichide-rules/generichide-rules.txt',
        }],
        [FiltersOption.UserFilter]: {
            [UserFilterOption.Enabled]: true,
            // eslint-disable-next-line max-len
            [UserFilterOption.Rules]: 'example.org##body\n||mail.ru^$first-party\nchampionat.com##.header\n\n\n!\n! Title: Rules for simple rules tests\n! Filter to be used for testing purposes\n! https://testcases.adguard.com\n! Hide warning\ntestcases.adguard.com,surge.sh###subscribe-to-test-simple-rules-filter\n! Test case 1: domain-specific elemhide rule\ntestcases.adguard.com,surge.sh###case-1-elemhide > .test-banner\n! Test case 2: generic elemhide rule\n###case-2-generic-elemhide > .test-banner\n! Test case 3: elemhide rule exception\n###case-3-elemhide-exception > .test-banner\ntestcases.adguard.com,surge.sh#@##case-3-elemhide-exception > .test-banner\n! Test case 3: wildcard exception\ntestcases.adguard.com,surge.sh###case-3-elemhide-exception > h1\n*#@##case-3-elemhide-exception > h1\n! Test case 3: generic exception\ntestcases.adguard.com,surge.sh###case-3-elemhide-exception > h2\n#@##case-3-elemhide-exception > h2\n! Test case 3: generic exception for generic elemhide\n###case-3-elemhide-exception > h3\n#@##case-3-elemhide-exception > h3\n! Test case 4: domain exclusion\n~testcases.adguard.com,~surge.sh###case-4-domain-exclusion > .test-banner\n! Test case 5: wildcard for tld\ntestcases.adguard.*,surge.*###case-5-wildcard-for-tld > .test-banner\n! Test case 6: wildcard for tld support with $domain modifier\n||*/tld-test-files/$image,domain=testcases.adguard.*|surge.*\n||*/tld*$script,domain=testcases.adguard.*|surge.*\n! Test case 6: $third-party modifier\n||antibanner.net^$third-party\n! Title: Rules for extended css rules test\ntestcases.adguard.com,surge.sh###subscribe-to-test-extended-css-rules-filter\ntestcases.adguard.com,surge.sh#?##case1.banner:has(a.banner-link)\ntestcases.adguard.com,surge.sh#?##case2.banner:contains(Click Me!)\ntestcases.adguard.com,surge.sh#?##case3.banner:matches-css(opacity: 0.9)\ntestcases.adguard.com,surge.sh#?##case4.banner:matches-css-after(content: sponsored)\ntestcases.adguard.com,surge.sh#?##case5.banner:matches-css-before(content: sponsored)\ntestcases.adguard.com,surge.sh#?##case6.banner:has-text(You would want to click me for sure!)\ntestcases.adguard.com,surge.sh#?##case7.banner:-abp-has(a.banner-link)\ntestcases.adguard.com,surge.sh#?##case8.banner:contains(Click Me!)\ntestcases.adguard.com,surge.sh#?##case9.banner:contains(/[aа]{20,}/)\ntestcases.adguard.com,surge.sh#?##case10.banner:matches-css(background-image: /url\\(data\\:image\\/svg\\+xml;base64,[A-Za-z0-9]{100,}/)\ntestcases.adguard.com,surge.sh#?##case11.banner:matches-css-after(background-image: /url\\(data\\:image\\/svg\\+xml;base64,[A-Za-z0-9]{100,}/)\ntestcases.adguard.com,surge.sh#?##case12.banner:matches-css-before(background-image: /url\\(data\\:image\\/svg\\+xml;base64,[A-Za-z0-9]{100,}/)\ntestcases.adguard.com,surge.sh#?#body #case13.banner[-ext-has=“a.banner-link”]\ntestcases.adguard.com,surge.sh#?#.container > #case14.banner[-ext-contains=“/[aа]{20,}/“]\ntestcases.adguard.com,surge.sh#?##case14 + #case15.banner[-ext-matches-css-after=“content:sponsored”]\ntestcases.adguard.com,surge.sh#?##case1 ~ #case16.banner[-ext-matches-css-before=“content:sponsored”]\ntestcases.adguard.com,surge.sh#?#*:contains(/absolute[\\s\\S]*-\\d{4}/) + * > .banner:contains(/а/) ~ #case17.banner:has(> div:contains(/а/):nth-child(100n + 2))\ntestcases.adguard.com,surge.sh#?#.test-xpath-case18:xpath(//*[@class=“test-case18-div”]/../..)\ntestcases.adguard.com,surge.sh#?#.test-nth-ancestor-case19:nth-ancestor(3)\ntestcases.adguard.com,surge.sh#?#.test-upward-selector:upward(#case20)\ntestcases.adguard.com,surge.sh#?#.test-upward-number-case21:upward(4)\n! Case 22\ntestcases.adguard.com,surge.sh#?##inframe1:has(.content)\ntestcases.adguard.com,surge.sh#?##case23 > div:contains(/kick me!|\\(18\\+\\)|https:\\/\\/vk.cc|testTEXT|vk.com\\/test_id/)\ntestcases.adguard.com,surge.sh#?##case24 > div:matches-attr(“/^data-.{4}$/“=”/banner/“)\ntestcases.adguard.com,surge.sh#?##case25 > div:matches-property(“id”=“/property-match/“)\ntestcases.adguard.com,surge.sh#?##case26:remove()\ntestcases.adguard.com,surge.sh#$?##case27:has(div) { remove: true; }\ntestcases.adguard.com,surge.sh#?##case28 > :is(.case28, #main, footer, span):contains(isTest)\n! Title: Rules for $important rules test\ntestcases.adguard.com,surge.sh###subscribe-to-test-important-rules-filter\n! Case 1\n||*/test-files/adg1.png$important\n@@||*/test-files/adg1.png\n! Case 2\n||*/test-files/adg2.png$important\n@@||*/test-files/adg2.png$important\n! Title: Rules for $replace rules test\ntestcases.adguard.com,surge.sh###subscribe-to-test-replace-rules-filter\n! Case 1: text response\n||testcases.adguard.com/*/case1-text-response.txt$replace=/adguard/Test passed/i\n||surge.sh/*/case1-text-response.txt$replace=/adguard/Test passed/i\n! Case 2: response is more then 3MB\n||testcases.adguard.com/*/case2-response-over-3mb.txt$replace=/Adguard/Replaced/i\n||surge.sh/*/case2-response-over-3mb.txt$replace=/Adguard/Replaced/i\n! Case 3: using with other rules (without $replace modifier) for a same request\n||testcases.adguard.com/*/case3-using-with-other-rules.txt$replace=/adguard/Test passed/i\n||surge.sh/*/case3-using-with-other-rules.txt$replace=/adguard/Test passed/i\n||testcases.adguard.com/*/case3-using-with-other-rules.txt\n||surge.sh/*/case3-using-with-other-rules.txt\n! Case 4: multiple $replace rules matching a single request\n||testcases.adguard.com/*/case4-multiple-replace-rules.txt$replace=/adguard/first replace rule work/i\n||surge.sh/*/case4-multiple-replace-rules.txt$replace=/adguard/first replace rule work/i\n||testcases.adguard.com/*/case4-multiple-replace-rules.txt$replace=/team/and second as well/i\n||surge.sh/*/case4-multiple-replace-rules.txt$replace=/team/and second as well/i\n! Case 5: disabling $replace rules\n||testcases.adguard.com/*/case5-disabling-replace-rule.txt$replace=/adguard/first replace rule works/i\n||surge.sh/*/case5-disabling-replace-rule.txt$replace=/adguard/first replace rule works/i\n||testcases.adguard.com/*/case5-disabling-replace-rule.txt$replace=/team/and second as well/i\n||surge.sh/*/case5-disabling-replace-rule.txt$replace=/team/and second as well/i\n@@||testcases.adguard.com/*/case5-disabling-replace-rule.txt$replace\n@@||surge.sh/*/case5-disabling-replace-rule.txt$replace\n! Case 6: multiple $replace rules\n||testcases.adguard.com/*/case6-disabling-multiple-replace-rules.txt$replace=/adguard/first replace rule/i\n||surge.sh/*/case6-disabling-multiple-replace-rules.txt$replace=/adguard/first replace rule/i\n||testcases.adguard.com/*/case6-disabling-multiple-replace-rules.txt$replace=/works/works and second as well/i\n||surge.sh/*/case6-disabling-multiple-replace-rules.txt$replace=/works/works and second as well/i\n@@||testcases.adguard.com/*/case6-disabling-multiple-replace-rules.txt$replace=/works/works and second as well/i\n@@||surge.sh/*/case6-disabling-multiple-replace-rules.txt$replace=/works/works and second as well/i\n! Case 7: using with $script exception modifier for a same request\n||testcases.adguard.com/*/case7-content-type-modifier.js$replace=/tmp\\s+\\=\\s+0/tmp = 1/i\n||surge.sh/*/case7-content-type-modifier.js$replace=/tmp\\s+\\=\\s+0/tmp = 1/i\n||testcases.adguard.com/*/case7-content-type-modifier.js$script\n||surge.sh/*/case7-content-type-modifier.js$script',
            [UserFilterOption.DisabledRules]: '',
        },
        [FiltersOption.Allowlist]: {
            [AllowlistOption.Enabled]: true,
            [AllowlistOption.Inverted]: false,
            [AllowlistOption.Domains]: ['domain1.com', 'domain2.com'],
            [AllowlistOption.InvertedDomains]: ['domain3.com', 'domain4.com'],
        },
    },
    [RootOption.Stealth]: {
        [StealthOption.DisableStealthMode]: false,
        [StealthOption.HideReferrer]: true,
        [StealthOption.HideSearchQueries]: true,
        [StealthOption.SendDoNotTrack]: true,
        [StealthOption.BlockWebRTC]: true,
        [StealthOption.RemoveXClientData]: true,
        [StealthOption.SelfDestructThirdPartyCookies]: true,
        [StealthOption.SelfDestructThirdPartyCookiesTime]: 3333,
        [StealthOption.SelfDestructFirstPartyCookies]: true,
        [StealthOption.SelfDestructFirstPartyCookiesTime]: 8888,
        [StealthOption.BlockKnownTrackers]: true,
        [StealthOption.StripTrackingParams]: true,
    },
});

export const getDefaultSettingsConfigFixture = (
    documentBlockingPageUrl: string,
    assistantUrl: string,
): SettingsConfig => ({
    assistantUrl,
    documentBlockingPageUrl,
    collectStats: !defaultSettings[SettingOption.DisableCollectHits],
    allowlistInverted: !defaultSettings[SettingOption.DefaultAllowlistMode],
    allowlistEnabled: defaultSettings[SettingOption.AllowlistEnabled],
    stealthModeEnabled: !defaultSettings[SettingOption.DisableStealthMode],
    filteringEnabled: !defaultSettings[SettingOption.DisableFiltering],
    stealth: {
        blockChromeClientData: defaultSettings[SettingOption.RemoveXClientData],
        hideReferrer: defaultSettings[SettingOption.HideReferrer],
        hideSearchQueries: defaultSettings[SettingOption.HideSearchQueries],
        sendDoNotTrack: defaultSettings[SettingOption.SendDoNotTrack],
        blockWebRTC: defaultSettings[SettingOption.BlockWebRTC],
        selfDestructThirdPartyCookies: defaultSettings[SettingOption.SelfDestructThirdPartyCookies],
        selfDestructThirdPartyCookiesTime: (
            defaultSettings[SettingOption.SelfDestructThirdPartyCookiesTime]
        ),
        selfDestructFirstPartyCookies: defaultSettings[SettingOption.SelfDestructFirstPartyCookies],
        selfDestructFirstPartyCookiesTime: (
            defaultSettings[SettingOption.SelfDestructFirstPartyCookiesTime]
        ),
    },
});

export const getEmptyPageStatsDataFixture = (
    updated: number,
): PageStatsData => {
    const emptyStats = { [PageStatsStorage.TOTAL_GROUP_ID]: 0 };
    return {
        hours: Array(PageStatsStorage.MAX_HOURS_HISTORY).fill(emptyStats),
        days: Array(PageStatsStorage.MAX_DAYS_HISTORY).fill(emptyStats),
        months: Array(PageStatsStorage.MAX_MONTHS_HISTORY).fill(emptyStats),
        updated,
    };
};

export const getEmptyStatisticDataFixture = (): GetStatisticsDataResponse => {
    const emptyStats = { [PageStatsStorage.TOTAL_GROUP_ID]: 0 };

    return {
        today: Array(24).fill(emptyStats),
        lastWeek: Array(7).fill(emptyStats),
        lastMonth: Array(30).fill(emptyStats),
        lastYear: Array(3).fill(emptyStats),
        overall: Array(3).fill(emptyStats),
        blockedGroups: [
            { groupId: 'total', groupName: 'popup_statistics_total' },
            { displayNumber: 1, groupId: 1, groupName: 'Ad Blocking' },
            { displayNumber: 2, groupId: 2, groupName: 'Privacy' },
            { displayNumber: 3, groupId: 3, groupName: 'Social Widgets' },
            { displayNumber: 4, groupId: 4, groupName: 'Annoyances' },
            { displayNumber: 5, groupId: 5, groupName: 'Security' },
            { displayNumber: 6, groupId: 6, groupName: 'Other' },
            { displayNumber: 7, groupId: 7, groupName: 'Language-specific' },
            {
                groupId: 0,
                displayNumber: 99,
                groupName: 'options_antibanner_custom_group',
            },
        ],
    };
};

export const SETTINGS_V_1_0 = {
    'protocol-version': '1.0',
    'general-settings': {
        'allow-acceptable-ads': true,
        'show-blocked-ads-count': true,
        'autodetect-filters': true,
        'safebrowsing-enabled': false,
        'filters-update-period': -1,
        'appearance-theme': 'system',
    },
    'extension-specific-settings': {
        'use-optimized-filters': false,
        'collect-hits-count': false,
        'show-context-menu': true,
        'show-info-about-adguard': false,
        'show-app-updated-info': true,
        'hide-rate-adguard': true,
        'user-rules-editor-wrap': false,
    },
    'filters': {
        'enabled-filters': [
            2,
            10,
        ],
        'enabled-groups': [
            0,
            1,
            6,
            7,
        ],
        'custom-filters': [],
        'user-filter': {
            'enabled': true,
            'rules': '',
            'disabled-rules': '',
        },
        'whitelist': {
            'enabled': false,
            'inverted': false,
            'domains': [
                'allowdomain.com',
                'allowdomain.net',
            ],
            'inverted-domains': [
                'invertedallowlist.com',
            ],
        },
    },
    'stealth': {
        'stealth_disable_stealth_mode': true,
        'stealth-hide-referrer': true,
        'stealth-hide-search-queries': true,
        'stealth-send-do-not-track': true,
        'stealth-block-webrtc': false,
        'stealth-remove-x-client': true,
        'stealth-block-third-party-cookies': true,
        'stealth-block-third-party-cookies-time': 2880,
        'stealth-block-first-party-cookies': false,
        'stealth-block-first-party-cookies-time': 4320,
        'block-known-trackers': false,
        'strip-tracking-parameters': false,
    },
};

export const SETTINGS_V_2_0 = {
    'general-settings': SETTINGS_V_1_0['general-settings'],
    'extension-specific-settings': SETTINGS_V_1_0['extension-specific-settings'],
    'stealth': SETTINGS_V_1_0.stealth,
    'protocol-version': '2.0',
    'filters': {
        'enabled-filters': SETTINGS_V_1_0.filters['enabled-filters'],
        'enabled-groups': SETTINGS_V_1_0.filters['enabled-groups'],
        'custom-filters': SETTINGS_V_1_0.filters['custom-filters'],
        'user-filter': SETTINGS_V_1_0.filters['user-filter'],
        'allowlist': {
            ...SETTINGS_V_1_0.filters.whitelist,
        },
    },
};
