import { Utils } from "./utils.js";
import { registerSettings } from "./settings.js";
import { BoardGenerator } from "./board-generator.js";
import { QuestionEditor } from "./question-editor.js";
import { BoardController } from "./board-controller.js";
import * as FFF_CONFIG from "./fff-config.js";

export class HooksManager {
  /**
   * Registers hooks
   */
  static registerHooks() {

    /* ------------------- Init/Ready ------------------- */

    Hooks.on("init", () => {
      game.foundryFamilyFeud = game.foundryFamilyFeud ?? {};

      // Expose API methods
      game.foundryFamilyFeud.questionEditor = function () { new QuestionEditor().render(true); };
      game.foundryFamilyFeud.boardController = function () { new BoardController().render(true); };
      game.foundryFamilyFeud.generateBoard = BoardGenerator.generateBoard;
      game.foundryFamilyFeud.destroyBoard = BoardGenerator.destroyBoard;
      game.foundryFamilyFeud.repositionBoard = BoardGenerator.repositionBoard;

      CONFIG.fontDefinitions['Anton'] = {
        editor: true,
        fonts: [
          {
            urls: ['modules/foundry-family-feud/fonts/Anton-Regular.ttf'],
            style: 'normal'
          }
        ]
      };

      Utils.loadTemplates();
      registerSettings();
    });
  }
}