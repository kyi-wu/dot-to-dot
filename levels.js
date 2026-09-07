const levels = [
    // =====================================
    // LEVEL 0 — INTRO
    // =====================================

    {
        image:
            "images/level0.png",

        beforeConnectionImage:
            "images/level0_before_connection_image.png",

        beforeConnectionText:
            "images/level0_before_connection_text.png",

        showNumbers: true,

        // ---------------------------------
        // FREE CONNECTION MODE
        // ---------------------------------

        freeConnect: true,

        // Player completes the level
        // when this point is connected.
        completionPoint: 2,

        colors: {
            point: "#FFFFFF",
            pointStroke: "#333333",

            pointHover: "#EEEEEE",

            completedPoint: "#4cafad",
            completedPointStroke: "#4cafad",

            line: "#4cafad",

            number: "#333333"
        },

        points: [
            { x: 594, y: 120 },
            { x: 602, y: 278 },
            // { x: 946, y: 153 },
            // { x: 935, y: 96 },
            // { x: 839, y: 118 },
            // { x: 839, y: 206 },
            // { x: 944, y: 253 },
            // { x: 853, y: 291 },
            // { x: 1117, y: 112 },
            // { x: 1034, y: 109 },
            // { x: 1021, y: 285 },
            // { x: 1128, y: 272 },
            // { x: 1024, y: 190 },
            // { x: 1119, y: 190 },
            // { x: 1189, y: 94 },
            // { x: 1309, y: 99 },
            // { x: 1186, y: 272 },
            // { x: 1287, y: 280 },
            // { x: 1191, y: 185 },
            // { x: 1308, y: 187 }
        ]
    },

    // =====================================
    // LEVEL 1
    // =====================================

    {
    image: "images/level1.png",

    // Images shown before the player starts connecting
    beforeConnectionImage:
        "images/level1_before_connection_image.png",

    beforeConnectionText:
        "images/level1_before_connection_text.png",

    showNumbers: true,
            // -------------------------------------
        // LEVEL COLORS
        // -------------------------------------
        colors: {
            point: "#FFFFFF",
            pointStroke: "#333333",

            pointHover: "#EEEEEE",

            completedPoint: "#4cafad",
            completedPointStroke: "#4cafad",

            line: "#4cafad",

            number: "#333333"
        },

    points: [
            { x: 1384, y: 1024 },
            { x: 1380, y: 555 },
            { x: 1285, y: 313 },
            { x: 1237, y: 131 },
            { x: 1007, y: 61 },
            { x: 930, y: 307 },
            { x: 682, y: 741 },
            { x: 800, y: 781 },
            { x: 1005, y: 686 },
            { x: 1055, y: 752 },
            { x: 1077, y: 821 },
            { x: 887, y: 875 },
            { x: 984, y: 1029 }
    ]
    },

    // =====================================
    // LEVEL 2
    // =====================================

    {
        image: "images/level2.png",
        // Images shown before the player starts connecting
        beforeConnectionImage:
            "images/level2_before_connection_image.jpg",

        beforeConnectionText:
            "images/level2_before_connection_text.png",
            
        showNumbers: true,
            // -------------------------------------
        // LEVEL COLORS
        // -------------------------------------
        colors: {
            point: "#FFFFFF",
            pointStroke: "#333333",

            pointHover: "#EEEEEE",

            completedPoint: "#4cafad",
            completedPointStroke: "#4cafad",

            line: "#4cafad",

            number: "#333333"
        },

    points: [
            { x: 442, y: 157 },
            { x: 304, y: 391 },
            { x: 264, y: 506 },
            { x: 372, y: 559 },
            { x: 496, y: 967 },
            { x: 586, y: 557 },
            { x: 642, y: 501 },
            { x: 602, y: 426 },
            { x: 596, y: 340 },
            { x: 496, y: 277 }
    ]
    },


    // =====================================
    // LEVEL 3
    // =====================================

    {
        image: "images/level3.png",

        // Images shown before the player starts connecting
        beforeConnectionImage:
            "images/level3_before_connection_image.jpg",

        beforeConnectionText:
            "images/level3_before_connection_text.png",

        showNumbers: true,

                // -------------------------------------
        // LEVEL COLORS
        // -------------------------------------
        colors: {
            point: "#FFFFFF",
            pointStroke: "#333333",

            pointHover: "#EEEEEE",

            completedPoint: "#4CAF50",
            completedPointStroke: "#388E3C",

            line: "#4CAF50",

            number: "#333333"
        },

        points: [

            { x: 400, y: 100 },
            { x: 450, y: 180 },
            { x: 520, y: 220 },
            { x: 470, y: 280 },
            { x: 500, y: 370 },
            { x: 400, y: 330 },
            { x: 300, y: 370 },
            { x: 330, y: 280 },
            { x: 280, y: 220 },
            { x: 350, y: 180 }

        ]
    },


    // =====================================
    // LEVEL 4
    // =====================================

    {
        image: "images/level4.png",

        // Images shown before the player starts connecting
        beforeConnectionImage:
            "images/level4_before_connection_image.jpg",

        beforeConnectionText:
            "images/level4_before_connection_text.png",


        showNumbers: true,

        // -------------------------------------
        // LEVEL COLORS
        // -------------------------------------
        colors: {
            point: "#FFFFFF",
            pointStroke: "#333333",

            pointHover: "#EEEEEE",

            completedPoint: "#4CAF50",
            completedPointStroke: "#388E3C",

            line: "#4CAF50",

            number: "#333333"
        },

        points: [

            { x: 200, y: 120 },
            { x: 280, y: 100 },
            { x: 360, y: 130 },
            { x: 440, y: 100 },
            { x: 520, y: 150 },
            { x: 570, y: 230 },
            { x: 540, y: 310 },
            { x: 470, y: 360 },
            { x: 400, y: 400 },
            { x: 320, y: 360 },
            { x: 250, y: 400 },
            { x: 180, y: 330 },
            { x: 140, y: 240 }

        ]
    },

    // =====================================
    // LEVEL 5 — END
    // =====================================

    {
        image:
            "images/level5.png",

        beforeConnectionImage:
            "images/level5_before_connection_image.png",

        beforeConnectionText:
            "images/level5_before_connection_text.png",

        showNumbers: true,

        // Free connection mode
        freeConnect: true,

        // Change this to whatever point
        // should trigger completion.
        completionPoint: 8,

        // This is the final level
        finalLevel: true,

        colors: {
            point: "#FFFFFF",
            pointStroke: "#333333",

            pointHover: "#EEEEEE",

            completedPoint: "#4cafad",
            completedPointStroke: "#4cafad",

            line: "#4cafad",

            number: "#333333"
        },

        points: [
            // 你的 Level 5 points
        ]
    }

];