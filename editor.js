// ==========================================
// CONFIG
// ==========================================

const SVG_WIDTH = 800;
const SVG_HEIGHT = 600;

const SVG_NS =
    "http://www.w3.org/2000/svg";


// ==========================================
// ELEMENTS
// ==========================================

const svg =
    document.getElementById(
        "editorSvg"
    );

const editorImage =
    document.getElementById(
        "editorImage"
    );

const imageInput =
    document.getElementById(
        "imageInput"
    );

const undoButton =
    document.getElementById(
        "undoButton"
    );

const clearButton =
    document.getElementById(
        "clearButton"
    );

const exportButton =
    document.getElementById(
        "exportButton"
    );

const copyButton =
    document.getElementById(
        "copyButton"
    );

const imagePathInput =
    document.getElementById(
        "imagePath"
    );

const showNumbersInput =
    document.getElementById(
        "showNumbers"
    );

const pointCount =
    document.getElementById(
        "pointCount"
    );

const pointList =
    document.getElementById(
        "pointList"
    );

const exportOutput =
    document.getElementById(
        "exportOutput"
    );


// ==========================================
// DATA
// ==========================================

let points = [];


// ==========================================
// LOAD IMAGE
// ==========================================

imageInput.addEventListener(
    "change",
    function(event) {

        const file =
            event.target.files[0];

        if (!file) {
            return;
        }


        const reader =
            new FileReader();


        reader.onload =
            function(e) {

                editorImage.setAttribute(
                    "href",
                    e.target.result
                );

            };


        reader.readAsDataURL(file);


        // Automatically suggest image filename

        imagePathInput.value =
            "images/" + file.name;

    }
);


// ==========================================
// CLICK SVG TO ADD POINT
// ==========================================

svg.addEventListener(
    "click",
    function(event) {

        // ----------------------------------
        // Convert mouse position to SVG
        // coordinates.
        // ----------------------------------

        const point =
            getSVGPoint(event);


        // ----------------------------------
        // Add point
        // ----------------------------------

        points.push({
            x: Math.round(point.x),
            y: Math.round(point.y)
        });


        renderPoints();

    }
);


// ==========================================
// GET SVG COORDINATES
// ==========================================

function getSVGPoint(event) {

    const rect =
        svg.getBoundingClientRect();


    const scaleX =
        SVG_WIDTH /
        rect.width;


    const scaleY =
        SVG_HEIGHT /
        rect.height;


    const x =
        (event.clientX - rect.left)
        * scaleX;


    const y =
        (event.clientY - rect.top)
        * scaleY;


    return {
        x,
        y
    };

}


// ==========================================
// RENDER POINTS
// ==========================================

function renderPoints() {

    // --------------------------------------
    // Remove existing points
    // --------------------------------------

    svg.querySelectorAll(
        ".editor-point, .editor-number"
    ).forEach(
        element => element.remove()
    );


    // --------------------------------------
    // Create points
    // --------------------------------------

    points.forEach(
        (point, index) => {

            // ------------------------------
            // Circle
            // ------------------------------

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
                9
            );

            circle.classList.add(
                "editor-point"
            );


            svg.appendChild(
                circle
            );


            // ------------------------------
            // Number
            // ------------------------------

            if (
                showNumbersInput.checked
            ) {

                const number =
                    document.createElementNS(
                        SVG_NS,
                        "text"
                    );


                number.setAttribute(
                    "x",
                    point.x
                );

                number.setAttribute(
                    "y",
                    point.y + 5
                );

                number.classList.add(
                    "editor-number"
                );


                number.textContent =
                    index + 1;


                svg.appendChild(
                    number
                );

            }

        }
    );


    updatePointList();

    updatePointCount();

    updateExport();

}


// ==========================================
// UPDATE POINT LIST
// ==========================================

function updatePointList() {

    pointList.innerHTML = "";


    points.forEach(
        (point, index) => {

            const row =
                document.createElement(
                    "div"
                );


            row.classList.add(
                "point-item"
            );


            const text =
                document.createElement(
                    "span"
                );


            text.textContent =
                `${index + 1}: (${point.x}, ${point.y})`;


            const deleteButton =
                document.createElement(
                    "button"
                );


            deleteButton.textContent =
                "Delete";


            deleteButton.addEventListener(
                "click",
                function() {

                    deletePoint(index);

                }
            );


            row.appendChild(text);

            row.appendChild(
                deleteButton
            );


            pointList.appendChild(
                row
            );

        }
    );

}


// ==========================================
// DELETE POINT
// ==========================================

function deletePoint(index) {

    points.splice(
        index,
        1
    );


    renderPoints();

}


// ==========================================
// UNDO
// ==========================================

undoButton.addEventListener(
    "click",
    function() {

        if (points.length === 0) {
            return;
        }


        points.pop();


        renderPoints();

    }
);


// ==========================================
// CLEAR
// ==========================================

clearButton.addEventListener(
    "click",
    function() {

        if (points.length === 0) {
            return;
        }


        const confirmed =
            confirm(
                "Remove all points?"
            );


        if (!confirmed) {
            return;
        }


        points = [];


        renderPoints();

    }
);


// ==========================================
// SHOW / HIDE NUMBERS
// ==========================================

showNumbersInput.addEventListener(
    "change",
    function() {

        renderPoints();

    }
);


// ==========================================
// UPDATE COUNT
// ==========================================

function updatePointCount() {

    pointCount.textContent =
        points.length;

}


// ==========================================
// EXPORT
// ==========================================

function updateExport() {

    const imagePath =
        imagePathInput.value.trim();


    const showNumbers =
        showNumbersInput.checked;


    const pointsText =
        points
            .map(
                point =>
                    `            { x: ${point.x}, y: ${point.y} }`
            )
            .join(",\n");


    const output = `{
    image: "${imagePath}",

    showNumbers: ${showNumbers},

    points: [
${pointsText}
    ]
}`;


    exportOutput.value =
        output;

}


// ==========================================
// EXPORT BUTTON
// ==========================================

exportButton.addEventListener(
    "click",
    function() {

        updateExport();

        exportOutput.select();

    }
);


// ==========================================
// COPY
// ==========================================

copyButton.addEventListener(
    "click",
    async function() {

        updateExport();


        try {

            await navigator.clipboard.writeText(
                exportOutput.value
            );


            copyButton.textContent =
                "Copied!";


            setTimeout(
                () => {

                    copyButton.textContent =
                        "Copy to Clipboard";

                },
                1500
            );

        }

        catch (error) {

            exportOutput.select();

            document.execCommand(
                "copy"
            );

        }

    }
);


// ==========================================
// IMAGE PATH CHANGE
// ==========================================

imagePathInput.addEventListener(
    "input",
    updateExport
);


// ==========================================
// INITIAL RENDER
// ==========================================

renderPoints();