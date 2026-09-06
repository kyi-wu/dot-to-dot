
// ==========================================
// GAME CONFIG
// ==========================================

const GAME_CONFIG = {
    showNumbers: true,
    allowToggleNumbers: true
};

// ==========================================
// DEFAULT LEVEL COLORS
// ==========================================

const DEFAULT_LEVEL_COLORS = {

    point: "#FFFFFF",

    pointStroke: "#333333",

    pointHover: "#EEEEEE",

    completedPoint: "#4CAF50",

    completedPointStroke: "#388E3C",

    line: "#4CAF89",

    number: "#333333"

};

// ==========================================
// DOM ELEMENTS 主要元素
// ==========================================

const svg = document.getElementById("game-svg");

const backgroundImage =
    document.getElementById("background-image");

const currentLevelElement =
    document.getElementById("currentLevel");

const restartButton =
    document.getElementById("restart-button");

const numbersButton =
    document.getElementById("numbers-button");

const nextButton =
    document.getElementById("next-button");

const messageElement =
    document.getElementById("message");


// ==========================================
// SOUND 音效
// ==========================================

const clickSound =
    new Audio("sounds/click_sound.mp3");

clickSound.volume = 0.5;


// const wrongSound =
//     new Audio("sounds/wrong.mp3");

// wrongSound.volume = 0.5;


// const completeSound =
//     new Audio("sounds/complete.mp3");

// completeSound.volume = 0.5;


// ==========================================
// BACKGROUND MUSIC
// ==========================================

const backgroundMusic =
    new Audio("sounds/background.mp3");

backgroundMusic.loop = true;

backgroundMusic.volume = 0.2;


// Try to start immediately

backgroundMusic.play().catch(() => {

    console.log(
        "Waiting for user interaction to start music."
    );

});


// If autoplay is blocked,
// start music after the first user interaction

document.addEventListener(
    "click",
    function startMusic() {

        backgroundMusic.play()
            .catch(() => {});

        document.removeEventListener(
            "click",
            startMusic
        );

    }
);


// ==========================================
// LEVEL COMPLETION DIALOG
// ==========================================

const levelDialog =
    document.createElement("div");

levelDialog.classList.add(
    "level-dialog",
    "hidden"
);


const levelDialogBox =
    document.createElement("div");

levelDialogBox.classList.add(
    "level-dialog-box"
);


const levelDialogText =
    document.createElement("div");

levelDialogText.classList.add(
    "level-dialog-text"
);


const levelDialogButton =
    document.createElement("button");

levelDialogButton.classList.add(
    "level-dialog-button"
);

levelDialogButton.textContent =
    "Continue";


levelDialogBox.appendChild(
    levelDialogText
);

levelDialogBox.appendChild(
    levelDialogButton
);

levelDialog.appendChild(
    levelDialogBox
);

document
    .getElementById("game-board")
    .appendChild(levelDialog);


// ==========================================
// LEVEL COMPLETION DIALOG - Text
// ==========================================
const LEVEL_DIALOG_CONFIG = {

    1: {
        x1: 1170,
        y1: 100,
        x2: 1850,
        y2: 450,
        text: "A Brighton summer, salt in the breeze, melting softly into sunlight."
    },

    2: {
        x1: 1300,
        y1: 100,
        x2: 1850,
        y2: 350,
        text: "Look at that!"
    },

    3: {
        x1: 1300,
        y1: 100,
        x2: 1850,
        y2: 350,
        text: "Almost there!"
    },

    4: {
        x1: 1300,
        y1: 100,
        x2: 1850,
        y2: 350,
        text: "You did it!"
    }

};

// ==========================================
// LEVEL COMPLETION DIALOG - txt appearing style
// ==========================================

// ==========================================
// SHOW LEVEL DIALOG
// ==========================================

