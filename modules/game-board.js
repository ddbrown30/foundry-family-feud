import * as FFF_CONFIG from "./fff-config.js";
import { Utils } from "./utils.js";

export class GameBoard {
    constructor(boardData) {
        this.boardData = boardData;
        this.activeQuestion = {};
    }

    async setActiveQuestion(answerData) {
        this.activeQuestion = {};
        this.activeQuestion.answerData = answerData;
        this.activeQuestion.totalScore = Number(this.boardData.totalScore.text);
    }

    async resetBoard() {
        this.activeQuestion.totalScore = 0;

        await canvas.scene.updateEmbeddedDocuments("Drawing", [{ _id: this.boardData.totalScore.id, hidden: false, text: "0" }]);

        for (let i = 0; i < 8; ++i) {
            const panel = this.boardData.panels[i];

            let tileUpdateData = [
                { _id: panel.unrevealedPanel.id, hidden: false },
                { _id: panel.revealedPanel.id, hidden: true },
                { _id: panel.numberTile.id, hidden: i >= this.activeQuestion.answerData.length }
            ];
            await canvas.scene.updateEmbeddedDocuments("Tile", tileUpdateData);

            let answerText = i < this.activeQuestion.answerData.length ? this.activeQuestion.answerData[i].text : ".";
            let answerCount = i < this.activeQuestion.answerData.length ? this.activeQuestion.answerData[i].count.toString() : ".";

            let fontSize = this.boardData.answerFontSize;
            let style = new PIXI.TextStyle({ fontFamily: 'Anton', fontSize: fontSize });
            let textMetrics = PIXI.TextMetrics.measureText(answerText, style);
            while (textMetrics.width > panel.answerText.shape.width) {
                fontSize -= 2;
                style.fontSize = fontSize;
                textMetrics = PIXI.TextMetrics.measureText(answerText, style);
            }

            let textX = panel.answerTextStartingX + this.boardData.boardTile.x;
            if (textMetrics.width < panel.answerText.shape.width) {
                let halfDelta = (panel.answerText.shape.width - textMetrics.width) / 2;
                textX -= halfDelta;
            }

            let textUpdateData = [
                { _id: panel.answerText.id, hidden: true, text: answerText, fontSize: fontSize, x: textX },
                { _id: panel.answerCount.id, hidden: true, text: answerCount },
            ];
            await canvas.scene.updateEmbeddedDocuments("Drawing", textUpdateData);
        }
    }

    async revealAnswer(answerIndex, addScore) {
        if (answerIndex >= this.activeQuestion.answerData.length) {
            return;
        }

        if (addScore) {
            this.activeQuestion.totalScore += this.activeQuestion.answerData[answerIndex].count;
            await canvas.scene.updateEmbeddedDocuments("Drawing", [{ _id: this.boardData.totalScore.id, text: this.activeQuestion.totalScore.toString() }]);
        }

        const panel = this.boardData.panels[answerIndex];

        let tileUpdateData = [
            { _id: panel.unrevealedPanel.id, hidden: true },
            { _id: panel.revealedPanel.id, hidden: false },
            { _id: panel.numberTile.id, hidden: true }
        ];
        await canvas.scene.updateEmbeddedDocuments("Tile", tileUpdateData);

        let textUpdateData = [
            { _id: panel.answerText.id, hidden: false },
            { _id: panel.answerCount.id, hidden: false },
        ];
        await canvas.scene.updateEmbeddedDocuments("Drawing", textUpdateData);

        foundry.audio.AudioHelper.play({src: FFF_CONFIG.DEFAULT_CONFIG.sfx.ding, loop: false}, true);
    }

    async displayStrike(strikeNum) {
        let boardX = this.boardData.boardTile.x;
        function hideStrikes(tileUpdateData) {
            for (let tile of tileUpdateData) {
                tile.x = boardX;
                tile.hidden = true;
            }
            canvas.scene.updateEmbeddedDocuments("Tile", tileUpdateData);
        }
        if (strikeNum == 1) {
            let tileUpdateData = [
                { _id: this.boardData.strikes.tiles[0].id, hidden: false, x: this.boardData.strikes.positions[0][0] + boardX },
            ];
            await canvas.scene.updateEmbeddedDocuments("Tile", tileUpdateData);
            setTimeout(function () { hideStrikes(tileUpdateData) }, 1000);
        } else if (strikeNum == 2) {
            let tileUpdateData = [
                { _id: this.boardData.strikes.tiles[0].id, hidden: false, x: this.boardData.strikes.positions[1][0] + boardX },
                { _id: this.boardData.strikes.tiles[1].id, hidden: false, x: this.boardData.strikes.positions[1][1] + boardX },
            ];
            await canvas.scene.updateEmbeddedDocuments("Tile", tileUpdateData);
            setTimeout(function () { hideStrikes(tileUpdateData) }, 1000);
        } else if (strikeNum == 3) {
            let tileUpdateData = [
                { _id: this.boardData.strikes.tiles[0].id, hidden: false, x: this.boardData.strikes.positions[2][0] + boardX },
                { _id: this.boardData.strikes.tiles[1].id, hidden: false, x: this.boardData.strikes.positions[2][1] + boardX },
                { _id: this.boardData.strikes.tiles[2].id, hidden: false, x: this.boardData.strikes.positions[2][2] + boardX },
            ];
            await canvas.scene.updateEmbeddedDocuments("Tile", tileUpdateData);
            setTimeout(function () { hideStrikes(tileUpdateData) }, 1000);
        }

        foundry.audio.AudioHelper.play({src: FFF_CONFIG.DEFAULT_CONFIG.sfx.strike, loop: false}, true);
    }

    async setTotalScore(score) {
        this.activeQuestion.totalScore = score;
        await canvas.scene.updateEmbeddedDocuments("Drawing", [{ _id: this.boardData.totalScore.id, text: this.activeQuestion.totalScore.toString() }]);
    }
}
