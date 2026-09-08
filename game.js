// ==========================================
// GAME CONFIG
// ==========================================

const GAME_CONFIG = {
    showNumbers: true,
    allowToggleNumbers: true
};

// ==========================================
// ENDING PAGE CONFIG
// ==========================================

const ENDING_CONFIG = {
    text: "Thank you for playing",
    backgroundColor: "#dae6ab",
    textColor: "#FFFFFF",
    fontFamily: "Reenie Beanie",
    fontSize: "48px",
    fadeDuration: "2s"
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
// DOM ELEMENTS
// ==========================================

const svg = document.getElementById("game-svg");
const backgroundImage = document.getElementById("background-image");
const currentLevelElement = document.getElementById("currentLevel");
const restartButton = document.getElementById("restart-button");
const undoButton = document.getElementById("undo-button");
const numbersButton = document.getElementById("numbers-button");
const nextButton = document.getElementById("next-button");
const messageElement = document.getElementById("message");

// 隐藏 Undo 按钮
if (undoButton) {
    undoButton.style.display = "none";
}

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
endingPage.style.pointerEvents = "none";
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

document.addEventListener("click", function startMusic() {
    backgroundMusic.play().catch(() => {});
    document.removeEventListener("click", startMusic);
});

// ==========================================
// SVG NAMESPACE & LAYER CREATION
// ==========================================

const SVG_NS = "http://www.w3.org/2000/svg";

const beforeConnectionImage = document.createElementNS(SVG_NS, "image");
const beforeConnectionText = document.createElementNS(SVG_NS, "image");

backgroundImage.classList.add("background-image");
beforeConnectionImage.classList.add("before-connection-image");
beforeConnectionText.classList.add("before-connection-text");

svg.appendChild(backgroundImage);
svg.appendChild(beforeConnectionImage);
svg.appendChild(beforeConnectionText);

[backgroundImage, beforeConnectionImage, beforeConnectionText].forEach(image => {
    image.setAttribute("x", "0");
    image.setAttribute("y", "0");
    image.setAttribute("width", "100%");
    image.setAttribute("height", "100%");
    image.setAttribute("preserveAspectRatio", "xMidYMid meet");
    image.style.transition = "opacity 1.5s ease";
});

document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    stopCurrentStroke();
});

// ==========================================
// GAME STATE
// ==========================================

let currentLevelIndex = 0;
let currentPointIndex = -1;
let levelCompleted = false;
let numbersVisible = true;

// Dynamic drawing state for free connect
let isDrawing = false;
let strokeStartPoint = null;

// ==========================================
// IMAGE PRELOAD HELPER (核心解卡顿辅助方法)
// ==========================================

function preloadImages(urls) {
    const promises = urls.filter(url => url && url.trim() !== "").map(url => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = url;
            // 如果浏览器支持 decode，提前在后台线程解码图片，彻底避免卡顿
            if (img.decode) {
                img.decode().then(resolve).catch(resolve);
            } else {
                img.onload = resolve;
                img.onerror = resolve;
            }
        });
    });
    return Promise.all(promises);
}

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

async function loadLevel(levelIndex) {
    const level = levels[levelIndex];
    
    applyLevelColors(level);

    currentPointIndex = -1;
    levelCompleted = false;
    isDrawing = false;
    strokeStartPoint = null;

    numbersVisible = GAME_CONFIG.showNumbers && level.showNumbers;
    currentLevelElement.textContent = levelIndex + 1;
    messageElement.textContent = "";
    nextButton.classList.add("hidden");

    endingPage.style.opacity = "0";
    endingPage.style.pointerEvents = "none";

    // 1. 先将图片透明度置 0，防止切换时的残影
    beforeConnectionImage.style.opacity = "0";
    beforeConnectionText.style.opacity = "0";
    backgroundImage.style.opacity = "0";

    // 2. 预加载当前关卡的所有图片，确保它们完全准备好
    const imagesToLoad = [
        level.image,
        level.beforeConnectionImage,
        level.beforeConnectionText
    ];

    await preloadImages(imagesToLoad);

    // 3. 图片加载/解码完成后，同步设置 href 并同时显示
    backgroundImage.setAttribute("href", level.image || "");
    beforeConnectionImage.setAttribute("href", level.beforeConnectionImage || "");
    beforeConnectionText.setAttribute("href", level.beforeConnectionText || "");

    // 使用 requestAnimationFrame 保证浏览器在一帧内同步渲染淡入
    requestAnimationFrame(() => {
        beforeConnectionImage.style.opacity = "1";
        beforeConnectionText.style.opacity = "1";
        backgroundImage.style.opacity = "1";
    });

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

    const hitArea = document.createElementNS(SVG_NS, "circle");
    hitArea.setAttribute("cx", point.x);
    hitArea.setAttribute("cy", point.y);
    hitArea.setAttribute("r", "30");
    hitArea.setAttribute("fill", "transparent");
    hitArea.setAttribute("pointer-events", "all");
    hitArea.style.cursor = "pointer";

    const circle = document.createElementNS(SVG_NS, "circle");
    circle.setAttribute("cx", point.x);
    circle.setAttribute("cy", point.y);
    circle.setAttribute("r", "10");
    circle.classList.add("point-circle");

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

    [hitArea, circle, number].forEach(elem => {
        elem.addEventListener("click", function(event) {
            event.stopPropagation();
            handlePointClick(index);
        });
    });
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

function handleFreeConnect(index) {
    const level = levels[currentLevelIndex];

    if (!isDrawing) {
        isDrawing = true;
        strokeStartPoint = index;
        currentPointIndex = index;
        clickSound.currentTime = 0;
        clickSound.play();
        updatePointAppearance();
        return;
    }

    if (index === currentPointIndex) return;

    clickSound.currentTime = 0;
    clickSound.play();
    drawLine(currentPointIndex, index);

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

    setTimeout(() => {
        if (currentLevelIndex < levels.length - 1) {
            nextButton.classList.remove("hidden");
        } else {
            showEndingPage();
        }
    }, 1500);
}

function showEndingPage() {
    endingPage.style.pointerEvents = "all";
    endingPage.style.opacity = "1";
}

// ==========================================
// NUMBERS VISIBILITY CONTROLS
// ==========================================

function updateNumbersVisibility() {
    svg.querySelectorAll(".point-number").forEach(number => {
        number.style.display = numbersVisible ? "block" : "none";
    });
}

function updateNumbersButton() {
    if (!numbersButton) return;
    numbersButton.style.display = GAME_CONFIG.allowToggleNumbers ? "inline-block" : "none";
    numbersButton.textContent = numbersVisible ? "Hide Numbers" : "Show Numbers";
}

if (numbersButton) {
    numbersButton.addEventListener("click", () => {
        numbersVisible = !numbersVisible;
        updateNumbersVisibility();
        updateNumbersButton();
    });
}

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

// Start game
loadLevel(currentLevelIndex);