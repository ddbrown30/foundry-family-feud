import * as FFF_CONFIG from "./fff-config.js";
import { Utils } from "./utils.js";

export function registerSettings() {

    Utils.registerSetting(FFF_CONFIG.SETTING_KEYS.board, {
        scope: "world",
        type: String,
        default: FFF_CONFIG.DEFAULT_CONFIG.images.board,
        config: false
    });
    
    Utils.registerSetting(FFF_CONFIG.SETTING_KEYS.unrevealedPanel, {
        scope: "world",
        type: String,
        default: FFF_CONFIG.DEFAULT_CONFIG.images.unrevealedPanel,
        config: false
    });
    
    Utils.registerSetting(FFF_CONFIG.SETTING_KEYS.revealedPanel, {
        scope: "world",
        type: String,
        default: FFF_CONFIG.DEFAULT_CONFIG.images.revealedPanel,
        config: false
    });

    for (let i = 0; i < 8; ++i) {
        Utils.registerSetting(FFF_CONFIG.SETTING_KEYS.answers[i], {
            scope: "world",
            type: String,
            default: FFF_CONFIG.DEFAULT_CONFIG.images.answers[i],
            config: false
        });
    }
}