const canvas = document.getElementById('fractal-tree');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let branches = [];
let frameCount = 0;
let lastFrameTime = 0;
const frameInterval = 77; // Milliseconds per depth level

function createBranch(x1, y1, angle, length, branchWidth, depth) {
    // Max depth of 12 means depth goes from 0 to 12, so 13 levels
    if (depth > 12) {
        return;
    }

    const x2 = x1 + Math.cos(angle * Math.PI / 180) * length;
    const y2 = y1 + Math.sin(angle * Math.PI / 180) * length;

    branches.push({x1, y1, x2, y2, branchWidth, depth});

    const newLength = length * 0.8;
    const newBranchWidth = branchWidth * 0.7;
    const angleOffset = 25;

    // Recursively create sub-branches without drawing them yet
    createBranch(x2, y2, angle - angleOffset, newLength, newBranchWidth, depth + 1);
    createBranch(x2, y2, angle + angleOffset, newLength, newBranchWidth, depth + 1);
}

function drawBranches() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Filter branches to draw based on the current frameCount (depth level)
    let branchesToDraw = branches.filter(branch => branch.depth <= frameCount);

    for(let i = 0; i < branchesToDraw.length; i++){
        let branch = branchesToDraw[i];
        ctx.beginPath();
        ctx.moveTo(branch.x1, branch.y1);
        ctx.lineTo(branch.x2, branch.y2);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = branch.branchWidth;
        ctx.stroke();
    }
}

function animate(currentTime) {
    if (!lastFrameTime) lastFrameTime = currentTime; // Initialize lastFrameTime on first call

    const deltaTime = currentTime - lastFrameTime;

    if (deltaTime >= frameInterval) {
        if (frameCount <= 12) { // Max depth is 12, so frameCount goes up to 12
            frameCount++;
            lastFrameTime = currentTime; // Reset timer
        }
    }

    drawBranches();

    // Continue animation if not all depth levels have been drawn
    if (frameCount <= 12) {
        requestAnimationFrame(animate);
    }
}

function startDrawing() {
    const startX = canvas.width / 2;
    const startY = canvas.height;
    const startLength = Math.min(canvas.width, canvas.height) * 0.2;
    const startAngle = -90; // Pointing upwards
    const startBranchWidth = 10;

    branches = [];
    frameCount = 0;
    lastFrameTime = 0; // Reset lastFrameTime for a new animation cycle
    
    createBranch(startX, startY, startAngle, startLength, startBranchWidth, 0);
    requestAnimationFrame(animate); // Start the animation loop
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    startDrawing();
});

startDrawing();
