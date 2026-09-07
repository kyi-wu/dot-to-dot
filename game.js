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

const backgroundImage = document.getElementById("background-image");

const currentLevelElement = document.getElementById("currentLevel");

const restartButton = document.getElementById("restart-button");

const undoButton = document.getElementById("undo-button");

const numbersButton = document.getElementById("numbers-button");

const nextButton = document.getElementById("next-button");

const messageElement = document.getElementById("message");


// ==========================================
// SOUND 音效
// ==========================================

const clickSound = new Audio("sounds/click_sound.mp3");
clickSound.volume = 0.5;

// ==========================================
// BACKGROUND MUSIC
// ==========================================

const backgroundMusic = new Audio("sounds/background.mp3");
backgroundMusic.loop = true;
backgroundMusic.volume = 0.2;

// Try to start immediately
backgroundMusic.play().catch(() => {
    console.log("Waiting for user interaction to start music.");
});

// If autoplay is blocked, start music after the first user interaction
document.addEventListener("click", function startMusic() {
    backgroundMusic.play().catch(() => {});
    document.removeEventListener("click", startMusic);
});


// ==========================================
// LEVEL COMPLETION DIALOG
// ==========================================

const levelDialog = document.createElement("div");
levelDialog.classList.add("level-dialog", "hidden");

const levelDialogBox = document.createElement("div");
levelDialogBox.classList.add("level-dialog-box");

const levelDialogText = document.createElement("div");
levelDialogText.classList.add("level-dialog-text");

const levelDialogButton = document.createElement("button");
levelDialogButton.classList.add("level-dialog-button");
levelDialogButton.textContent = "Continue";

levelDialogBox.appendChild(levelDialogText);
levelDialogBox.appendChild(levelDialogButton);
levelDialog.appendChild(levelDialogBox);
document.getElementById("game-board").appendChild(levelDialog);


