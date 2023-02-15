import { SETTINGS_V_1_0 } from './settingsSchemaV1';

// Remove obsoleted properties
const { whitelist, ...migratedFilters } = SETTINGS_V_1_0['filters'];

export const SETTINGS_V_2_0 = {
    'protocol-version': '2.0',
    'general-settings': SETTINGS_V_1_0['general-settings'],
    'extension-specific-settings': SETTINGS_V_1_0['extension-specific-settings'],
    'filters': {
        ...migratedFilters,
        'allowlist': whitelist,
    },
    'stealth': SETTINGS_V_1_0.stealth,
};

export const EXPORTED_SETTINGS_V_2_0 = {
    'protocol-version': '2.0',
    'general-settings': {
        'allow-acceptable-ads': false,
        'show-blocked-ads-count': true,
        'autodetect-filters': true,
        'safebrowsing-enabled': true,
        'filters-update-period': 86400000,
        'appearance-theme': 'dark',
    },
    'extension-specific-settings': {
        'use-optimized-filters': true,
        'collect-hits-count': false,
        'show-context-menu': true,
        'show-info-about-adguard': false,
        'show-app-updated-info': true,
        'hide-rate-adguard': true,
        'user-rules-editor-wrap': false,
    },
    'filters': {
        'enabled-filters': [1, 2, 3, 4, 6, 11, 14, 16, 17, 224, 1001, 1002],
        'enabled-groups': [0, 1, 2, 3, 4, 5, 6, 7,
        ],
        'custom-filters': [
            {
                'customUrl': 'https://testcases.agrd.dev/Filters/css-rules/css-rules.txt',
                'title': 'Rules for CSS tests',
                'trusted': false,
                'enabled': false,
            },
            {
                'customUrl': 'https://testcases.agrd.dev/Filters/element-hiding-rules/test-element-hiding-rules.txt',
                'title': 'Rules for element hiding rules test',
                'trusted': false,
                'enabled': true,
            },
            {
                'customUrl': 'https://testcases.agrd.dev/Filters/generichide-rules/generichide-rules.txt',
                'title': 'Rules for generic hide tests',
                'trusted': true,
                'enabled': true,
            },
        ],
        'user-filter': {
            'enabled': true,
            'rules': '||example.com^$document\nexample.org###h1',
            'disabled-rules': '',
        },
        'allowlist': {
            'enabled': true,
            'inverted': true,
            'domains': [
                'domain1.com',
                'domain2.com',
            ],
            'inverted-domains': [
                'domain3.com',
                'domain4.com',
            ],
        },
    },
    'stealth': {
        'stealth_disable_stealth_mode': false,
        'stealth-hide-referrer': true,
        'stealth-hide-search-queries': true,
        'stealth-send-do-not-track': true,
        'stealth-block-webrtc': true,
        'stealth-remove-x-client': true,
        'stealth-block-third-party-cookies': true,
        'stealth-block-third-party-cookies-time': 1080,
        'stealth-block-first-party-cookies': true,
        'stealth-block-first-party-cookies-time': 4444,
        'block-known-trackers': true,
        'strip-tracking-parameters': true,
    },
};
