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
}

export const SETTING_KEYS = {
    board: "board",
    unrevealedPanel: "unrevealedPanel",
    revealedPanel: "revealedPanel",
    answers: [
        "answer1",
        "answer2",
        "answer3",
        "answer4",
        "answer5",
        "answer6",
        "answer7",
        "answer8",
    ]
}