function showLevelDialog(levelNumber) {

    const config =
        LEVEL_DIALOG_CONFIG[levelNumber];

    if (!config) {
        return;
    }

    // --------------------------------------
    // Clear previous timers
    // --------------------------------------

    clearTimeout(dialogTimer);
    clearTimeout(typingTimer);
    clearTimeout(eraseTimer);

    // --------------------------------------
    // Reset dialog
    // --------------------------------------

    levelDialog.classList.remove(
        "show",
        "button-visible"
    );

    levelDialog.classList.remove(
        "hidden"
    );

    levelDialogText.textContent = "";

    levelDialogButton.style.opacity = "0";
    levelDialogButton.style.pointerEvents = "none";

    // --------------------------------------
    // Convert game coordinates
    // to screen coordinates
    // --------------------------------------

    const topLeft =
        svg.createSVGPoint();

    topLeft.x = config.x1;
    topLeft.y = config.y1;

    const bottomRight =
        svg.createSVGPoint();

    bottomRight.x = config.x2;
    bottomRight.y = config.y2;

    const screenTopLeft =
        topLeft.matrixTransform(
            svg.getScreenCTM()
        );

    const screenBottomRight =
        bottomRight.matrixTransform(
            svg.getScreenCTM()
        );

    // --------------------------------------
    // Set dialog position and size
    // --------------------------------------

    levelDialogBox.style.left =
        `${screenTopLeft.x}px`;

    levelDialogBox.style.top =
        `${screenTopLeft.y}px`;

    levelDialogBox.style.width =
        `${screenBottomRight.x - screenTopLeft.x}px`;

    levelDialogBox.style.height =
        `${screenBottomRight.y - screenTopLeft.y}px`;

    // --------------------------------------
    // Show dialog after 1 second
    // --------------------------------------

    dialogTimer = setTimeout(() => {

        levelDialog.classList.add(
            "show"
        );

        // Type text character by character
        typeText(
            config.text,
            80
        );

    }, 1000);
}

// text appearing char by char
// ==========================================
// TEXT APPEARING CHARACTER BY CHARACTER
// ==========================================
function typeText(text) {

    // Show the entire text immediately
    levelDialogText.textContent = text;

}
// function typeText(text, speed = 80) {

//     let index = 0;

//     levelDialogText.textContent = "";

//     function typeNextCharacter() {

//         if (index >= text.length) {

//             return;
//         }

//         levelDialogText.textContent +=
//             text[index];

//         index++;

//         typingTimer = setTimeout(
//             typeNextCharacter,
//             speed
//         );
//     }

//     typeNextCharacter();
// }


function showContinueButton() {

    levelDialog.classList.add(
        "button-visible"
    );

}

// ==========================================
// TEXT DISAPPEARING RANDOMLY
// ==========================================

function eraseTextRandomly(speed = 100) {

    clearTimeout(eraseTimer);

    const text =
        levelDialogText.textContent;

    // Convert text into an array of characters
    let characters =
        Array.from(text);

    function eraseNextCharacter() {

        if (characters.length === 0) {

            levelDialogText.textContent = "";

            setTimeout(() => {

                levelDialog.classList.remove(
                    "show"
                );

                levelDialog.classList.add(
                    "hidden"
                );

                // Show Next button after text disappears
                if (
                    currentLevelIndex <
                    levels.length - 1
                ) {

                    nextButton.classList.remove(
                        "hidden"
                    );
                }

            }, 300);

            return;
        }

        // Pick a random character
        const randomIndex =
            Math.floor(
                Math.random() * characters.length
            );

        // Remove that character
        characters.splice(
            randomIndex,
            1
        );

        // Update displayed text
        levelDialogText.textContent =
            characters.join("");

        // Continue
        eraseTimer = setTimeout(
            eraseNextCharacter,
            speed
        );
    }

    eraseNextCharacter();
}


// ==========================================
// SVG NAMESPACE
// ==========================================

const SVG_NS =
    "http://www.w3.org/2000/svg";


// ==========================================
// GAME STATE
// ==========================================

let currentLevelIndex = 0;

let currentPointIndex = 0;

let levelCompleted = false;

let numbersVisible = true;

// ==========================================
// DIALOG TIMERS
// ==========================================
// Dialog timers
let dialogTimer = null;
let typingTimer = null;
let eraseTimer = null;

// ==========================================
// APPLY LEVEL COLORS
// ==========================================

function applyLevelColors(level) {

    const colors = {

        ...DEFAULT_LEVEL_COLORS,

        ...(level.colors || {})

    };


    svg.style.setProperty(
        "--point-color",
        colors.point
    );


    svg.style.setProperty(
        "--point-stroke-color",
        colors.pointStroke
    );


    svg.style.setProperty(
        "--point-hover-color",
        colors.pointHover
    );


    svg.style.setProperty(
        "--completed-point-color",
        colors.completedPoint
    );


    svg.style.setProperty(
        "--completed-point-stroke-color",
        colors.completedPointStroke
    );


    svg.style.setProperty(
        "--line-color",
        colors.line
    );


    svg.style.setProperty(
        "--number-color",
        colors.number
    );

}

