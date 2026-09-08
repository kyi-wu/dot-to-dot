// ==========================================
// GAME CONFIG
// ==========================================

const GAME_CONFIG = {
    showNumbers: true,
    allowToggleNumbers: true
};

// ==========================================
// ENDING PAGE CONFIG (自定义 Ending 页面样式)
// ==========================================

const ENDING_CONFIG = {
    text: "Thank you for playing :)",
    backgroundColor: "#dae6ab", // 背景颜色 (可自定义)
    textColor: "#FFFFFF",       // 文字颜色 (可自定义)
    fontFamily: "Reenie Beanie", // 字体 (可自定义)
    fontSize: "52px",           // 字体大小
    fadeDuration: "2s"          // 淡入动画时长
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

// 创建 ENDING PAGE 节点
const endingPage = document.createElement("div");
endingPage.classList.add("ending-page");
endingPage.style.position = "fixed";
endingPage.style.top = "0";
endingPage.style.left = "0";
endingPage.style.width = "100vw";
endingPage.style.height = "100vh";
endingPage.style.backgroundColor = ENDING_CONFIG.backgroundColor;
endingPage.style.display = "flex";
endingPage.style.justifyContent = "center";
endingPage.style.alignItems = "center";
endingPage.style.opacity = "0";
endingPage.style.pointerEvents = "none"; // 初始不可交互
endingPage.style.transition = `opacity ${ENDING_CONFIG.fadeDuration} ease`;
endingPage.style.zIndex = "9999";

const endingText = document.createElement("h1");
endingText.textContent = ENDING_CONFIG.text;
endingText.style.color = ENDING_CONFIG.textColor;
endingText.style.fontFamily = ENDING_CONFIG.fontFamily;
endingText.style.fontSize = ENDING_CONFIG.fontSize;
endingText.style.margin = "0";
endingText.style.letterSpacing = "2px";

endingPage.appendChild(endingText);
document.body.appendChild(endingPage);


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

// 按从下到上的顺序添加到 SVG
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

// 全局禁用右键默认菜单，并在自由连线时中断当前笔画
document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    stopCurrentStroke();
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
let hasShownFreeConnectHint = false;

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

    currentPointIndex = -1;
    levelCompleted = false;
    isDrawing = false;
    strokeStartPoint = null;
    currentStrokeLines = [];
    completedStrokes = [];

    numbersVisible = GAME_CONFIG.showNumbers && level.showNumbers;
    currentLevelElement.textContent = levelIndex + 1;
    messageElement.textContent = "";
    nextButton.classList.add("hidden");

    // Hide Ending Page on reload
    endingPage.style.opacity = "0";
    endingPage.style.pointerEvents = "none";

    // SET IMAGES
    backgroundImage.classList.remove("revealed");
    backgroundImage.setAttribute("href", level.image);
    beforeConnectionImage.setAttribute("href", level.beforeConnectionImage || "");
    beforeConnectionText.setAttribute("href", level.beforeConnectionText || "");

    svg.insertBefore(beforeConnectionImage, beforeConnectionText);
    svg.insertBefore(backgroundImage, beforeConnectionImage);

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
    svg.querySelectorAll(".connection-line, .point-group, .free-connect-hint").forEach(element => {
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

    const targetIndex = currentPointIndex === -1 ? 0 : currentPointIndex;

    if (index === targetIndex) {
        clickSound.currentTime = 0;
        clickSound.play();

        if (currentPointIndex > 0) {
            drawLine(currentPointIndex - 1, currentPointIndex);
        }

        currentPointIndex = targetIndex + 1;
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
// FREE CONNECTION MODE (自由连线模式)
// ==========================================

function handleFreeConnect(index) {
    const level = levels[currentLevelIndex];

    if (!isDrawing) {
        isDrawing = true;
        strokeStartPoint = index;
        currentPointIndex = index;
        clickSound.currentTime = 0;
        clickSound.play();
        updatePointAppearance();

        if (!hasShownFreeConnectHint) {
            showFreeConnectHint(index);
            hasShownFreeConnectHint = true;
        }
        return;
    }

    if (index === currentPointIndex) return;

    clickSound.currentTime = 0;
    clickSound.play();
    drawFreeLine(currentPointIndex, index);

    currentPointIndex = index;
    updatePointAppearance();

    const completionIndex = level.completionPoint - 1;
    if (index === completionIndex) {
        completeLevel();
    }
}

// ==========================================
// 自由连线右键提示框
// ==========================================

function showFreeConnectHint(pointIndex) {
    const level = levels[currentLevelIndex];
    const point = level.points[pointIndex];
    if (!point) return;

    const svgPoint = svg.createSVGPoint();
    svgPoint.x = point.x;
    svgPoint.y = point.y;
    const screenPos = svgPoint.matrixTransform(svg.getScreenCTM());

    const hintElement = document.createElement("div");
    hintElement.classList.add("free-connect-hint");
    hintElement.textContent = "Right click to end a connection";

    hintElement.style.position = "fixed";
    hintElement.style.left = `${screenPos.x - 200}px`;
    hintElement.style.top = `${screenPos.y - 20}px`;
    hintElement.style.backgroundColor = "rgb(35, 108, 121)";
    hintElement.style.color = "#ffffff";
    hintElement.style.padding = "8px 14px";
    hintElement.style.borderRadius = "20px";
    hintElement.style.fontSize = "14px";
    hintElement.style.pointerEvents = "none";
    hintElement.style.zIndex = "1000";
    hintElement.style.whiteSpace = "nowrap";
    hintElement.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
    hintElement.style.opacity = "0";
    hintElement.style.transform = "translateY(0px)";
    hintElement.style.transition = "opacity 1.5s ease, transform 1.5s ease";

    document.body.appendChild(hintElement);

    requestAnimationFrame(() => {
        hintElement.style.opacity = "1";
        
        setTimeout(() => {
            hintElement.style.opacity = "0";
            hintElement.style.transform = "translateY(-15px)";
        }, 1500);

        setTimeout(() => {
            hintElement.remove();
        }, 3200);
    });
}

// ==========================================
// 右键停止连线逻辑
// ==========================================

function stopCurrentStroke() {
    if (levelCompleted) return;

    const level = levels[currentLevelIndex];

    if (level.freeConnect && isDrawing) {
        isDrawing = false;
        strokeStartPoint = null;
        currentPointIndex = -1;
        updatePointAppearance();
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
            if (isDrawing && index === currentPointIndex) {
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
// COMPLETE LEVEL
// ==========================================

function completeLevel() {
    levelCompleted = true;
    isDrawing = false;

    beforeConnectionText.style.opacity = "0";
    beforeConnectionImage.style.opacity = "0";

    fadeOutCompletedElements();

    svg.querySelectorAll(".point-circle.current").forEach(circle => {
        circle.classList.remove("current");
        circle.classList.add("completed");
    });

    // 判断是否为最后一关
    if (currentLevelIndex < levels.length - 1) {
        nextButton.classList.remove("hidden");
    } else {
        // 最后一关完成后，延迟 1.5 秒展示全屏 Ending Page 并定格
        setTimeout(() => {
            showEndingPage();
        }, 1500);
    }
}

// ==========================================
// SHOW ENDING PAGE
// ==========================================

function showEndingPage() {
    endingPage.style.pointerEvents = "all";
    endingPage.style.opacity = "1";
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