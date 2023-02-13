import sinon from 'sinon';
import { I18N_METADATA_FILE_NAME, METADATA_FILE_NAME } from '../../../tools/constants';

import {
    getMetadataFixture,
    getI18nMetadataFixture,
    getFilterTextFixture,
    filterTextFixture,
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
        { 'Content-Type': 'application/text' },
        '',
    ]);

    server.respondWith('GET', /\/alert-container.css/, [
        200,
        { 'Content-Type': 'application/text' },
        '',
    ]);

    server.respondWith('GET', /\/update-container.css/, [
        200,
        { 'Content-Type': 'application/text' },
        '',
    ]);

    server.respondWith('GET', new RegExp(`/${mockFilterPath}`), [
        200,
        { 'Content-Type': 'application/text' },
        filterText,
    ]);

    // Simulate filters bodies for successfully emulate initialization of App
    // with provided enabled filters
    server.respondWith('GET', /\/filter_(mobile_)?\d+.txt/, [
        200,
        { 'Content-Type': 'application/text' },
        filterTextFixture,
    ]);

    return server;
};