// ==========================================
// START
// ==========================================

loadLevel(currentLevelIndex);


// ==========================================
// LOAD LEVEL
// ==========================================

function loadLevel(levelIndex) {

    const level =
        levels[levelIndex];
    
    // --------------------------------------
    // Apply this level's colors
    // --------------------------------------
    applyLevelColors(level);

    currentPointIndex = 0;

    levelCompleted = false;


    numbersVisible =
        GAME_CONFIG.showNumbers &&
        level.showNumbers;


    currentLevelElement.textContent =
        levelIndex + 1;


    messageElement.textContent = "";


    nextButton.classList.add(
        "hidden"
    );


    // --------------------------------------
    // Reset level dialog
    // --------------------------------------

    clearTimeout(dialogTimer);
    clearTimeout(typingTimer);
    clearTimeout(eraseTimer);

    levelDialog.classList.add(
        "hidden"
    );

    levelDialog.classList.remove(
        "show",
        "button-visible"
    );

    levelDialogText.textContent = "";

    // --------------------------------------
    // Background
    // --------------------------------------

    backgroundImage.setAttribute(
        "href",
        level.image
    );


    backgroundImage.classList.remove(
        "revealed"
    );


    // --------------------------------------
    // Remove old game elements
    // --------------------------------------

    svg.querySelectorAll(
        ".connection-line, .point-group"
    ).forEach(element => {

        element.remove();

    });


    // --------------------------------------
    // Create points
    // --------------------------------------

    level.points.forEach(
        (point, index) => {

            createPoint(
                point,
                index
            );

        }
    );


    updateNumbersVisibility();

    updateNumbersButton();

    updatePointAppearance();

    // --------------------------------------
    // Show level introduction text
    // --------------------------------------

    showLevelDialog(
        levelIndex + 1
    )
}


// ==========================================
// CREATE POINT
// ==========================================

function createPoint(point, index) {

    // --------------------------------------
    // Group
    // --------------------------------------

    const group =
        document.createElementNS(
            SVG_NS,
            "g"
        );


    group.classList.add(
        "point-group"
    );


    group.dataset.index =
        index;


    // ======================================
    // INVISIBLE HIT AREA
    // ======================================

    const hitArea =
        document.createElementNS(
            SVG_NS,
            "circle"
        );


    hitArea.setAttribute(
        "cx",
        point.x
    );


    hitArea.setAttribute(
        "cy",
        point.y
    );


    // 30px clickable radius

    hitArea.setAttribute(
        "r",
        "30"
    );


    // Important:
    // transparent but still clickable

    hitArea.setAttribute(
        "fill",
        "transparent"
    );


    hitArea.setAttribute(
        "pointer-events",
        "all"
    );


    hitArea.style.cursor =
        "pointer";


    // ======================================
    // VISIBLE CIRCLE
    // ======================================

    const circle =
        document.createElementNS(
            SVG_NS,
            "circle"
        );


    circle.setAttribute(
        "cx",
        point.x
    );


    circle.setAttribute(
        "cy",
        point.y
    );


    circle.setAttribute(
        "r",
        "10"
    );


    circle.classList.add(
        "point-circle"
    );


    // Make sure CSS transform doesn't
    // move the circle away from its position

    circle.style.transformBox =
        "fill-box";


    circle.style.transformOrigin =
        "center";


    // ======================================
    // NUMBER 数字位置
    // ======================================

    const number =
        document.createElementNS(
            SVG_NS,
            "text"
        );


    // 数字在左上角

    number.setAttribute(
        "x",
        point.x - 10
    );


    number.setAttribute(
        "y",
        point.y - 10
    );


    number.setAttribute(
        "text-anchor",
        "end"
    );


    number.classList.add(
        "point-number"
    );


    number.textContent =
        index + 1;


    // ======================================
    // ADD TO GROUP
    // ======================================

    group.appendChild(
        hitArea
    );


    group.appendChild(
        circle
    );


    group.appendChild(
        number
    );


    // ======================================
    // ADD TO SVG
    // ======================================

    svg.appendChild(
        group
    );


    // ======================================
    // CLICK
    // ======================================

    hitArea.addEventListener(
        "click",
        function(event) {

            event.stopPropagation();

            handlePointClick(index);

        }
    );


    circle.addEventListener(
        "click",
        function(event) {

            event.stopPropagation();

            handlePointClick(index);

        }
    );


    number.addEventListener(
        "click",
        function(event) {

            event.stopPropagation();

            handlePointClick(index);

        }
    );
}


