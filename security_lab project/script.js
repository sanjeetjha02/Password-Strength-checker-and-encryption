function modInverse(a, m) {
    for (let x = 1; x < m; x++) {
        if ((a * x) % m === 1) {
            return x;
        }
    }
    return 1;
}

// Hill Cipher Encryption (Matrix multiplication)
function hillCipherEncrypt(password, keyMatrix) {
    let encryptedText = "";
    let keySize = keyMatrix.length;
    let paddedPassword = password;

    while (paddedPassword.length % keySize !== 0) {
        paddedPassword += "X";  // Padding with 'X'
    }

    for (let i = 0; i < paddedPassword.length; i += keySize) {
        let vector = [];
        for (let j = 0; j < keySize; j++) {
            vector.push(paddedPassword.charCodeAt(i + j) - 65);
        }

        let encryptedVector = new Array(keySize).fill(0);
        for (let row = 0; row < keySize; row++) {
            for (let col = 0; col < keySize; col++) {
                encryptedVector[row] += keyMatrix[row][col] * vector[col];
            }
            encryptedVector[row] = encryptedVector[row] % 26;
        }

        for (let k = 0; k < keySize; k++) {
            encryptedText += String.fromCharCode(encryptedVector[k] + 65);
        }
    }
    return encryptedText;
}

function checkPasswordStrength(password) {
    let lengthError = password.length < 8;
    let digitError = !/\d/.test(password);
    let uppercaseError = !/[A-Z]/.test(password);
    let lowercaseError = !/[a-z]/.test(password);
    let specialCharError = !/[@$!%*?&#]/.test(password);
    let commonPasswords = ["password", "123456", "qwerty", "password123"];
    let commonError = commonPasswords.includes(password.toLowerCase());

    let errors = [lengthError, digitError, uppercaseError, lowercaseError, specialCharError, commonError];
    let errorCount = errors.filter(e => e).length;

    if (commonError) {
        return "❌ Weak: Too common! Choose a unique password.";
    } else if (errorCount === 0) {
        return "✅ Strong: Your password is secure!";
    } else if (errorCount <= 2) {
        return "⚠️ Moderate: Add special characters or numbers.";
    } else {
        return "❌ Weak: Improve password length and complexity.";
    }
}

function checkPassword() {
    let password = document.getElementById("password").value;
    let resultText = document.getElementById("result");
    let encryptedText = document.getElementById("encrypted");

    if (password.length === 0) {
        alert("Please enter a password!");
        return;
    }

    // Example Key Matrix (Must be invertible in mod 26)
    let keyMatrix = [
        [6, 24, 1],
        [13, 16, 10],
        [20, 17, 15]
    ];

    let encryptedPassword = hillCipherEncrypt(password.toUpperCase(), keyMatrix);
    let strengthMessage = checkPasswordStrength(password);

    resultText.innerHTML = strengthMessage;
    resultText.style.color = strengthMessage.includes("Strong") ? "green" : strengthMessage.includes("Moderate") ? "orange" : "red";

    encryptedText.innerHTML = "🔐 Encrypted Password : " + encryptedPassword;
    encryptedText.style.color = "blue";
}
