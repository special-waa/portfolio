const slideImages = [
    "hw04_img1.png",
    "hw04_img2.png",
    "hw04_img3.png",
    "hw04_img4.png"
];

let currentIndex = 0;
const imgElem = document.getElementById("slide-img");
const fallbackElem = document.getElementById("slide-fallback");
const dots = document.querySelectorAll(".nav-dots .dot");

function updateSlide(index) {
    currentIndex = index;
    imgElem.style.display = "block";
    fallbackElem.style.display = "none";
    imgElem.src = slideImages[currentIndex];

    dots.forEach((dot, i) => {
        if (i === currentIndex) {
            dot.textContent = "●";
            dot.classList.add("active");
        } else {
            dot.textContent = "○";
            dot.classList.remove("active");
        }
    });
}

document.getElementById("prev-btn").addEventListener("click", () => {
    let nextIndex = currentIndex - 1;
    if (nextIndex < 0) nextIndex = slideImages.length - 1;
    updateSlide(nextIndex);
});

document.getElementById("next-btn").addEventListener("click", () => {
    let nextIndex = currentIndex + 1;
    if (nextIndex >= slideImages.length) nextIndex = 0;
    updateSlide(nextIndex);
});

const cloudZone = document.getElementById("cloud-zone");
const cloud = document.getElementById("cloud");
const skyHeader = document.getElementById("sky-header");
const rainOverlay = document.getElementById("rain-overlay");
const meadowRain = document.getElementById("meadow-rain");
const plantBox = document.getElementById("plant-box");
const buildingZone = document.getElementById("building-zone");

let shakeEnergy = 0;
let isRaining = false;
let rainTimer = null;
let decayTimer = null;

function addCloudEnergy(amount) {
    if (isRaining) return;

    shakeEnergy += amount;
    cloud.classList.add("shaking");
    setTimeout(() => cloud.classList.remove("shaking"), 150);

    clearTimeout(decayTimer);
    decayTimer = setTimeout(() => { shakeEnergy = 0; }, 800);

    if (shakeEnergy >= 6) {
        startRain();
    }
}

cloudZone.addEventListener("click", () => { addCloudEnergy(3); });

let lastMove = 0;
cloudZone.addEventListener("mousemove", () => {
    const now = Date.now();
    if (now - lastMove > 120) {
        addCloudEnergy(1.5);
        lastMove = now;
    }
});

function startRain() {
    isRaining = true;
    shakeEnergy = 0;
    cloud.classList.add("rainy");
    skyHeader.classList.add("rainy-sky");

    rainOverlay.innerHTML = "";
    for (let i = 0; i < 28; i++) {
        const drop = document.createElement("span");
        drop.classList.add("raindrop");
        drop.style.left = (Math.random() * 98) + "%";
        drop.style.animationDelay = (Math.random() * 0.5) + "s";
        drop.style.animationDuration = (0.4 + Math.random() * 0.3) + "s";
        rainOverlay.appendChild(drop);
    }

    meadowRain.innerHTML = "";
    for (let i = 0; i < 20; i++) {
        const drop = document.createElement("span");
        drop.classList.add("raindrop");
        drop.style.left = (Math.random() * 98) + "%";
        drop.style.animationDelay = (Math.random() * 0.4) + "s";
        drop.style.animationDuration = (0.35 + Math.random() * 0.25) + "s";
        meadowRain.appendChild(drop);
    }

    clearTimeout(rainTimer);
    rainTimer = setTimeout(stopRain, 8000);
}

function stopRain() {
    isRaining = false;
    cloud.classList.remove("rainy");
    skyHeader.classList.remove("rainy-sky");
    rainOverlay.innerHTML = "";
    meadowRain.innerHTML = "";
}

const matureTrees = ["🌳", "🌲"];
let woodCount = 0;
let currentTreesOnScreen = 0;

window.addEventListener("scroll", () => {
    if (!isRaining) return;

    const scrollBottom = window.innerHeight + window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollBottom >= documentHeight - 90) {
        spawnTree();
    }
});

function spawnTree() {
    if (currentTreesOnScreen >= 12) return;

    const plant = document.createElement("span");
    plant.classList.add("plant-item", "sprout");
    plant.textContent = "🌱";

    const randomLeft = 4 + Math.random() * 68;
    plant.style.left = `${randomLeft}%`;

    plantBox.appendChild(plant);
    currentTreesOnScreen++;

    setTimeout(() => {
        plant.textContent = "🌿";

        setTimeout(() => {
            plant.textContent = matureTrees[Math.floor(Math.random() * matureTrees.length)];
            plant.classList.remove("sprout");

            plant.addEventListener("click", () => {
                harvestTree(plant);
            }, { once: true });

        }, 700);
    }, 400);
}

function harvestTree(plantElement) {
    plantElement.classList.add("harvested");
    
    setTimeout(() => {
        plantElement.remove();
        currentTreesOnScreen--;
        woodCount++;

        checkBuildingProgress();

        if (isRaining) {
            setTimeout(spawnTree, 200);
        }
    }, 200);
}

function checkBuildingProgress() {
    if (woodCount >= 40) {
        buildingZone.innerHTML = `<div class="stage-house">🏡</div>`;
    } else if (woodCount >= 25) {
        buildingZone.innerHTML = `
            <div class="stage-hut">
                <span>🛖</span><span class="spare-log">🪵</span>
            </div>
        `;
    } else if (woodCount >= 10) {
        buildingZone.innerHTML = `
            <div class="stack-box">
                <span class="stack-top">🪵</span>
                <span class="stack-bottom">🪵🪵</span>
            </div>
        `;
    }
}