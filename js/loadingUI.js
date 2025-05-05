let progressInterval;

function startLoading() {
    const progressBar = document.getElementById("progressBar");
    const loadingText = document.getElementById("loadingText");
    let progress = 0;
    document.getElementById("loading").style.display = "block";
    progressBar.style.width = "0%";
    loadingText.innerText = "Loading... 0%";

    progressInterval = setInterval(() => {
        if (progress < 99) {
            // Random increment between 1 and 6
            const increment = Math.floor(Math.random() * 6) + 1;
            progress += increment;
            progress = Math.min(progress, 99); // Ensure progress doesn't exceed 99%
            progressBar.style.width = `${progress}%`;
            loadingText.innerText = `Loading... ${progress}%`;
        }
    }, 200);
}

function stopLoading() {
    clearInterval(progressInterval);
    document.getElementById("progressBar").style.width = "100%";
    document.getElementById("loadingText").innerText = "Loading... 100%";
    setTimeout(() => {
        document.getElementById("loading").style.display = "none";
    }, 500);
}
