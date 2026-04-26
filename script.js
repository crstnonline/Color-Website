const colorPicker = document.getElementById("colorPicker");
const hexInput = document.getElementById("hexInput");
const rInput = document.getElementById("rInput");
const gInput = document.getElementById("gInput");
const bInput = document.getElementById("bInput");
const randomBtn = document.getElementById("randomBtn");
const colorBox = document.getElementById("colorBox");
const palette = document.getElementById("palette");



colorPicker.addEventListener("input", () => {
    updateColor(colorPicker.value);
});

hexInput.addEventListener("input", () => {
    if (isValidHex(hexInput.value)) {
        updateColor(hexInput.value);
    }
});

[rInput, gInput, bInput].forEach(input => {
    input.addEventListener("input", () => {
        let r = rInput.value;
        let g = gInput.value;
        let b = bInput.value;

        if (r !== "" && g !== "" && b !== "") {
            let hex = rgbToHex(r, g, b);
            updateColor(hex);
        }
    });
});

const themeToggle = document.getElementById("themeToggle");


if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀️";
}


themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        themeToggle.textContent = "☀️";
        localStorage.setItem("theme", "dark");
    } else {
        themeToggle.textContent = "🌙";
        localStorage.setItem("theme", "light");
    }
});

randomBtn.addEventListener("click", () => {
    let randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
    updateColor(randomColor);
});


function updateColor(color) {
    colorBox.style.backgroundColor = color;
    hexInput.value = color;
    colorPicker.value = color;

    let rgb = hexToRgb(color);
    rInput.value = rgb.r;
    gInput.value = rgb.g;
    bInput.value = rgb.b;

    generatePalette(color);
}


function generatePalette(baseColor) {
    palette.innerHTML = "";

    let darkestShade = shadeColor(baseColor, -40);

    for (let i = -2; i <= 2; i++) {
        let shade = shadeColor(baseColor, i * 20);

        let container = document.createElement("div");
        container.classList.add("palette-color");

        let square = document.createElement("div");
        square.classList.add("color-square");
        square.style.backgroundColor = shade;

        let label = document.createElement("span");
        label.textContent = shade;

        let button = document.createElement("button");
        button.textContent = "Copy";
        button.classList.add("copy-btn");

        button.addEventListener("click", () => {
            navigator.clipboard.writeText(shade);
            button.textContent = "Copied!";
            setTimeout(() => button.textContent = "Copy", 1000);
        });

        container.appendChild(square);
        container.appendChild(label);
        container.appendChild(button);

        palette.appendChild(container);
    }


}


function isValidHex(hex) {
    return /^#([0-9A-F]{3}){1,2}$/i.test(hex);
}

function shadeColor(color, percent) {
    let num = parseInt(color.slice(1), 16),
        amt = Math.round(2.55 * percent),
        R = (num >> 16) + amt,
        G = (num >> 8 & 0x00FF) + amt,
        B = (num & 0x0000FF) + amt;

    return "#" + (
        0x1000000 +
        (R < 255 ? (R < 0 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 0 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 0 ? 0 : B) : 255)
    ).toString(16).slice(1);
}

function hexToRgb(hex) {
    let bigint = parseInt(hex.slice(1), 16);
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255
    };
}

function rgbToHex(r, g, b) {
    return "#" + [r, g, b]
        .map(x => parseInt(x).toString(16).padStart(2, "0"))
        .join("");
}