// ==========================================
// LEVEL COMPLETION DIALOG - Text
// ==========================================
const LEVEL_DIALOG_CONFIG = {
    1: {
        x1: 1071,
        y1: 646,
        x2: 1810,
        y2: 969,
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
// SHOW LEVEL DIALOG
// ==========================================

function showLevelDialog(levelNumber) {
    const config = LEVEL_DIALOG_CONFIG[levelNumber];
    if (!config) return;

    clearTimeout(dialogTimer);
    clearTimeout(typingTimer);
    clearTimeout(eraseTimer);

    levelDialog.classList.remove("show", "button-visible", "hidden");
    levelDialogText.textContent = "";
    levelDialogButton.style.opacity = "0";
    levelDialogButton.style.pointerEvents = "none";

    const topLeft = svg.createSVGPoint();
    topLeft.x = config.x1;
    topLeft.y = config.y1;

    const bottomRight = svg.createSVGPoint();
    bottomRight.x = config.x2;
    bottomRight.y = config.y2;

    const screenTopLeft = topLeft.matrixTransform(svg.getScreenCTM());
    const screenBottomRight = bottomRight.matrixTransform(svg.getScreenCTM());

    levelDialogBox.style.left = `${screenTopLeft.x}px`;
    levelDialogBox.style.top = `${screenTopLeft.y}px`;
    levelDialogBox.style.width = `${screenBottomRight.x - screenTopLeft.x}px`;
    levelDialogBox.style.height = `${screenBottomRight.y - screenTopLeft.y}px`;

    dialogTimer = setTimeout(() => {
        levelDialog.classList.add("show");
        typeText(config.text, 80);
    }, 0);
}

function typeText(text) {
    levelDialogText.textContent = text;
}

function showContinueButton() {
    levelDialog.classList.add("button-visible");
}

function fadeTextRandomly(speed) {
    clearTimeout(eraseTimer);
    const text = levelDialogText.textContent;
    levelDialogText.innerHTML = "";
    levelDialogText.style.whiteSpace = "pre-wrap";

    const characters = Array.from(text).map(char => {
        const span = document.createElement("span");
        span.textContent = char;
        span.style.display = "inline";
        span.style.opacity = "1";
        span.style.transition = "opacity 2.5s ease";
        levelDialogText.appendChild(span);
        return { char, span };
    });

    const availableCharacters = characters.filter(item => item.char.trim() !== "");
    const shuffled = [...availableCharacters].sort(() => Math.random() - 0.5);

    let index = 0;
    function fadeNextCharacter() {
        if (index >= shuffled.length) return;
        shuffled[index].span.style.opacity = "0";
        index++;
        eraseTimer = setTimeout(fadeNextCharacter, speed);
    }
    fadeNextCharacter();
}

// ==========================================
// SVG NAMESPACE & LAYER CREATION
// ==========================================

const SVG_NS = "http://www.w3.org/2000/svg";

// 创建图片层
const beforeConnectionImage = document.createElementNS(SVG_NS, "image");
const beforeConnectionText = document.createElementNS(SVG_NS, "image");

backgroundImage.classList.add("background-image");
beforeConnectionImage.classList.add("before-connection-image");
beforeConnectionText.classList.add("before-connection-text");

// 【修正层级】按从下到上的顺序添加到 SVG：
// 1. backgroundImage (最下层)
// 2. beforeConnectionImage (中间层)
// 3. beforeConnectionText (最上层)
svg.appendChild(backgroundImage);
svg.appendChild(beforeConnectionImage);
svg.appendChild(beforeConnectionText);

// 设置覆盖与过渡动画
[backgroundImage, beforeConnectionImage, beforeConnectionText].forEach(image => {
    image.setAttribute("x", "0");
    image.setAttribute("y", "0");
    image.setAttribute("width", "100%");
    image.setAttribute("height", "100%");
    image.setAttribute("preserveAspectRatio", "xMidYMid meet");
    image.style.transition = "opacity 1s ease";
});

// ==========================================
// GAME STATE
// ==========================================

let currentLevelIndex = 0;
let currentPointIndex = 0;
let levelCompleted = false;
let numbersVisible = true;

// Drawing state
let isDrawing = false;
let strokeStartPoint = null;
let currentStrokeLines = [];
let completedStrokes = [];

// Timers
let dialogTimer = null;
let typingTimer = null;
let eraseTimer = null;

// ==========================================
// APPLY LEVEL COLORS
// ==========================================

function applyLevelColors(level) {
    const colors = { ...DEFAULT_LEVEL_COLORS, ...(level.colors || {}) };

    svg.style.setProperty("--point-color", colors.point);
    svg.style.setProperty("--point-stroke-color", colors.pointStroke);
    svg.style.setProperty("--point-hover-color", colors.pointHover);
    svg.style.setProperty("--completed-point-color", colors.completedPoint);
    svg.style.setProperty("--completed-point-stroke-color", colors.completedPointStroke);
    svg.style.setProperty("--line-color", colors.line);
    svg.style.setProperty("--number-color", colors.number);
}

// ==========================================
// LOAD LEVEL
// ==========================================

function loadLevel(levelIndex) {
    const level = levels[levelIndex];
    
    applyLevelColors(level);

    currentPointIndex = 0;
    levelCompleted = false;
    isDrawing = false;
    strokeStartPoint = null;
    currentStrokeLines = [];
    completedStrokes = [];

    numbersVisible = GAME_CONFIG.showNumbers && level.showNumbers;
    currentLevelElement.textContent = levelIndex + 1;
    messageElement.textContent = "";
    nextButton.classList.add("hidden");

    // ==============================
    // SET IMAGES
    // ==============================

    // 最下层背景图
    backgroundImage.classList.remove("revealed");
    backgroundImage.setAttribute("href", level.image);

    // 中间层 beforeConnectionImage
    beforeConnectionImage.setAttribute("href", level.beforeConnectionImage || "");

    // 最上层 beforeConnectionText
    beforeConnectionText.setAttribute("href", level.beforeConnectionText || "");

    // 【保证层级顺序】如果后续有其他元素动态插入，此操作可重新确立底层渲染顺序
    svg.insertBefore(beforeConnectionImage, beforeConnectionText);
    svg.insertBefore(backgroundImage, beforeConnectionImage);

    // 重置透明度（显示顶层和中间层）
    beforeConnectionImage.style.opacity = "1";
    beforeConnectionText.style.opacity = "1";
    backgroundImage.style.opacity = "1";

    // Reset level dialog
    clearTimeout(dialogTimer);
    clearTimeout(typingTimer);
    clearTimeout(eraseTimer);

    levelDialog.classList.add("hidden");
    levelDialog.classList.remove("show", "button-visible");
    levelDialogText.textContent = "";

    // Remove old game elements
    svg.querySelectorAll(".connection-line, .point-group").forEach(element => {
        element.remove();
    });

    // Create points
    level.points.forEach((point, index) => {
        createPoint(point, index);
    });

    updateNumbersVisibility();
    updateNumbersButton();
    updatePointAppearance();
}

// ==========================================
// CREATE POINT
// ==========================================

function createPoint(point, index) {
    const group = document.createElementNS(SVG_NS, "g");
    group.classList.add("point-group");
    group.dataset.index = index;

    // Hit Area
    const hitArea = document.createElementNS(SVG_NS, "circle");
    hitArea.setAttribute("cx", point.x);
    hitArea.setAttribute("cy", point.y);
    hitArea.setAttribute("r", "30");
    hitArea.setAttribute("fill", "transparent");
    hitArea.setAttribute("pointer-events", "all");
    hitArea.style.cursor = "pointer";

    // Circle
    const circle = document.createElementNS(SVG_NS, "circle");
    circle.setAttribute("cx", point.x);
    circle.setAttribute("cy", point.y);
    circle.setAttribute("r", "10");
    circle.classList.add("point-circle");
    circle.style.transformBox = "fill-box";
    circle.style.transformOrigin = "center";

    // Number
    const number = document.createElementNS(SVG_NS, "text");
    number.setAttribute("x", point.x - 10);
    number.setAttribute("y", point.y - 10);
    number.setAttribute("text-anchor", "end");
    number.classList.add("point-number");
    number.textContent = index + 1;

    group.appendChild(hitArea);
    group.appendChild(circle);
    group.appendChild(number);

    svg.appendChild(group);

    // Event Listeners
    [hitArea, circle, number].forEach(elem => {
        elem.addEventListener("click", function(event) {
            event.stopPropagation();
            handlePointClick(index);
        });
    });
}

function handleSequentialConnect(index) {
    const level = levels[currentLevelIndex];

    if (index === currentPointIndex) {
        clickSound.currentTime = 0;
        clickSound.play();

        if (currentPointIndex > 0) {
            drawLine(currentPointIndex - 1, currentPointIndex);
        }

        currentPointIndex++;
        updatePointAppearance();

        if (currentPointIndex >= level.points.length) {
            completeLevel();
        }
    } else {
        wrongPointFeedback(index);
    }
}

// ==========================================
// HANDLE POINT CLICK
// ==========================================

function handlePointClick(index) {
    if (levelCompleted) return;

    const level = levels[currentLevelIndex];

    if (level.freeConnect) {
        handleFreeConnect(index);
        return;
    }

    handleSequentialConnect(index);
}

function drawFreeLine(index1, index2) {
    const line = drawLine(index1, index2);
    if (line) {
        currentStrokeLines.push(line);
    }
}

// ==========================================
// FREE CONNECTION MODE
// ==========================================

function handleFreeConnect(index) {
    const level = levels[currentLevelIndex];

    if (!isDrawing) {
        isDrawing = true;
        strokeStartPoint = index;
        currentPointIndex = index;
        updatePointAppearance();
        return;
    }

    if (index === currentPointIndex) return;

    drawFreeLine(currentPointIndex, index);
    currentPointIndex = index;
    updatePointAppearance();

    const completionIndex = level.completionPoint - 1;
    if (index === completionIndex) {
        completeLevel();
    }
}

// ==========================================
// DRAW LINE
// ==========================================

function drawLine(index1, index2) {
    const level = levels[currentLevelIndex];
    const point1 = level.points[index1];
    const point2 = level.points[index2];

    const line = document.createElementNS(SVG_NS, "line");
    line.setAttribute("x1", point1.x);
    line.setAttribute("y1", point1.y);
    line.setAttribute("x2", point2.x);
    line.setAttribute("y2", point2.y);
    line.setAttribute("stroke-width", "5");
    line.setAttribute("stroke-linecap", "round");
    line.setAttribute("fill", "none");
    line.classList.add("connection-line");

    const firstPoint = svg.querySelector(".point-group");
    if (firstPoint) {
        svg.insertBefore(line, firstPoint);
    } else {
        svg.appendChild(line);
    }

    return line;
}

// ==========================================
// UPDATE POINT APPEARANCE
// ==========================================

function updatePointAppearance() {
    const groups = svg.querySelectorAll(".point-group");
    const level = levels[currentLevelIndex];

    groups.forEach((group, index) => {
        const circle = group.querySelector(".point-circle");
        if (!circle) return;

        circle.classList.remove("completed", "current");

        if (level.freeConnect) {
            if (index === currentPointIndex) {
                circle.classList.add("current");
            }
            return;
        }

        if (index < currentPointIndex) {
            circle.classList.add("completed");
        }
        if (index === currentPointIndex) {
            circle.classList.add("current");
        }
    });
}

// ==========================================
// WRONG POINT FEEDBACK
// ==========================================

function wrongPointFeedback(index) {
    const group = svg.querySelector(`.point-group[data-index="${index}"]`);
    if (!group) return;

    const circle = group.querySelector(".point-circle");
    if (!circle) return;

    circle.animate(
        [
            { transform: "translateX(0)" },
            { transform: "translateX(-5px)" },
            { transform: "translateX(5px)" },
            { transform: "translateX(-5px)" },
            { transform: "translateX(0)" }
        ],
        { duration: 250 }
    );
}

// ==========================================
// FADE OUT COMPLETED GAME ELEMENTS
// ==========================================

function fadeOutCompletedElements() {
    svg.querySelectorAll(".connection-line").forEach(line => {
        line.classList.add("fade-out");
    });

    svg.querySelectorAll(".point-group").forEach(group => {
        group.classList.add("fade-out");
    });
}

// ==========================================
// COMPLETE LEVEL (通关淡出逻辑)
// ==========================================

function completeLevel() {
    levelCompleted = true;

    // 1. beforeConnectionText 和 beforeConnectionImage 同时淡出，露出底层的 backgroundImage
    beforeConnectionText.style.opacity = "0";
    beforeConnectionImage.style.opacity = "0";

    // 2. 淡出连接线和点
    fadeOutCompletedElements();

    // 3. 停止动画
    svg.querySelectorAll(".point-circle.current").forEach(circle => {
        circle.classList.remove("current");
        circle.classList.add("completed");
    });

    // 4. 显示下一关按钮
    if (currentLevelIndex < levels.length - 1) {
        nextButton.classList.remove("hidden");
    }
}

// ==========================================
// CLOSE LEVEL DIALOG
// ==========================================

levelDialogButton.addEventListener("click", () => {
    levelDialog.classList.add("hidden");
    levelDialog.classList.remove("show", "button-visible");
    document.getElementById("next-button").click();
});

// ==========================================
// BUTTON CONTROLS
// ==========================================

restartButton.addEventListener("click", function() {
    loadLevel(currentLevelIndex);
});

nextButton.addEventListener("click", function() {
    if (currentLevelIndex >= levels.length - 1) return;
    currentLevelIndex++;
    loadLevel(currentLevelIndex);
});

// Start the game
loadLevel(currentLevelIndex);