function setup() {

    const copyBtn = document.getElementById("copy")
    const refreshBtn = document.getElementById("refresh")
    const passwordEl = document.getElementById("password")
    const sizeOutput = document.getElementById("size")
    const sizeSlider = document.getElementById("size-slider");
    const includeUnderscoresCheck = document.getElementById("include-underscores");
    const includeSignsCheck = document.getElementById("include-signs");

    // Restore state from query parameters
    function loadFromParams() {
        const params = new URLSearchParams(window.location.search);
        if (params.has("size")) {
            const size = parseInt(params.get("size"), 10);
            if (!isNaN(size) && size >= parseInt(sizeSlider.min) && size <= parseInt(sizeSlider.max)) {
                sizeSlider.value = size;
            }
        }
        if (params.has("underscores")) {
            includeUnderscoresCheck.checked = params.get("underscores") === "1";
        }
        if (params.has("signs")) {
            includeSignsCheck.checked = params.get("signs") === "1";
        }
    }

    // Persist current state to query parameters without reloading the page
    function saveToParams() {
        const params = new URLSearchParams();
        params.set("size", sizeSlider.value);
        params.set("underscores", includeUnderscoresCheck.checked ? "1" : "0");
        params.set("signs", includeSignsCheck.checked ? "1" : "0");
        const newUrl = window.location.pathname + "?" + params.toString();
        window.history.replaceState(null, "", newUrl);
    }

    let debounceId = null;

    function refresh() {
        clearTimeout(debounceId);
        debounceId = setTimeout(() => {
            const size = parseInt(sizeSlider.value, 10);
            sizeOutput.value = size;
            saveToParams();
            generateRandomPassword(size, includeSignsCheck.checked, includeUnderscoresCheck.checked)
        }, 200)
    }

    function generateRandomPassword(length, includeSigns, includeUnderscores) {
        let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        if (includeSigns) {
            charset += "!@#$%^&*()-_=+"
        }

        let password = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset.charAt(randomIndex);
        }

        if (includeUnderscores && !password.includes("_")) {
            const _index = Math.floor(Math.random() * (password.length - 1))
            password = password.slice(0, _index) + "_" + password.slice(_index + 1)
        }

        passwordEl.innerText = password;
    }

    const className = copyBtn.className;
    const innerHTML = copyBtn.innerHTML;

    function copied() {
        copyBtn.innerHTML = "Copied!";
        copyBtn.className = className + " copied";
        setTimeout(() => {
            copyBtn.className = className
            copyBtn.innerHTML = innerHTML
        }, 1000)
    }

    async function copyPasswordToClipboard() {
        await copyToClipboard2(passwordEl.innerText);
    }

    async function copyToClipboard2(text) {
        if (navigator.clipboard) {
            await navigator.clipboard.writeText(text)
        } else {
            const textArea = document.createElement("textarea");
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        }
        copied()
    }

    refreshBtn.onclick = () => refresh()
    copyBtn.onclick = () => copyPasswordToClipboard()
    includeUnderscoresCheck.onchange = () => refresh()
    includeSignsCheck.onchange = () => refresh()
    sizeSlider.oninput = () => refresh()
    passwordEl.ondblclick = () => copyPasswordToClipboard()

    loadFromParams();
    setTimeout(refresh, 200)
}
