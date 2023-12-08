function setup() {

    const copyBtn = document.getElementById("copy")
    const refreshBtn = document.getElementById("refresh")
    const passwordEl = document.getElementById("password")
    const sizeOutput = document.getElementById("size")
    const sizeSlider = document.getElementById("size-slider");
    const includeSignsCheck = document.getElementById("include-signs");

    function refresh() {
        sizeOutput.value = sizeSlider.value;
        generateRandomPassword(sizeOutput.value, includeSignsCheck.checked)
    }

    function generateRandomPassword(length, includeSigns = false, forceUnderscore = true) {
        let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        if (includeSigns) {
            charset += "!@#$%^&*()-_=+"
        }

        let password = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset.charAt(randomIndex);
        }

        if (forceUnderscore && !password.includes("_")) {
            const _index = Math.floor(Math.random() * password.length - 1)
            password = password.slice(0, _index) + "_" + password.slice(_index + 1, password.length)
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
    includeSignsCheck.onchange = () => refresh()
    sizeSlider.oninput = () => refresh()
    passwordEl.ondblclick = () => copyPasswordToClipboard()

    refresh();
}
