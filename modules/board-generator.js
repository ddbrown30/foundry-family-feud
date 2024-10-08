import * as FFF_CONFIG from "./fff-config.js";
import { GameBoard } from "./game-board.js";
import { Utils } from "./utils.js";

export class BoardGenerator {

    static async generateBoard(xOffset=0, yOffset=0, scale=1) {
        let boardData = {};

        function transformX(x) {
            return (x * scale) + xOffset;
        }

        function transformY(y) {
            return (y * scale) + yOffset;
        }

        let tileData = {
            width: 1000 * scale,
            height: 562 * scale,
            x: transformX(0),
            y: transformY(0),
            elevation: 0,
            texture: {
                src: FFF_CONFIG.DEFAULT_CONFIG.images.board
            }
        };
        let board = await BoardGenerator.createTile(tileData);

        let textData = {
            shape: {
                width: 178 * scale,
                height: 100 * scale,
            },
            x: transformX(411),
            y: transformY(44),
            elevation: 10,
            strokeAlpha: 0,
            fontFamily: "Anton",
            fontSize: 72 * scale,
            text: "999"
        };
        textData.hidden = true;
        let totalScore = await BoardGenerator.createText(textData);
        boardData.totalScore = totalScore.id;

        tileData.width = 208 * scale;
        tileData.height = 277 * scale;
        tileData.y = transformY(208);
        tileData.elevation = 50;
        tileData.hidden = true;
        tileData.texture.src = FFF_CONFIG.DEFAULT_CONFIG.images.strike;
        let strike1 = await BoardGenerator.createTile(tileData);
        let strike2 = await BoardGenerator.createTile(tileData);
        let strike3 = await BoardGenerator.createTile(tileData);
        boardData.strikes = { tiles: [strike1.id, strike2.id, strike3.id], positions: [] };
        boardData.strikes.positions[0] = [transformX(397)];
        boardData.strikes.positions[1] = [transformX(285), transformX(508)];
        boardData.strikes.positions[2] = [transformX(174), transformX(397), transformX(620)];

        const panelStartX = transformX(190);
        const panelStartY = transformY(167);
        const numberStartX = transformX(295);
        const numberStartY = transformY(175);
        const answerStartX = transformX(205);
        const answerStartY = transformY(183);
        const answerCountStartX = transformX(439);
        const answerCountStartY = transformY(183);
        const deltaX = 315 * scale;
        const deltaY = 92 * scale;

        boardData.answerFontSize = 44 * scale;
        boardData.panels = [];
        for (let i = 0; i < 8; ++i) {
            boardData.panels[i] = {};
            const panel = boardData.panels[i];

            tileData.width = 306 * scale;
            tileData.height = 86 * scale;
            tileData.x = panelStartX + (deltaX * Math.floor(i / 4));
            tileData.y = panelStartY + (deltaY * Math.floor(i % 4));
            tileData.elevation = 10;
            tileData.texture.src = FFF_CONFIG.DEFAULT_CONFIG.images.unrevealedPanel;
            tileData.hidden = false;
            let unrevealedPanel = await BoardGenerator.createTile(tileData);
            panel.unrevealedPanel = unrevealedPanel.id;

            tileData.texture.src = FFF_CONFIG.DEFAULT_CONFIG.images.revealedPanel;
            tileData.hidden = true;
            let revealedPanel = await BoardGenerator.createTile(tileData);
            panel.revealedPanel = revealedPanel.id;

            tileData.width = 97 * scale;
            tileData.height = 81 * scale;
            tileData.x = numberStartX + (deltaX * Math.floor(i / 4));
            tileData.y = numberStartY + (deltaY * Math.floor(i % 4));
            tileData.elevation = 20;
            tileData.texture.src = FFF_CONFIG.DEFAULT_CONFIG.images.answers[i];
            tileData.hidden = true;
            let numberTile = await BoardGenerator.createTile(tileData);
            panel.numberTile = numberTile.id;

            textData.shape.width = 50 * scale;
            textData.shape.height = 50 * scale;
            textData.x = answerCountStartX + (deltaX * Math.floor(i / 4));
            textData.y = answerCountStartY + (deltaY * Math.floor(i % 4));
            textData.elevation = 20;
            textData.fontSize = boardData.answerFontSize;
            textData.text = "99";
            textData.hidden = true;
            let answerCount = await BoardGenerator.createText(textData);
            panel.answerCount = answerCount.id;

            textData.shape.width = 232 * scale;
            textData.x = answerStartX + (deltaX * Math.floor(i / 4));
            textData.y = answerStartY + (deltaY * Math.floor(i % 4));
            textData.text = "Answer Text";
            textData.hidden = true;
            let answerText = await BoardGenerator.createText(textData);
            panel.answerTextStartingX = textData.x;
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

    static async repositionBoard(x, y) {
        let boardTile = canvas.scene.tiles.find((t) => Utils.hasModuleFlags(t));
        if (boardTile) {
            let flagData = structuredClone(Utils.getModuleFlag(boardTile, FFF_CONFIG.FLAGS.boardData));
            let boardData = {};
            boardData.totalScore = canvas.scene.drawings.get(flagData.totalScore);
            boardData.strikes = flagData.strikes;
            boardData.strikes.tiles[0] = canvas.scene.tiles.get(boardData.strikes.tiles[0]);
            boardData.strikes.tiles[1] = canvas.scene.tiles.get(boardData.strikes.tiles[1]);
            boardData.strikes.tiles[2] = canvas.scene.tiles.get(boardData.strikes.tiles[2]);

            boardData.panels = [];
            for (let i = 0; i < 8; ++i) {
                boardData.panels[i] = {};
                const panel = boardData.panels[i];
                const panelIds = flagData.panels[i];

                panel.unrevealedPanel = canvas.scene.tiles.get(panelIds.unrevealedPanel);
                panel.revealedPanel = canvas.scene.tiles.get(panelIds.revealedPanel);
                panel.numberTile = canvas.scene.tiles.get(panelIds.numberTile);
                panel.answerCount = canvas.scene.drawings.get(panelIds.answerCount);
                panel.answerText = canvas.scene.drawings.get(panelIds.answerText);
            }

            let xDelta = x - boardTile.x;
            let yDelta = y - boardTile.y;

            let tileUpdateData = [
                { _id: boardTile.id, x: boardTile.x + xDelta, y: boardTile.y + yDelta },
                { _id: boardData.strikes.tiles[0].id, x: boardData.strikes.tiles[0].x + xDelta, y: boardData.strikes.tiles[0].y + yDelta },
                { _id: boardData.strikes.tiles[1].id, x: boardData.strikes.tiles[1].x + xDelta, y: boardData.strikes.tiles[1].y + yDelta },
                { _id: boardData.strikes.tiles[2].id, x: boardData.strikes.tiles[2].x + xDelta, y: boardData.strikes.tiles[2].y + yDelta },
            ];

            let textUpdateData = [
                { _id: boardData.totalScore.id, x: boardData.totalScore.x + xDelta, y: boardData.totalScore.y + yDelta },
            ];

            for (let i = 0; i < 8; ++i) {
                const panel = boardData.panels[i];

                tileUpdateData.push({ _id: panel.unrevealedPanel.id, x: panel.unrevealedPanel.x + xDelta, y: panel.unrevealedPanel.y + yDelta });
                tileUpdateData.push({ _id: panel.revealedPanel.id, x: panel.revealedPanel.x + xDelta, y: panel.revealedPanel.y + yDelta });
                tileUpdateData.push({ _id: panel.numberTile.id, x: panel.numberTile.x + xDelta, y: panel.numberTile.y + yDelta });

                textUpdateData.push({ _id: panel.answerText.id, x: panel.answerText.x + xDelta, y: panel.answerText.y + yDelta });
                textUpdateData.push({ _id: panel.answerCount.id, x: panel.answerCount.x + xDelta, y: panel.answerCount.y + yDelta });
            }

            await canvas.scene.updateEmbeddedDocuments("Tile", tileUpdateData);
            await canvas.scene.updateEmbeddedDocuments("Drawing", textUpdateData);
        }
    }

    static async destroyBoard() {
        let boardTile = canvas.scene.tiles.find((t) => Utils.hasModuleFlags(t));
        if (boardTile) {
            let tileDestroyData = [];
            let textDestroyData = [];

            let flagData = Utils.getModuleFlag(boardTile, FFF_CONFIG.FLAGS.boardData);

            tileDestroyData.push(boardTile.id);
            textDestroyData.push(flagData.totalScore);
            tileDestroyData = tileDestroyData.concat(flagData.strikes.tiles);

            for (let i = 0; i < 8; ++i) {
                const panel = flagData.panels[i];
                tileDestroyData.push(panel.unrevealedPanel);
                tileDestroyData.push(panel.revealedPanel);
                tileDestroyData.push(panel.numberTile);
                textDestroyData.push(panel.answerCount);
                textDestroyData.push(panel.answerText);
            }

            await canvas.scene.deleteEmbeddedDocuments("Tile", tileDestroyData);
            await canvas.scene.deleteEmbeddedDocuments("Drawing", textDestroyData);
        }
    }
}