// ==========================================
// HANDLE POINT CLICK
// ==========================================

function handlePointClick(index) {

    if (levelCompleted) {

        return;

    }


    console.log(
        "Clicked point:",
        index + 1
    );


    console.log(
        "Expected point:",
        currentPointIndex + 1
    );


    // --------------------------------------
    // Correct point 正确点击
    // --------------------------------------

    if (
        index === currentPointIndex
    ) {

        // Play click sound

        clickSound.currentTime = 0;

        clickSound.play();


        // If this is not the first point,
        // connect it to the previous point.

        if (
            currentPointIndex > 0
        ) {

            drawLine(
                currentPointIndex - 1,
                currentPointIndex
            );

        }


        // Move to next point

        currentPointIndex++;


        updatePointAppearance();


        // ----------------------------------
        // Check completion
        // ----------------------------------

        const level =
            levels[currentLevelIndex];


        if (
            currentPointIndex >=
            level.points.length
        ) {

            completeLevel();

        }

    }


    // --------------------------------------
    // Wrong point
    // --------------------------------------

    else {

        // wrongSound.currentTime = 0;
        // wrongSound.play();

        wrongPointFeedback(index);

    }
}


// ==========================================
// DRAW LINE
// ==========================================

function drawLine(index1, index2) {

    const level =
        levels[currentLevelIndex];


    const point1 =
        level.points[index1];


    const point2 =
        level.points[index2];


    console.log(
        "Drawing line:",
        point1,
        "→",
        point2
    );


    // ======================================
    // CREATE SVG LINE
    // ======================================

    const line =
        document.createElementNS(
            SVG_NS,
            "line"
        );


    line.setAttribute(
        "x1",
        point1.x
    );


    line.setAttribute(
        "y1",
        point1.y
    );


    line.setAttribute(
        "x2",
        point2.x
    );


    line.setAttribute(
        "y2",
        point2.y
    );


    // ======================================
    // LINE STYLE
    // ======================================

    // line.setAttribute(
    //     "stroke",
    //     "#4CAF50"
    // );


    line.setAttribute(
        "stroke-width",
        "5"
    );


    line.setAttribute(
        "stroke-linecap",
        "round"
    );


    line.setAttribute(
        "fill",
        "none"
    );


    line.classList.add(
        "connection-line"
    );


    // ======================================
    // PUT LINE BEHIND POINTS
    // ======================================

    const firstPoint =
        svg.querySelector(
            ".point-group"
        );


    if (firstPoint) {

        svg.insertBefore(
            line,
            firstPoint
        );

    }

    else {

        svg.appendChild(
            line
        );

    }


    console.log(
        "Line added to SVG"
    );
}


// ==========================================
// UPDATE POINT APPEARANCE
// ==========================================

function updatePointAppearance() {

    const groups =
        svg.querySelectorAll(
            ".point-group"
        );


    groups.forEach(
        (group, index) => {

            const circle =
                group.querySelector(
                    ".point-circle"
                );


            if (!circle) {

                return;

            }


            circle.classList.remove(
                "completed"
            );


            circle.classList.remove(
                "current"
            );


            // Already connected

            if (
                index <
                currentPointIndex
            ) {

                circle.classList.add(
                    "completed"
                );

            }


            // Current point

            if (
                index ===
                currentPointIndex
            ) {

                circle.classList.add(
                    "current"
                );

            }

        }
    );
}


// ==========================================
// WRONG POINT FEEDBACK
// ==========================================

function wrongPointFeedback(index) {

    const group =
        svg.querySelector(
            `.point-group[data-index="${index}"]`
        );


    if (!group) {

        return;

    }


    const circle =
        group.querySelector(
            ".point-circle"
        );


    if (!circle) {

        return;

    }


    circle.animate(
        [

            {
                transform:
                    "translateX(0)"
            },

            {
                transform:
                    "translateX(-5px)"
            },

            {
                transform:
                    "translateX(5px)"
            },

            {
                transform:
                    "translateX(-5px)"
            },

            {
                transform:
                    "translateX(0)"
            }

        ],

        {
            duration: 250
        }
    );
}


