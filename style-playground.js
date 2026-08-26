// ==========================================
// ELEMENTS
// ==========================================

const preview =
    document.getElementById("gamePreview");

const gameArea =
    document.getElementById("gameArea");

const pointShapes =
    document.querySelectorAll(".point-shape");

const pointNumbers =
    document.querySelectorAll(".point-number");

const currentPoint =
    document.querySelector(".current-point");

const lines =
    document.querySelectorAll(".preview-line");

const dialogue =
    document.getElementById("dialogue");


// ==========================================
// POINT CONTROLS
// ==========================================

const pointShape =
    document.getElementById("pointShape");

const pointSize =
    document.getElementById("pointSize");

const pointFill =
    document.getElementById("pointFill");

const pointBorder =
    document.getElementById("pointBorder");


// ==========================================
// NUMBER CONTROLS
// ==========================================

const showNumbers =
    document.getElementById("showNumbers");

const numberSize =
    document.getElementById("numberSize");


// ==========================================
// LINE CONTROLS
// ==========================================

const lineStyle =
    document.getElementById("lineStyle");

const lineWidth =
    document.getElementById("lineWidth");

const lineColor =
    document.getElementById("lineColor");


// ==========================================
// ANIMATION
// ==========================================

const pointAnimation =
    document.getElementById("pointAnimation");


// ==========================================
// GAME AREA BACKGROUND
// ==========================================

const gameAreaBackground =
    document.getElementById(
        "gameAreaBackground"
    );

const backgroundImage =
    document.getElementById(
        "backgroundImage"
    );

const backgroundFit =
    document.getElementById(
        "backgroundFit"
    );

const clearBackground =
    document.getElementById(
        "clearBackground"
    );

const gameBackground =
    document.getElementById(
        "gameBackground"
    );


// ==========================================
// REVEAL IMAGE
// ==========================================

const revealImageInput =
    document.getElementById(
        "revealImageInput"
    );

const revealFit =
    document.getElementById(
        "revealFit"
    );

const revealOpacity =
    document.getElementById(
        "revealOpacity"
    );

const clearReveal =
    document.getElementById(
        "clearReveal"
    );

const revealImage =
    document.getElementById(
        "revealImage"
    );


// ==========================================
// FRAME
// ==========================================

const frameStyle =
    document.getElementById(
        "frameStyle"
    );


// ==========================================
// DIALOGUE
// ==========================================

const showDialogue =
    document.getElementById(
        "showDialogue"
    );

const character =
    document.getElementById(
        "character"
    );

const speaker =
    document.getElementById(
        "speaker"
    );

const dialogueText =
    document.getElementById(
        "dialogueText"
    );


// ==========================================
// UPDATE EVERYTHING
// ==========================================

function updatePreview() {

    updatePoints();

    updateNumbers();

    updateLines();

    updateAnimation();

    updateBackground();

    updateReveal();

    updateFrame();

    updateDialogue();

}


// ==========================================
// POINTS
// ==========================================

function updatePoints() {

    const size =
        pointSize.value;


    pointShapes.forEach(
        shape => {

            shape.setAttribute(
                "r",
                size
            );

            shape.setAttribute(
                "fill",
                pointFill.value
            );

            shape.setAttribute(
                "stroke",
                pointBorder.value
            );

        }
    );

}


// ==========================================
// POINT SHAPE
// ==========================================

function updatePointShape() {

    const shape =
        pointShape.value;


    pointShapes.forEach(
        point => {

            const parent =
                point.parentElement;


            parent.classList.remove(
                "shape-star",
                "shape-diamond",
                "shape-heart"
            );


            if (
                shape === "star"
            ) {

                parent.classList.add(
                    "shape-star"
                );

            }


            if (
                shape === "diamond"
            ) {

                parent.classList.add(
                    "shape-diamond"
                );

            }


            if (
                shape === "heart"
            ) {

                parent.classList.add(
                    "shape-heart"
                );

            }

        }
    );

}


// ==========================================
// NUMBERS
// ==========================================

function updateNumbers() {

    pointNumbers.forEach(
        number => {

            number.style.display =
                showNumbers.checked
                    ? "block"
                    : "none";


            number.style.fontSize =
                `${numberSize.value}px`;

        }
    );

}


// ==========================================
// LINES
// ==========================================

