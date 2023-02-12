const button = document.getElementById("btn");

button.addEventListener("click", () => {
    window.electronAPI.setTitle("hellough")
})