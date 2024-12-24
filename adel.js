// Store users in localStorage (this is a simple implementation)
const users = JSON.parse(localStorage.getItem('users')) || [];
const OPENAI_API_KEY = 'sk-svcacct-Vx_gDM_QyLGfibvx3C7ibkW4IVv5NYCRXWQaqo1esP-LoTs9CzTkXjHuP5krJT3BlbkFJntWqJ1w7ld1DlfHUia4dkt5CIFrRp7fT5k7aTSkXimhYJqqIrqyIuNwE-o_AA'
// Function to show the login form
function showLogin() {
    document.getElementById('login-container').classList.remove('hidden');
    document.getElementById('register-container').classList.add('hidden');
}

// Function to show the register form
function showRegister() {
    document.getElementById('register-container').classList.remove('hidden');
    document.getElementById('login-container').classList.add('hidden');
}

// Register function
function register() {
    const newUsername = document.getElementById('new-username').value;
    const newPassword = document.getElementById('new-password').value;

    // Check if username already exists
    if (users.find(user => user.username === newUsername)) {
        document.getElementById('register-error').classList.remove('hidden');
        return;
    }

    // Add the new user
    users.push({ username: newUsername, password: newPassword });
    localStorage.setItem('users', JSON.stringify(users));

    // Redirect to login page after successful registration
    showLogin();
}

// Login function
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Find user by username
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        document.getElementById('login-container').classList.add('hidden');
        document.getElementById('main-container').classList.remove('hidden');
        document.getElementById('display-username').innerText = username;
    } else {
        document.getElementById('error-message').classList.remove('hidden');
    }
}

// Show main container if user is logged in
window.onload = function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        document.getElementById('login-container').classList.add('hidden');
        document.getElementById('main-container').classList.remove('hidden');
        document.getElementById('display-username').innerText = currentUser.username;
    } else {
        showLogin();
    }
}

// Function to interact with OpenAI API (ChatGPT)
async function getAnswerFromOpenAI(question) {
    try {
        const response = await fetch('https://api.openai.com/v1/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',  // أو استخدم أي نموذج آخر موجود في OpenAI
                messages: [{ role: 'user', content: question }],
                max_tokens: 100
            })
        });

        // التأكد من حالة الرد
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        if (data.choices && data.choices[0]) {
            return data.choices[0].message.content;  // الحصول على الإجابة
        } else {
            return "Sorry, I couldn't find an answer for this question.";
        }
    } catch (error) {
        // إذا حدث خطأ في الاتصال بـ OpenAI API
        console.error('Error fetching from OpenAI:', error);
        return "Sorry, there was an issue connecting to the server.";
    }
}

// Answer function
async function getAnswer() {
    const question = document.getElementById('question').value;
    const answerElement = document.getElementById('answer');

    if (question.trim() === "") {
        answerElement.innerHTML = "Please enter a question first.";
        return;
    }

    // استخدام OpenAI للإجابة على السؤال
    const aiAnswer = await getAnswerFromOpenAI(question);
    answerElement.innerHTML = `Answer to your question: <b>${question}</b> is: <i>${aiAnswer}</i>`;
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    document.getElementById('main-container').classList.add('hidden');
    showLogin();
}
