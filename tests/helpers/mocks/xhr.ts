import sinon from 'sinon';
import { RootOption, FiltersOption } from '../../../Extension/src/background/schema';
import { I18N_METADATA_FILE_NAME, METADATA_FILE_NAME } from '../../../Extension/src/common/constants';

import {
    getMetadataFixture,
    getI18nMetadataFixture,
    getFilterTextFixture,
    filterTextFixture,
    getCustomExportFixture,
    SETTINGS_V_1_0,
} from '../fixtures';

const metadata = getMetadataFixture();
const i18nMetadata = getI18nMetadataFixture();
const filterText = getFilterTextFixture();

export const mockFilterPath = 'test-filter.txt';

/**
 * Mocks all xhr requests via {@link sinon.SinonFakeServer}
 *
 * @returns xhr fake server
 */
export const mockXhrRequests = (): sinon.SinonFakeServer => {
    const server = sinon.fakeServer.create({
        respondImmediately: true,
    });

    server.respondWith('GET', new RegExp(`/${METADATA_FILE_NAME}`), [
        200,
        { 'Content-Type': 'application/json' },
        JSON.stringify(metadata),
    ]);

    server.respondWith('GET', new RegExp(`/${I18N_METADATA_FILE_NAME}`), [
        200,
        { 'Content-Type': 'application/json' },
        JSON.stringify(i18nMetadata),
    ]);

    server.respondWith('GET', /\/alert-popup.css/, [
        200,
        { 'Content-Type': 'text/plain' },
        '',
    ]);

    server.respondWith('GET', /\/alert-container.css/, [
        200,
        { 'Content-Type': 'text/plain' },
        '',
    ]);

    server.respondWith('GET', /\/update-container.css/, [
        200,
        { 'Content-Type': 'text/plain' },
        '',
    ]);

    server.respondWith('GET', new RegExp(`/${mockFilterPath}`), [
        200,
        { 'Content-Type': 'text/plain' },
        filterText,
    ]);

    // Simulate filters bodies for successfully emulate initialization of App
    // with provided enabled filters
    server.respondWith('GET', /\/filter_(mobile_)?\d+.txt/, [
        200,
        { 'Content-Type': 'text/plain' },
        filterTextFixture,
    ]);

    // Simulate filters bodies for successfully emulate initialization of App
    // with provided enabled filters
    server.respondWith('GET', /\/filters\/\d+(_optimized)?.txt/, [
        200,
        { 'Content-Type': 'text/plain' },
        filterTextFixture,
    ]);

    const customFiltersFixture = getCustomExportFixture()[RootOption.Filters][FiltersOption.CustomFilters];
    const customFiltersFixture2 = SETTINGS_V_1_0['filters']['custom-filters'];

    const customFiltersUrls = [
        ...customFiltersFixture.map(({ customUrl }) => customUrl),
        ...customFiltersFixture2.map(({ customUrl }) => customUrl),
    ];

    // Filter only uniq urls
    Array.from(new Set(customFiltersUrls))
        // Dynamically create mocks for each custom filter urls
        .forEach((customUrl: string) => {
            // Somehow exact mock with customUrl doesn't work, so create regexp-mask
            // with url part after last slash.
            const mockAddr = customUrl.slice(customUrl.lastIndexOf('/'));
            server.respondWith('GET', new RegExp(mockAddr), [
                200,
                { 'Content-Type': 'text/plain' },
                filterTextFixture,
            ]);
        });

    return server;
};
