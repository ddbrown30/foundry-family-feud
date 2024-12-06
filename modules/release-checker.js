import * as FFF_CONFIG from "./fff-config.js";
import { Utils } from "./utils.js";

export class ReleaseChecker {

    static async checkForNewRelease() {
        const lastGitRequestTimestamp = Utils.getSetting(FFF_CONFIG.SETTING_KEYS.lastGitCheck) ?? 0;
        const minTimeBetweenChecks = 3600000; //1 hour
        if (Date.now() - lastGitRequestTimestamp < minTimeBetweenChecks) {
            return;
        }

        let latestRelease = await ReleaseChecker.getLatestRelease();
        let module = game.modules.get(FFF_CONFIG.NAME);
        if (foundry.utils.isNewerVersion(latestRelease.version, module.version)) {
            ReleaseChecker.showNewVersionDialog(latestRelease, module);
        }
        
        Utils.setSetting(FFF_CONFIG.SETTING_KEYS.lastGitCheck, Date.now());
    }

    static async getLatestRelease() {
        const releases = await ReleaseChecker.getAllReleasesFromGitHub();
        if (!releases) return null;
        const latestRelease = Object.keys(releases).sort((a, b) => foundry.utils.isNewerVersion(b, a))[0];
        if (!latestRelease) return null;
        return {
            version: latestRelease,
            latestChangeLog: releases[latestRelease]
        };
    }

    static async getAllReleasesFromGitHub() {
        const releasesPerPage = 5;
        const apiUrl = `https://api.github.com/repos/ddbrown30/foundry-family-feud/releases?per_page=${releasesPerPage}`;

        try {
            let compiledReleases = {};

            const response = await fetch(`${apiUrl}&page=1`);

            const releases = await response.json();
            releases.forEach((release) => {
                compiledReleases[release.tag_name] = release.body;
            });

            return compiledReleases;
        } catch (error) {
            return null;
        }
    }
    
    static async showNewVersionDialog(latestRelease, module) {
        const lastViewedRelease = Utils.getSetting(FFF_CONFIG.SETTING_KEYS.viewedReleaseUpdate) ?? 0;
        if (foundry.utils.isNewerVersion(latestRelease.version, lastViewedRelease) == false) {
            //The user has already seen the notification for this release
            return;
        }

        let templateData = {
            currentVersion: module.version,
            newVersion: latestRelease.version,
            latestChangeLog: latestRelease.latestChangeLog,
            hasChangelog: (latestRelease.latestChangeLog.length > 0),
        };
        const html = await renderTemplate(FFF_CONFIG.DEFAULT_CONFIG.templates.newVersionDialog, templateData);
        Dialog.prompt({
            title: "New Version Available",
            content: html,
            rejectClose: false,
            callback: () => {
                Utils.setSetting(FFF_CONFIG.SETTING_KEYS.viewedReleaseUpdate, latestRelease.version);
            },
            close: () => {},
        });
    }
}