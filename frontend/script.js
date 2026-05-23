// BACKEND API URL

const BASE_URL = "http://localhost:3000/users";

// FORM TYPE

let isLogin = true;

// TOGGLE FORM

function toggleForm() {

    isLogin = !isLogin;

    const formTitle = document.getElementById("formTitle");
    const formSubtitle = document.getElementById("formSubtitle");
    const submitBtn = document.getElementById("submitBtn");
    const toggleText = document.getElementById("toggleText");
    const registerFields = document.getElementById("registerFields");

    clearErrors();

    if (isLogin) {

        formTitle.innerText = "Welcome back";
        formSubtitle.innerText = "Sign in to continue to your account";
        submitBtn.innerText = "Sign in";
        registerFields.classList.remove("visible");

        toggleText.innerHTML = `
            Don't have an account?
            <span onclick="toggleForm()">Register here</span>
        `;

    } else {

        formTitle.innerText = "Create account";
        formSubtitle.innerText = "Join us — it only takes a minute";
        submitBtn.innerText = "Register";
        registerFields.classList.add("visible");

        toggleText.innerHTML = `
            Already have an account?
            <span onclick="toggleForm()">Sign in</span>
        `;

    }

}

// CLEAR ERROR MESSAGES

function clearErrors() {

    document.getElementById("nameError").innerText = "";
    document.getElementById("phoneError").innerText = "";
    document.getElementById("emailError").innerText = "";
    document.getElementById("passwordError").innerText = "";

    document.querySelectorAll('.field input').forEach(function(input) {
        input.classList.remove('error-input');
    });

}

// SET ERROR

function setError(fieldId, errorId, msg) {

    const el = document.getElementById(errorId);
    const input = document.getElementById(fieldId);

    if (el) el.innerText = msg;
    if (input) input.classList.add('error-input');

}

// VALIDATE FORM

function validateForm(data) {

    let isValid = true;

    clearErrors();

    // NAME VALIDATION

    if (!isLogin) {

        if (!data.name.trim()) {
            setError("name", "nameError", "Name is required");
            isValid = false;
        }

        // PHONE VALIDATION

        if (!data.phone.trim()) {
            setError("phone", "phoneError", "Phone number is required");
            isValid = false;
        } else if (!/^[0-9]{10}$/.test(data.phone)) {
            setError("phone", "phoneError", "Phone must be 10 digits");
            isValid = false;
        }

    }

    // EMAIL VALIDATION

    if (!data.email.trim()) {
        setError("email", "emailError", "Email is required");
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        setError("email", "emailError", "Invalid email format");
        isValid = false;
    }

    // PASSWORD VALIDATION

    if (!data.password.trim()) {
        setError("password", "passwordError", "Password is required");
        isValid = false;
    } else if (data.password.length < 6) {
        setError("password", "passwordError", "Password must be at least 6 characters");
        isValid = false;
    }

    return isValid;

}

// HANDLE SUBMIT

async function handleSubmit() {

    try {

        // GET INPUT VALUES

        const data = {
            name: document.getElementById("name").value,
            phone: document.getElementById("phone").value,
            email: document.getElementById("email").value,
            password: document.getElementById("password").value
        };

        // VALIDATE

        const valid = validateForm(data);

        if (!valid) {
            return;
        }

        // LOGIN API

        if (isLogin) {

            const response = await fetch(`${BASE_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: data.email,
                    password: data.password
                })
            });

            const result = await response.json();

            if (!response.ok) {
                alert(result.message);
                return;
            }

            // STORE TOKEN

            localStorage.setItem("token", result.token);

            alert(result.message);
            console.log(result);

        }

        // REGISTER API

        else {

            const response = await fetch(`${BASE_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (!response.ok) {
                alert(result.message);
                return;
            }

            alert(result.message);
            console.log(result);

            // SWITCH TO LOGIN

            toggleForm();

        }

    } catch (error) {

        console.log(error);
        alert("Something went wrong");

    }

}
