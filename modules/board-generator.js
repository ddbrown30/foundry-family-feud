import * as FFF_CONFIG from "./fff-config.js";
import { Utils } from "./utils.js";

export class BoardGenerator {

    static async generateBoard() {
        let boardData = {};

        let tileData = {
            width: 1000,
            height: 562,
            x: 0,
            y: 0,
            z: 0,
            texture: {
                src: FFF_CONFIG.DEFAULT_CONFIG.images.board
            }
        };
        let board = await BoardGenerator.createTile(tileData);

        let textData = {
            shape: {
                width: 178,
                height: 100,
            },
            x: 411,
            y: 44,
            z: 10,
            strokeAlpha: 0,
            fontFamily: "Anton",
            fontSize: 72,
            text: "999"
        };
        textData.hidden = true;
        let totalScore = await BoardGenerator.createText(textData);
        boardData.totalScore = totalScore.id;
        
        tileData.width = 208;
        tileData.height = 277;
        tileData.y = 208;
        tileData.z = 50;
        tileData.hidden = true;
        tileData.texture.src = FFF_CONFIG.DEFAULT_CONFIG.images.strike;
        let strike1 = await BoardGenerator.createTile(tileData);
        let strike2 = await BoardGenerator.createTile(tileData);
        let strike3 = await BoardGenerator.createTile(tileData);
        boardData.strikes = { tiles: [strike1.id, strike2.id, strike3.id], positions: [] };
        boardData.strikes.positions[0] = [397];
        boardData.strikes.positions[1] = [285, 508];
        boardData.strikes.positions[2] = [174, 397, 620];

        const panelStartX = 190;
        const panelStartY = 167;
        const numberStartX = 295;
        const numberStartY = 175;
        const answerStartX = 203;
        const answerStartY = 183;
        const answerCountStartX = 439;
        const answerCountStartY = 183;
        const deltaX = 315;
        const deltaY = 92;

        boardData.panels = [];
        for (let i = 0; i < 8; ++i) {
            boardData.panels[i] = {};
            const panel = boardData.panels[i];

            tileData.width = 306;
            tileData.height = 86;
            tileData.x = panelStartX + (deltaX * Math.floor(i / 4));
            tileData.y = panelStartY + (deltaY * Math.floor(i % 4));
            tileData.z = 10;
            tileData.texture.src = FFF_CONFIG.DEFAULT_CONFIG.images.unrevealedPanel;
            tileData.hidden = false;
            let unrevealedPanel = await BoardGenerator.createTile(tileData);
            panel.unrevealedPanel = unrevealedPanel.id;

            tileData.texture.src = FFF_CONFIG.DEFAULT_CONFIG.images.revealedPanel;
            tileData.hidden = true;
            let revealedPanel = await BoardGenerator.createTile(tileData);
            panel.revealedPanel = revealedPanel.id;

            tileData.width = 97;
            tileData.height = 81;
            tileData.x = numberStartX + (deltaX * Math.floor(i / 4));
            tileData.y = numberStartY + (deltaY * Math.floor(i % 4));
            tileData.z = 20;
            tileData.texture.src = FFF_CONFIG.DEFAULT_CONFIG.images.answers[i];
            tileData.hidden = true;
            let numberTile = await BoardGenerator.createTile(tileData);
            panel.numberTile = numberTile.id;

            textData.shape.width = 50;
            textData.shape.height = 50;
            textData.x = answerCountStartX + (deltaX * Math.floor(i / 4));
            textData.y = answerCountStartY + (deltaY * Math.floor(i % 4));
            textData.z = 20;
            textData.fontSize = 44;
            textData.text = "99";
            textData.hidden = true;
            let answerCount = await BoardGenerator.createText(textData);
            panel.answerCount = answerCount.id;

            textData.shape.width = 232;
            textData.x = answerStartX + (deltaX * Math.floor(i / 4));
            textData.y = answerStartY + (deltaY * Math.floor(i % 4));
            textData.text = "Answer Text";
            textData.hidden = true;
            let answerText = await BoardGenerator.createText(textData);
            panel.answerText = answerText.id;
        }

        await Utils.setModuleFlag(board, FFF_CONFIG.FLAGS.boardData, boardData);
    }

    static async createTile(tileData) {
        let tileDoc = new TileDocument(tileData);
        return (await canvas.scene.createEmbeddedDocuments("Tile", [tileDoc]))[0];
    }

    static async createText(textData) {
        let drawDoc = new DrawingDocument(textData);
        return (await canvas.scene.createEmbeddedDocuments("Drawing", [drawDoc]))[0];
    }
}
