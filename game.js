// ==========================================
// GAME CONFIG
// ==========================================

const GAME_CONFIG = {
    showNumbers: true,
    allowToggleNumbers: true
};


// ==========================================
// DOM ELEMENTS
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
// SVG NAMESPACE
// ==========================================

const SVG_NS = "http://www.w3.org/2000/svg";


// ==========================================
// GAME STATE
// ==========================================

let currentLevelIndex = 0;

let currentPointIndex = 0;

let levelCompleted = false;

let numbersVisible = true;


// ==========================================
// START
// ==========================================

loadLevel(currentLevelIndex);


// ==========================================
// LOAD LEVEL
// ==========================================

function loadLevel(levelIndex) {

    const level = levels[levelIndex];

    currentPointIndex = 0;

    levelCompleted = false;

    numbersVisible =
        GAME_CONFIG.showNumbers &&
        level.showNumbers;

    currentLevelElement.textContent =
        levelIndex + 1;

    messageElement.textContent = "";

    nextButton.classList.add("hidden");


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

    group.dataset.index = index;


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

    hitArea.style.cursor = "pointer";


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
    // NUMBER *数字位置
    // ======================================

    const number =
        document.createElementNS(
            SVG_NS,
            "text"
        );


    // 数字在中心
    // number.setAttribute(
    //     "x",
    //     point.x
    // );

    // number.setAttribute(
    //     "y",
    //     point.y + 5
    // );

    // number.setAttribute(
    //     "text-anchor",
    //     "middle"
    // );


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

    group.appendChild(hitArea);

    group.appendChild(circle);

    group.appendChild(number);


    // ======================================
    // ADD TO SVG
    // ======================================

    svg.appendChild(group);


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
    // Correct point
    // --------------------------------------

    if (
        index === currentPointIndex
    ) {

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

    line.setAttribute(
        "stroke",
        "#4CAF50"
    );

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
// COMPLETE LEVEL
// ==========================================

function completeLevel() {

    levelCompleted = true;


    // Reveal image

    backgroundImage.classList.add(
        "revealed"
    );


    // Stop pulse animation

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


    // --------------------------------------
    // Message
    // --------------------------------------

    if (
        currentLevelIndex ===
        levels.length - 1
    ) {

        messageElement.textContent =
            "🎉 You completed all levels!";

    }

    else {

        messageElement.textContent =
            "🎉 Level complete!";

        nextButton.classList.remove(
            "hidden"
        );

    }
}


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