document.addEventListener('DOMContentLoaded', function() {
    const generatePasswordButton = document.getElementById('generate-password');
    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementById('login-button');
    const usernameInput = document.getElementById('username');
    const chatIcon = document.getElementById('chat-icon'); // Asegúrate de tener este elemento en tu HTML si quieres usar la funcionalidad de mostrar/ocultar el chat
    const chatBox = document.getElementById('chat-box');

    const connectionLogKey = 'userConnectionLog';

    function logConnection(username) {
        const log = JSON.parse(localStorage.getItem(connectionLogKey) || '[]');
        const timestamp = new Date().toISOString();
        log.push({ username: username, loginTime: timestamp });
        localStorage.setItem(connectionLogKey, JSON.stringify(log));
    }

    if (generatePasswordButton) {
        generatePasswordButton.addEventListener('click', function() {
            const randomPassword = Math.random().toString(36).slice(-8);
            passwordInput.value = randomPassword;
        });
    }

    if (loginButton) {
        loginButton.addEventListener('click', function() {
            const username = usernameInput.value.trim();
            if (username) {
                localStorage.setItem('username', username);
                logConnection(username); // Log the connection
                window.location.href = 'dashboard.html';
            } else {
                alert('Por favor, ingresa tu nombre de usuario.');
            }
        });
    }

    if (chatIcon && chatBox) {
        chatIcon.addEventListener('click', function() {
            chatBox.style.display = 'flex';
            chatIcon.style.display = 'none';
        });
    }

    // Chatbox response logic
    const chatBody = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    if (sendButton) {
        sendButton.addEventListener('click', function() {
            const message = userInput.value.trim().toLowerCase();
            if (message) {
                addUserMessage(message);
                userInput.value = '';
                // Lógica para respuestas automáticas
                if (message.includes('hola') || message.includes('ayuda')) {
                    setTimeout(function() {
                        addBotMessage("¡Hola! ¿En qué puedo ayudarte hoy? Puedes Preguntarme Sobre como iniciar sesion?'.");
                    }, 1000);
                } else if (message.includes('iniciar sesion')) {
                    setTimeout(function() {
                        addBotMessage("Para iniciar sesión, ingresa tu nombre de usuario en el campo correspondiente y haz clic en el botón 'Iniciar Sesion'. Si olvidaste tu contraseña, puedes generar una nueva.");
                    }, 1000);
                } else if (message.includes('cuestionamiento')) {
                    setTimeout(function() {
                        addBotMessage("La sección de 'Cuestionamiento' te permitirá registrar todos los equipos que fueron reportados con IMEI clonado o duplicado.");
                    }, 1000);
                } else if (message.includes('consolidado')) {
                    setTimeout(function() {
                        addBotMessage("En la sección de 'Consolidado' podrás registrar todos los datos sobre tu cuestionamiento para poder elevarlos y tener un seguimiento.");
                    }, 1000);
                } else if (message.includes('generador de pdf')) {
                    setTimeout(function() {
                        addBotMessage("El 'Generador de PDF' te permitirá subir tus archivos y fotos y convertirlos en un solo documento PDF.");
                    }, 1000);
                } else if (message.includes('usuarios conectados')) {
                    setTimeout(function() {
                        addBotMessage("La sección de 'Usuarios Conectados' mostrará quiénes se conectaron la última vez al sistema.");
                    }, 1000);
                } else {
                    setTimeout(function() {
                        addBotMessage("Gracias por tu mensaje. Por ahora, esta función está en desarrollo por nuestro creador.");
                    }, 1000);
                }
            }
        });
    }

    if (userInput) {
        userInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                if (sendButton) {
                    sendButton.click();
                }
            }
        });
    }

    function addUserMessage(message) {
        if (chatBody) {
            const messageDiv = document.createElement('p');
            messageDiv.classList.add('user-message');
            messageDiv.textContent = message;
            chatBody.appendChild(messageDiv);
            chatBody.scrollTop = chatBody.scrollHeight; // Mantener el scroll abajo
        }
    }

    function addBotMessage(message) {
        if (chatBody) {
            const messageDiv = document.createElement('p');
            messageDiv.classList.add('bot-message');
            messageDiv.textContent = message;
            chatBody.appendChild(messageDiv);
            chatBody.scrollTop = chatBody.scrollHeight; // Mantener el scroll abajo
        }
    }
});