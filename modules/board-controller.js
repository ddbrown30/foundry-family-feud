import * as FFF_CONFIG from "./fff-config.js";
import { GameBoard } from "./game-board.js";
import { Utils } from "./utils.js";

/**
 * Form application for creating and editing questions
 */
export class BoardController extends FormApplication {
    constructor(options = {}) {
        super(null, options);
        this.questionData = {};
    }

    /**
     * Get options for the form
     */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: "board-controller",
            title: "Board Controller",
            template: FFF_CONFIG.DEFAULT_CONFIG.templates.boardController,
            classes: ["sheet"],
            width: 525,
            height: 600,
            resizable: true,
            closeOnSubmit: false
        });
    }

    /**
     * Prepare data for form rendering
     */
    async prepareData() {
        const data = {}

        data.boardLoaded = this.boardLoaded;
        data.questionLoaded = !!this.questionData.answers?.length;
        data.selectedPageName = this.questionData.selectedPageName;

        data.journals = [];

        for (const journal of game.journal) {
            data.journals.push(journal);
        }
        data.journals.sort((a, b) => a.name.localeCompare(b.name));
        data.selectedJournalName = this.questionData.selectedJournalName = this.questionData.selectedJournalName ?? data.journals[0]?.name;


        data.pages = [];
        let selectedJournal = game.journal.find((j) => j.name == data.selectedJournalName);
        if (selectedJournal) {
            for (const page of selectedJournal.pages) {
                data.pages.push(page);
            }

            if (!data.pages.find((p) => p.name == data.selectedPageName)) {
                data.selectedPageName = this.questionData.selectedPageName = null;
            }
        }

        data.pages.sort((a, b) => a.name.localeCompare(b.name));
        data.selectedPageName = this.questionData.selectedPageName = this.questionData.selectedPageName ?? data.pages[0]?.name;

        data.answers = [];

        if (this.questionData.answers) {
            data.answers = this.questionData.answers;
            for (let i = 0; i < data.answers.length; ++i) {
                data.answers[i].label = "Answer " + (i + 1);
            }
        }

        return data;
    }

    /**
     * Gets data for the template render
     */
    async getData() {
        return await this.prepareData();
    }

    /**
     * Take the new map and write it back to settings, overwriting existing
     * @param {Object} event 
     * @param {Object} formData 
     */
    async _updateObject(event, formData) {
    }

    /**
     * Activate app listeners
     * @param {*} html 
     */
    activateListeners(html) {
        const buttons = html.find("button");
        const journalSelector = html.find("select[class='journals']");
        const pageSelector = html.find("select[class='pages']");

        buttons.on("click", event => this.onButton(event));
        journalSelector.on("change", event => this.onChangeJournal(event));
        pageSelector.on("change", event => this.onChangePage(event));

        super.activateListeners(html);
    }

    async onButton(event) {
        event.preventDefault();
        
        const name = event.target.name;
        if (name.startsWith("reveal")) {
            this.onReveal(event);
        } else if (name.startsWith("find-board")) {
            this.onFindBoard(event);
        } else if (name.startsWith("load-question")) {
            this.onLoadQuestion(event);
        } else if (name.startsWith("reset-board")) {
            this.onResetBoard(event);
        } else if (name.startsWith("strike")) {
            this.onStrike(event);
        }

        this.render();
    }

    async onFindBoard(event) {
        event.preventDefault();
        
        let boardTile = canvas.scene.tiles.find((t) => Utils.hasModuleFlags(t));
        if (boardTile) {
            let flagData = Utils.getModuleFlag(boardTile, FFF_CONFIG.FLAGS.boardData);
            this.boardData = {};
            this.boardData.totalScore = canvas.scene.drawings.get(flagData.totalScore);
            this.boardData.strikes = flagData.strikes;
            this.boardData.strikes.tiles[0] = canvas.scene.tiles.get(this.boardData.strikes.tiles[0]);
            this.boardData.strikes.tiles[1] = canvas.scene.tiles.get(this.boardData.strikes.tiles[1]);
            this.boardData.strikes.tiles[2] = canvas.scene.tiles.get(this.boardData.strikes.tiles[2]);
            
            this.boardData.panels = [];
            for (let i = 0; i < 8; ++i) {
                this.boardData.panels[i] = {};
                const panel = this.boardData.panels[i];
                const panelIds = flagData.panels[i];
                
                panel.unrevealedPanel = canvas.scene.tiles.get(panelIds.unrevealedPanel);
                panel.revealedPanel = canvas.scene.tiles.get(panelIds.revealedPanel);
                panel.numberTile = canvas.scene.tiles.get(panelIds.numberTile);
                panel.answerCount = canvas.scene.drawings.get(panelIds.answerCount);
                panel.answerText = canvas.scene.drawings.get(panelIds.answerText);
            }
        }

        this.boardLoaded = true;

        this.gameBoard = new GameBoard(this.boardData);
    }

    async onLoadQuestion(event) {
        event.preventDefault();
        
        let selectedJournal = game.journal.find((j) => j.name == this.questionData.selectedJournalName);
        if (selectedJournal) {
            let selectedPage = selectedJournal.pages.find((p) => p.name == this.questionData.selectedPageName);
            if (selectedPage) {
                let questionData = Utils.parseJson(selectedPage.text.content);
                this.questionData.answers = questionData?.answers ?? [];
            }
        }
        this.gameBoard.setActiveQuestion(this.questionData.answers);
    }

    async onResetBoard(event) {
        event.preventDefault();
        this.gameBoard.resetBoard();
    }

    async onReveal(event) {
        event.preventDefault();
        const name = event.target.name;
        const index = name.match(/\d+$/)[0];
        const score = name.startsWith("reveal-score");
        this.gameBoard.revealAnswer(index, !!score);
    }

    async onStrike(event) {
        event.preventDefault();
        const name = event.target.name;
        const strikeNum = name.match(/\d+$/)[0];
        this.gameBoard.displayStrike(strikeNum);
    }

    async onChangeJournal(event) {
        event.preventDefault();
        const selection = $(event.target).find("option:selected");
        this.questionData.selectedJournalName = selection.val();
        this.render();
    }

    async onChangePage(event) {
        event.preventDefault();
        const selection = $(event.target).find("option:selected");
        this.questionData.selectedPageName = selection.val();
        this.render();
    }
}