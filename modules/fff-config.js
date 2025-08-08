export const NAME = "foundry-family-feud";

export const TITLE = "Foundry Family Feud";
export const SHORT_TITLE = "FFF";

export const PATH = "modules/foundry-family-feud";

export const DEFAULT_CONFIG = {
    questionEditor: {
        createNewJournalOption: "Create New Journal",
        createNewPageOption: "Create New Page",
    },
    templates: {
        questionEditor: `${PATH}/templates/question-editor.hbs`,
        boardController: `${PATH}/templates/board-controller.hbs`,
        newVersionDialog: `${PATH}/templates/new-version-dialog.hbs`,
    },
    images: {
        board: `${PATH}/assets/board.webp`,
        unrevealedPanel: `${PATH}/assets/unrevealed-panel.webp`,
        revealedPanel: `${PATH}/assets/revealed-panel.webp`,
        strike: `${PATH}/assets/strike.webp`,
        answers: [
            `${PATH}/assets/answer-1.webp`,
            `${PATH}/assets/answer-2.webp`,
            `${PATH}/assets/answer-3.webp`,
            `${PATH}/assets/answer-4.webp`,
            `${PATH}/assets/answer-5.webp`,
            `${PATH}/assets/answer-6.webp`,
            `${PATH}/assets/answer-7.webp`,
            `${PATH}/assets/answer-8.webp`,
        ]
    },
    sfx: {
        ding: `${PATH}/assets/ding.ogg`,
        strike: `${PATH}/assets/strike.ogg`,
    }
}

export const FLAGS = {
    boardData: "boardData",
    questionJournal: "questionJournal",
}

export const SETTING_KEYS = {
    lastGitCheck: "lastGitCheck",
    viewedReleaseUpdateClient: "viewedReleaseUpdateClient",
    viewedReleaseUpdateWorld: "viewedReleaseUpdateWorld",
}