function updateLines() {

    lines.forEach(
        line => {

            line.setAttribute(
                "stroke",
                lineColor.value
            );


            line.setAttribute(
                "stroke-width",
                lineWidth.value
            );


            if (
                lineStyle.value === "solid"
            ) {

                line.setAttribute(
                    "stroke-dasharray",
                    "none"
                );

            }


            if (
                lineStyle.value === "dashed"
            ) {

                line.setAttribute(
                    "stroke-dasharray",
                    "12 8"
                );

            }


            if (
                lineStyle.value === "dotted"
            ) {

                line.setAttribute(
                    "stroke-dasharray",
                    "2 8"
                );

            }

        }
    );

}


// ==========================================
// POINT ANIMATION
// ==========================================

function updateAnimation() {

    currentPoint.classList.remove(
        "animation-pulse",
        "animation-bounce",
        "animation-spin"
    );


    const animation =
        pointAnimation.value;


    if (
        animation === "pulse"
    ) {

        currentPoint.classList.add(
            "animation-pulse"
        );

    }


    if (
        animation === "bounce"
    ) {

        currentPoint.classList.add(
            "animation-bounce"
        );

    }


    if (
        animation === "spin"
    ) {

        currentPoint.classList.add(
            "animation-spin"
        );

    }

}


// ==========================================
// GAME AREA BACKGROUND COLOR
// ==========================================

function updateBackgroundColor() {

    gameArea.style.backgroundColor =
        gameAreaBackground.value;

}


// ==========================================
// BACKGROUND IMAGE
// ==========================================

function loadBackgroundImage(
    file
) {

    if (!file) {
        return;
    }


    const imageURL =
        URL.createObjectURL(file);


    gameBackground.src =
        imageURL;


    gameBackground.style.display =
        "block";

}


// ==========================================
// BACKGROUND IMAGE FIT
// ==========================================

function updateBackgroundFit() {

    gameBackground.style.objectFit =
        backgroundFit.value;

}


// ==========================================
// CLEAR BACKGROUND IMAGE
// ==========================================

function removeBackgroundImage() {

    gameBackground.src = "";

    gameBackground.style.display =
        "none";

}


// ==========================================
// UPDATE BACKGROUND
// ==========================================

function updateBackground() {

    updateBackgroundColor();

    updateBackgroundFit();

}


// ==========================================
// REVEAL IMAGE
// ==========================================

function loadRevealImage(
    file
) {

    if (!file) {
        return;
    }


    const imageURL =
        URL.createObjectURL(file);


    revealImage.src =
        imageURL;


    revealImage.style.display =
        "block";

}


// ==========================================
// REVEAL IMAGE FIT
// ==========================================

function updateRevealFit() {

    revealImage.style.objectFit =
        revealFit.value;

}


// ==========================================
// REVEAL OPACITY
// ==========================================

function updateRevealOpacity() {

    revealImage.style.opacity =
        Number(
            revealOpacity.value
        ) / 100;

}


// ==========================================
// CLEAR REVEAL IMAGE
// ==========================================

function removeRevealImage() {

    revealImage.src = "";

    revealImage.style.display =
        "none";

}


// ==========================================
// UPDATE REVEAL
// ==========================================

function updateReveal() {

    updateRevealFit();

    updateRevealOpacity();

}


// ==========================================
// FRAME
// ==========================================

function updateFrame() {

    preview.classList.remove(
        "frame-simple",
        "frame-rounded",
        "frame-dashed",
        "frame-handdrawn"
    );


    preview.classList.add(
        `frame-${frameStyle.value}`
    );

}


// ==========================================
// DIALOGUE
// ==========================================

function updateDialogue() {

    dialogue.style.display =
        showDialogue.checked
            ? "flex"
            : "none";


    document.querySelector(
        ".character"
    ).textContent =
        character.value;


    document.querySelector(
        ".speaker"
    ).textContent =
        speaker.value;


    document.querySelector(
        ".dialogue-text"
    ).textContent =
        dialogueText.value;

}


// ==========================================
// SPECIAL POINT SHAPES
// ==========================================

const shapeStyle =
    document.createElement("style");


shapeStyle.textContent = `

.shape-star .point-shape {

    clip-path:
        polygon(
            50% 0%,
            61% 35%,
            98% 35%,
            68% 57%,
            79% 92%,
            50% 70%,
            21% 92%,
            32% 57%,
            2% 35%,
            39% 35%
        );

    stroke: none;
}


.shape-diamond .point-shape {

    transform:
        rotate(45deg);
}


.shape-heart .point-shape {

    clip-path:
        path(
            "M50 90
             C10 60 0 40 20 20
             C35 5 50 20 50 30
             C50 20 65 5 80 20
             C100 40 90 60 50 90Z"
        );

    stroke: none;
}

`;


