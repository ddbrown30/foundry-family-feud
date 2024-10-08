import * as FFF_CONFIG from "./fff-config.js";
import { Utils } from "./utils.js";

/**
 * Form application for creating and editing questions
 */
export class QuestionEditor extends FormApplication {
    constructor(options = {}) {
        super(null, options);
        this.questionData = {
            questionText: "",
            numAnswers: 1,
            answers: [{
                text: "Answer Text",
                count: 1
            }]
        };

        this.createNewJournalOption = FFF_CONFIG.DEFAULT_CONFIG.questionEditor.createNewJournalOption;
        this.createNewPageOption = FFF_CONFIG.DEFAULT_CONFIG.questionEditor.createNewPageOption;

        this.questionData.selectedJournalName = this.createNewJournalOption;
        this.questionData.selectedPageName = this.createNewPageOption;
    }

    /**
     * Get options for the form
     */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: "question-editor",
            title: "Question Editor",
            template: FFF_CONFIG.DEFAULT_CONFIG.templates.questionEditor,
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

        data.questionText = this.questionData.questionText;
        data.numAnswers = this.questionData.numAnswers;
        data.answers = [];
        for (let i = 0; i < data.numAnswers; ++i) {
            if (i < this.questionData.answers.length) {
                data.answers[i] = this.questionData.answers[i];
                data.answers[i].label = "Answer " + (i + 1);
            } else {
                this.questionData.answers[i] = data.answers[i] = {
                    label: "Answer " + (i + 1),
                    text: "Answer Text",
                    count: 1
                };
            }
        }

        data.selectedJournalName = this.questionData.selectedJournalName;
        data.selectedPageName = this.questionData.selectedPageName;

        data.journals = [];

        for (const journal of game.journal) {
            data.journals.push(journal);
        }
        data.journals.sort((a, b) => a.name.localeCompare(b.name));
        data.journals.unshift({ name: this.createNewJournalOption });
        
        
        data.pages = [];
        let selectedJournal = game.journal.find((j) => j.name == data.selectedJournalName);
        if (selectedJournal) {
            for (const page of selectedJournal.pages) {
                data.pages.push(page);
            }

            if (!data.pages.find((p) => p.name == data.selectedPageName)) {
                data.selectedPageName = this.questionData.selectedPageName = this.createNewPageOption;
            }
        }
        
        data.pages.sort((a, b) => a.name.localeCompare(b.name));
        data.pages.unshift({ name: this.createNewPageOption });

        data.newJournalName = this.newJournalName;
        data.newPageName = this.newPageName;

        data.canSave = !!((selectedJournal || (this.newJournalName && this.newJournalName.length)) &&
                        (data.selectedPageName != this.createNewPageOption || (this.newPageName && this.newPageName.length)));

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
        const inputs = html.find("input");
        const journalSelector = html.find("select[class='journals']");
        const pageSelector = html.find("select[class='pages']");
        const saveButton = html.find("button[name='save']");
        const loadButton = html.find("button[name='load-question']");

        inputs.on("change", event => this.onChangeInputs(event));
        journalSelector.on("change", event => this.onChangeJournal(event));
        pageSelector.on("change", event => this.onChangePage(event));
        saveButton.on("click", event => this.onSave(event));
        loadButton.on("click", event => this.onLoadQuestion(event));

        super.activateListeners(html);
    }

    /**
     * Input change handler
     * @param {*} event 
     * @returns {Application.render}
     */
    async onChangeInputs(event) {
        const name = event.target.name;

        if (name.startsWith("num-answers")) {
            this.questionData.numAnswers = Math.min(Math.max(event.target.value, 1), 8);
            return this.render();
        } else if (name == "question") {
            this.questionData.questionText = event.target.value;
        } else if (name.startsWith("new-journal-name")) {
            this.newJournalName = event.target.value;
            this.render();
        } else if (name.startsWith("new-page-name")) {
            this.newPageName = event.target.value;
            this.render();
        } else if (name.startsWith("answer-text-")) {
            this.onChangeAnswerText(event);
        } else if (name.startsWith("answer-count-")) {
            this.onChangeAnswerCount(event);
        }
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
    
    async onChangeAnswerText(event) {
        event.preventDefault();

        const index = event.target.name.match(/\d+$/)[0];
        this.questionData.answers[index].text = event.target.value;
    }
    
    async onChangeAnswerCount(event) {
        event.preventDefault();

        const index = event.target.name.match(/\d+$/)[0];
        this.questionData.answers[index].count = Math.min(Math.max(Number(event.target.value), 1), 99);
        this.render();
    }
    
    async onSave(event) {
        event.preventDefault();

        let journal;
        if (this.questionData.selectedJournalName == this.createNewJournalOption) {
            journal = game.journal.getName(this.newJournalName);
            if (!journal) {
                journal = await JournalEntry.create({name: this.newJournalName});
            }
        } else {
            journal = game.journal.getName(this.questionData.selectedJournalName);
        }
        
        let page;
        if (this.questionData.selectedPageName == this.createNewPageOption) {
            page = journal.pages.find((p) => p.name == this.newPageName);
            if (!page) {
                page = (await journal.createEmbeddedDocuments("JournalEntryPage", [{name: this.newPageName, type: 'text'}]))[0];
            }
        } else {
            page = journal.pages.find((p) => p.name == this.questionData.selectedPageName);
        }

        let questionData = {
            questionText: this.questionData.questionText,
            answers: this.questionData.answers
        }

        let pageText = JSON.stringify(questionData, null, 2);
        await journal.updateEmbeddedDocuments("JournalEntryPage", [{_id: page.id, "text.content": pageText}]);
    }

    async onLoadQuestion(event) {
        event.preventDefault();
        
        let selectedJournal = game.journal.find((j) => j.name == this.questionData.selectedJournalName);
        if (selectedJournal) {
            let selectedPage = selectedJournal.pages.find((p) => p.name == this.questionData.selectedPageName);
            if (selectedPage) {
                let questionData = Utils.parseJson(selectedPage.text.content);
                if (questionData) {
                    this.questionData.questionText = questionData.questionText;
                    this.questionData.numAnswers = questionData.answers.length;
                    this.questionData.answers = questionData.answers;
                }
            }
        }

        this.render();
    }
}