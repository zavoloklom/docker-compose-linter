/*
import { version as currentVersion } from '../../package.json';
import { LOG_SOURCE, Logger } from './logger.js';

async function checkForUpdates() {
    const logger = Logger.getInstance();
    try {
        const response = await fetch('https://registry.npmjs.org/docker-compose-linter');
        const data = await response.json();

        const latestVersion = data['dist-tags'].latest;

        if (currentVersion !== latestVersion) {
            logger.info(`A new release of docker-compose-linter is available: v${currentVersion} -> v${latestVersion}`);
            logger.info(`Update it by running: npm install -g docker-compose-linter`);
        } else {
            logger.debug(LOG_SOURCE.UTIL, 'You are using the latest version of docker-compose-linter.');
        }
    } catch (error) {
        logger.debug(LOG_SOURCE.UTIL, 'Failed to check for updates:', error);
    }
}

export { checkForUpdates }
*/
