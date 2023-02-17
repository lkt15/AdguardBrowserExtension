/**
 * @file
 * This file is part of AdGuard Browser Extension (https://github.com/AdguardTeam/AdguardBrowserExtension).
 *
 * AdGuard Browser Extension is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * AdGuard Browser Extension is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with AdGuard Browser Extension. If not, see <http://www.gnu.org/licenses/>.
 */
import { FilterUpdateApi } from '../api';

/**
 * Service for scheduling filters update checks.
 *
 * It delays update check on initialization on {@link INIT_DELAY_MS 5 min}.
 * After initialization scheduler checks filter updates
 * {@link CHECK_PERIOD_MS every 30 minutes}.
 */
export class FilterUpdateService {
    /**
     * Delay for checking filters updates on the first run of application -
     * 5 minutes.
     */
    private static readonly INIT_DELAY_MS = 1000 * 60 * 5; // 5 min

    /**
     * Checking period - 30 minutes.
     */
    private static readonly CHECK_PERIOD_MS = 1000 * 60 * 30; // 30 min

    /**
     * Stores scheduler timer id for checking update in every
     * {@link CHECK_PERIOD_MS} time.
     */
    private schedulerTimerId: number | undefined;

    /**
     * Creates new {@link FilterUpdateService}.
     */
    constructor() {
        this.update = this.update.bind(this);
    }

    /**
     * Schedules filters update check for every {@link CHECK_PERIOD_MS} period.
     * And if this is a first run, then updates filters with
     * {@link INIT_DELAY_MS} timeout.
     *
     * @param isFirstRun Is the first run of the application or not.
     */
    public async init(isFirstRun: boolean): Promise<void> {
        this.schedulerTimerId = window.setTimeout(async () => {
            await this.update();
        }, FilterUpdateService.CHECK_PERIOD_MS);

        if (!isFirstRun) {
            return;
        }

        // Schedule update filters on the first run
        window.setTimeout(async () => {
            await FilterUpdateApi.autoUpdateFilters(isFirstRun);
        }, FilterUpdateService.INIT_DELAY_MS);
    }

    /**
     * Checks every {@link CHECK_PERIOD_MS} period whether the enabled filters
     * should be updated with setTimeout which saved to {@link schedulerTimerId}.
     */
    private async update(): Promise<void> {
        window.clearTimeout(this.schedulerTimerId);

        await FilterUpdateApi.autoUpdateFilters();

        this.schedulerTimerId = window.setTimeout(async () => {
            await this.update();
        }, FilterUpdateService.CHECK_PERIOD_MS);
    }
}

export const filterUpdateService = new FilterUpdateService();