// ==========================================
// FADE OUT COMPLETED GAME ELEMENTS
// ==========================================

function fadeOutCompletedElements() {

    // Fade out all connection lines
    svg
        .querySelectorAll(".connection-line")
        .forEach(line => {

            line.classList.add("fade-out");

        });


    // Fade out all points
    svg
        .querySelectorAll(".point-group")
        .forEach(group => {

            group.classList.add("fade-out");

        });
}


// ==========================================
// COMPLETE LEVEL
// ==========================================

function completeLevel() {

    levelCompleted = true;


    // --------------------------------------
    // Complete sound
    // --------------------------------------

    // completeSound.currentTime = 0;
    // completeSound.play();


    // --------------------------------------
    // Reveal image
    // --------------------------------------

    backgroundImage.classList.add(
        "revealed"
    );

    // --------------------------------------
    // Fade out completed points and lines
    // --------------------------------------

    fadeOutCompletedElements();

    // --------------------------------------
    // Start random text disappearance
    // --------------------------------------

    eraseTextRandomly(100);


    // --------------------------------------
    // Stop pulse animation
    // --------------------------------------

    svg
        .querySelectorAll(
            ".point-circle.current"
        )
        .forEach(
            circle => {

                circle.classList.remove(
                    "current"
                );


                circle.classList.add(
                    "completed"
                );

            }
        );


    // ======================================
    // SHOW COMPLETION DIALOG
    // ======================================

    // const level =
    //     levels[currentLevelIndex];

    // // Show custom completion text

    // showLevelDialog(
    //     currentLevelIndex + 1
    // );

    // --------------------------------------
    // Last level / next level
    // --------------------------------------

    if (
        currentLevelIndex ===
        levels.length - 1
    ) {

        // messageElement.textContent =
        //     "🎉 You completed all levels!";

    }

    else {

        // messageElement.textContent =
        //     "🎉 Level complete!";

        nextButton.classList.remove(
            "hidden"
        );

    }


    // // Get custom message from level.js

    // const completionMessage =
    //     level.completionMessage ||
    //     "🎉 Level complete!";


    // levelDialogText.textContent =
    //     completionMessage;


    // levelDialog.classList.remove(
    //     "hidden"
    // );


    // --------------------------------------
    // Last level / next level
    // --------------------------------------

    if (
        currentLevelIndex ===
        levels.length - 1
    ) {

        // messageElement.textContent =
        //     "🎉 You completed all levels!";

    }

    else {

        // messageElement.textContent =
        //     "🎉 Level complete!";

        nextButton.classList.remove(
            "hidden"
        );

    }
}


// ==========================================
// CLOSE LEVEL DIALOG
// ==========================================

levelDialogButton.addEventListener(
    "click",
    () => {

        levelDialog.classList.add(
            "hidden"
        );

        levelDialog.classList.remove(
            "show",
            "button-visible"
        );


        // Trigger existing next-level logic

        document
            .getElementById("next-button")
            .click();

    }
);


// ==========================================
// RESTART
// ==========================================

restartButton.addEventListener(
    "click",
    function() {

        loadLevel(
            currentLevelIndex
        );

    }
);


// ==========================================
// NEXT LEVEL
// ==========================================

nextButton.addEventListener(
    "click",
    function() {

        if (
            currentLevelIndex >=
            levels.length - 1
        ) {

            return;

        }


        currentLevelIndex++;


        loadLevel(
            currentLevelIndex
        );

    }
);


// ==========================================
// TOGGLE NUMBERS
// ==========================================

numbersButton.addEventListener(
    "click",
    function() {

        numbersVisible =
            !numbersVisible;


        updateNumbersVisibility();

        updateNumbersButton();

    }
);


// ==========================================
// UPDATE NUMBER VISIBILITY
// ==========================================

function updateNumbersVisibility() {

    svg
        .querySelectorAll(
            ".point-number"
        )
        .forEach(
            number => {

                number.style.display =
                    numbersVisible
                        ? "block"
                        : "none";

            }
        );
}


// ==========================================
// UPDATE NUMBER BUTTON
// ==========================================

function updateNumbersButton() {

    if (
        !GAME_CONFIG.allowToggleNumbers
    ) {

        numbersButton.style.display =
            "none";

        return;

    }


    numbersButton.style.display =
        "inline-block";


    numbersButton.textContent =
        numbersVisible
            ? "Hide Numbers"
            : "Show Numbers";
}