document.head.appendChild(
    shapeStyle
);


// ==========================================
// EVENT LISTENERS
// ==========================================


// ---------- POINT ----------

pointShape.addEventListener(
    "change",
    updatePointShape
);


pointSize.addEventListener(
    "input",
    updatePoints
);


pointFill.addEventListener(
    "input",
    updatePoints
);


pointBorder.addEventListener(
    "input",
    updatePoints
);


// ---------- NUMBERS ----------

showNumbers.addEventListener(
    "change",
    updateNumbers
);


numberSize.addEventListener(
    "input",
    updateNumbers
);


// ---------- LINES ----------

lineStyle.addEventListener(
    "change",
    updateLines
);


lineWidth.addEventListener(
    "input",
    updateLines
);


lineColor.addEventListener(
    "input",
    updateLines
);


// ---------- ANIMATION ----------

pointAnimation.addEventListener(
    "change",
    updateAnimation
);


// ---------- BACKGROUND COLOR ----------

gameAreaBackground.addEventListener(
    "input",
    updateBackgroundColor
);


// ---------- BACKGROUND IMAGE ----------

backgroundImage.addEventListener(
    "change",
    function () {

        const file =
            this.files[0];

        loadBackgroundImage(file);

    }
);


backgroundFit.addEventListener(
    "change",
    updateBackgroundFit
);


clearBackground.addEventListener(
    "click",
    removeBackgroundImage
);


// ---------- REVEAL IMAGE ----------

revealImageInput.addEventListener(
    "change",
    function () {

        const file =
            this.files[0];

        loadRevealImage(file);

    }
);


revealFit.addEventListener(
    "change",
    updateRevealFit
);


revealOpacity.addEventListener(
    "input",
    updateRevealOpacity
);


clearReveal.addEventListener(
    "click",
    removeRevealImage
);


// ---------- FRAME ----------

frameStyle.addEventListener(
    "change",
    updateFrame
);


// ---------- DIALOGUE ----------

showDialogue.addEventListener(
    "change",
    updateDialogue
);


character.addEventListener(
    "input",
    updateDialogue
);


speaker.addEventListener(
    "input",
    updateDialogue
);


dialogueText.addEventListener(
    "input",
    updateDialogue
);


// ==========================================
// RESET
// ==========================================

document
    .getElementById("resetButton")
    .addEventListener(
        "click",
        function () {

            location.reload();

        }
    );


// ==========================================
// EXPORT CSS
// ==========================================

document
    .getElementById("exportButton")
    .addEventListener(
        "click",
        generateCSS
    );


function generateCSS() {

    const css = `

/* =================================
   GAME AREA
================================= */

.game-area {

    background:
        ${gameAreaBackground.value};

}


/* =================================
   POINT
================================= */

.point-shape {

    fill:
        ${pointFill.value};

    stroke:
        ${pointBorder.value};

}


/* =================================
   POINT SIZE
================================= */

.preview-point .point-shape {

    r:
        ${pointSize.value};

}


/* =================================
   NUMBER
================================= */

.point-number {

    font-size:
        ${numberSize.value}px;

}


/* =================================
   LINE
================================= */

.connection-line {

    stroke:
        ${lineColor.value};

    stroke-width:
        ${lineWidth.value};

}


/* =================================
   DIALOGUE
================================= */

.dialogue-box {

    border:
        2px solid
        ${pointBorder.value};

}

`;

    document.getElementById(
        "exportOutput"
    ).value = css;

}


// ==========================================
// COPY CSS
// ==========================================

document
    .getElementById("copyButton")
    .addEventListener(
        "click",
        async function () {

            const output =
                document.getElementById(
                    "exportOutput"
                );


            if (!output.value) {

                generateCSS();

            }


            await navigator.clipboard.writeText(
                output.value
            );


            this.textContent =
                "Copied!";


            setTimeout(
                () => {

                    this.textContent =
                        "Copy CSS";

                },
                1500
            );

        }
    );


// ==========================================
// INITIALIZE
// ==========================================

removeBackgroundImage();

removeRevealImage();

updatePointShape();

updatePreview();