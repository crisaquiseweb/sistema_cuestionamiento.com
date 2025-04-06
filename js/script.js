document.addEventListener('DOMContentLoaded', function() {
    const body = document.body;
    const backgroundImages = [
        'icon/1.jpg'
        
        // Agrega aquí las rutas relativas de tus otras dos imágenes
    ];

    function setRandomBackgroundImage() {
        const randomIndex = Math.floor(Math.random() * backgroundImages.length);
        const randomImage = backgroundImages[randomIndex];
        body.style.backgroundImage = `url('${randomImage}')`;
    }
    // Establecer una imagen de fondo aleatoria al cargar la página
    setRandomBackgroundImage();

    // Puedes opcionalmente cambiar la imagen cada cierto tiempo
    // setInterval(setRandomBackgroundImage, 5000); // Cambiar cada 5 segundos

    // Resto de tu código JavaScript (script.js)
    const generatePasswordButton = document.getElementById('generate-password');
    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementById('login-button');
    const usernameInput = document.getElementById('username');
    const chatBox = document.querySelector('.chat-box');
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    function logConnection(username) {
        console.log("Intentando guardar conexión para el usuario:", username);
        const log = JSON.parse(localStorage.getItem('userConnectionLog') || '[]');
        const timestamp = new Date().toISOString();
        log.push({ username: username, loginTime: timestamp });
        localStorage.setItem('userConnectionLog', JSON.stringify(log));
        console.log("Datos guardados en localStorage:", JSON.parse(localStorage.getItem('userConnectionLog')));
    }

    if (generatePasswordButton) {
        generatePasswordButton.addEventListener('click', function() {
            const randomPassword = Math.random().toString(36).slice(-8);
            passwordInput.value = randomPassword;
        });
    }

    if (loginButton) {
        loginButton.addEventListener('click', function() {
            console.log("Botón de inicio de sesión clickeado.");
            const username = usernameInput.value.trim();
            if (username) {
                localStorage.setItem('username', username);
                logConnection(username); // Log the connection
                window.location.href = 'dashboard.html'; // Reemplaza con la URL de tu dashboard
            } else {
                alert('Por favor, ingresa tu nombre de usuario.');
            }
        });
    }

    if (sendButton) {
        sendButton.addEventListener('click', function() {
            const message = userInput.value.trim();
            if (message) {
                const userMessage = document.createElement('p');
                userMessage.classList.add('user-message');
                userMessage.textContent = message;
                chatMessages.appendChild(userMessage);
                userInput.value = '';

                // Aquí puedes agregar lógica para la respuesta del bot basada en el mensaje del usuario
                let botReply = '';
                if (message.toLowerCase().includes('hola') || message.toLowerCase().includes('buenas')) {
                    botReply = '¡Hola! ¿En qué puedo ayudarte hoy?';
                } else if (message.toLowerCase().includes('cómo estás') || message.toLowerCase().includes('como estas')) {
                    botReply = 'Estoy bien, gracias por preguntar. ¿Y tú?';
                } else if (message.toLowerCase().includes('ayuda')) {
                    botReply = 'Claro, ¿con qué necesitas ayuda?';
                } else if (message.toLowerCase().includes('gracias')) {
                    botReply = 'De nada. ¡Que tengas un buen día!';
                } else if (message.toLowerCase().includes('adiós') || message.toLowerCase().includes('chao')) {
                    botReply = '¡Adiós! Espero verte pronto.';
                } else if (message.toLowerCase().includes('hora')) {
                    const now = new Date();
                    const time = now.toLocaleTimeString();
                    botReply = `La hora actual es: ${time}`;
                } else if (message.toLowerCase().includes('fecha')) {
                    const now = new Date();
                    const date = now.toLocaleDateString();
                    botReply = `La fecha actual es: ${date}`;
                } else {
                    botReply = 'No puedo Traducir lo que me escribiste.. mi creador esta en Desarrollo';
                }

                setTimeout(() => {
                    const botResponse = document.createElement('p');
                    botResponse.classList.add('bot-message');
                    botResponse.textContent = botReply;
                    chatMessages.appendChild(botResponse);
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, botReply === 'Gracias por tu mensaje.' ? 1000 : 500);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        });
    }

    if (userInput) {
        userInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                sendButton.click();
            }
        });
    }
});