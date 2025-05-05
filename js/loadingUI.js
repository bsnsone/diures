let progressInterval;
function startLoading() {
    const progressBar = document.getElementById("progressBar");
    const loadingText = document.getElementById("loadingText");
    let progress = 0;
    document.getElementById("loading").style.display = "block";
    progressBar.style.width = "0%";
    loadingText.innerText = "Loading... 0%";

    progressInterval = setInterval(() => {
        if (progress < 95) {
            progress += 5;
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
