const Chatbot = {
    isOpen: false,

    init: function() {
        // 1. Create the HTML Structure
        const chatHTML = `
            <div class="chatbot-trigger" id="chatTrigger">
                <i class="fas fa-comment-alt"></i>
            </div>
            <div class="chatbot-window" id="chatWindow">
                <div class="chatbot-header">
                    <h4><i class="fas fa-robot"></i> VitaBot AI</h4>
                    <i class="fas fa-times" id="closeChat" style="cursor:pointer"></i>
                </div>
                <div class="chatbot-messages" id="chatMessages">
                    <div class="msg msg-bot">
                        Hi! I'm VitaBot. How can I help you with organ donation or the platform today?
                    </div>
                </div>
                <div class="typing" id="typingIndicator">VitaBot is thinking...</div>
                <div class="chatbot-input-area">
                    <input type="text" id="chatInput" placeholder="Type a message...">
                    <button class="btn-chat-send" id="chatSend">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        `;

        // 2. Inject into Body
        const div = document.createElement('div');
        div.innerHTML = chatHTML;
        document.body.appendChild(div);

        // 3. Add Event Listeners
        document.getElementById('chatTrigger').onclick = () => this.toggle();
        document.getElementById('closeChat').onclick = () => this.toggle();
        document.getElementById('chatSend').onclick = () => this.sendMessage();
        document.getElementById('chatInput').onkeypress = (e) => {
            if (e.key === 'Enter') this.sendMessage();
        };
    },

    toggle: function() {
        this.isOpen = !this.isOpen;
        document.getElementById('chatWindow').style.display = this.isOpen ? 'flex' : 'none';
    },

    sendMessage: async function() {
        const input = document.getElementById('chatInput');
        const msg = input.value.trim();
        if (!msg) return;

        // Add user message to UI
        this.addMessage(msg, 'user');
        input.value = '';

        // Show typing indicator
        document.getElementById('typingIndicator').style.display = 'block';

        try {
            const response = await fetch('http://localhost:5000/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: msg })
            });

            const data = await response.json();
            document.getElementById('typingIndicator').style.display = 'none';

            if (data.status === 'success') {
                this.addMessage(data.reply, 'bot');
            } else {
                this.addMessage(data.reply || "Sorry, I'm having trouble connecting to my brain.", 'bot');
            }
        } catch (error) {
            console.error(error);
            document.getElementById('typingIndicator').style.display = 'none';
            this.addMessage("I can't reach the backend server. Please make sure your Python app.py is running on port 5000!", 'bot');
        }
    },

    addMessage: function(text, sender) {
        const container = document.getElementById('chatMessages');
        const div = document.createElement('div');
        div.className = `msg msg-${sender}`;
        div.innerText = text;
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
    }
};

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => Chatbot.init());
