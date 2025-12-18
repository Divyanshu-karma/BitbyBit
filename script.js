// CALTech-chat Application
document.addEventListener('DOMContentLoaded', function() {
   
const state = {
    currentTheme: localStorage.getItem('caltech-theme') || 'light',
    sidebarOpen: localStorage.getItem('caltech-sidebar') !== 'closed',
    messages: JSON.parse(localStorage.getItem('caltech-messages')) || [],
    currentChatId: null,
    groups: JSON.parse(localStorage.getItem('caltech-groups')) || [],
    groupMembers: []
};

    //  Elements
    const elements = {
        sidebar: document.querySelector('.sidebar'),
        sidebarToggle: document.getElementById('sidebarToggle'),
        menuToggle: document.getElementById('menuToggle'),
        newChatBtn: document.getElementById('newChatBtn'),
        chatWelcome: document.getElementById('chatWelcome'),
        chatMessages: document.getElementById('chatMessages'),
        messageInput: document.getElementById('messageInput'),
        sendBtn: document.getElementById('sendBtn'),
        chatHistoryList: document.getElementById('chatHistoryList'),
        themeButtons: document.querySelectorAll('.theme-btn'),
        groupsToggle: document.getElementById('groupsToggle'),
        groupsDropdown: document.querySelector('.groups-dropdown .dropdown-menu'),
        createGroupBtn: document.getElementById('createGroupBtn'),
        groupModalOverlay: document.getElementById('groupModalOverlay'),
        closeGroupModal: document.getElementById('closeGroupModal'),
        cancelGroupBtn: document.getElementById('cancelGroupBtn'),
        groupForm: document.getElementById('groupForm'),
        groupName: document.getElementById('groupName'),
        memberInput: document.getElementById('memberInput'),
        membersTags: document.getElementById('membersTags'),
        // Add these to the elements object
sidebarCollapsedStrip: document.getElementById('sidebarCollapsedStrip'),
expandSidebarBtn: document.getElementById('expandSidebarBtn'),
newChatStripBtn: document.getElementById('newChatStripBtn'),
mainSidebar: document.getElementById('mainSidebar'),
// Add to the elements object
aboutUsBtn: document.getElementById('aboutUsBtn'),
aboutModalOverlay: document.getElementById('aboutModalOverlay'),
closeAboutModal: document.getElementById('closeAboutModal'),
closeAboutBtn: document.getElementById('closeAboutBtn')
    };

    // Initialize  application
    function init() {
        
        applyTheme(state.currentTheme);
        
       
        if (!state.sidebarOpen) {
            toggleSidebar();
        }
        
       
        loadChatHistory();
        
        
        setupEventListeners();
        
      
        if (state.currentChatId) {
            loadMessages(state.currentChatId);
        }
        
       
        updateThemeButtons();
        // Apply sidebar collapsed/expanded state
if (!state.sidebarOpen) {
    elements.mainSidebar.classList.add('collapsed');
    elements.sidebarCollapsedStrip.classList.add('show');
    elements.sidebarToggle.querySelector('i').classList.remove('fa-chevron-left');
    elements.sidebarToggle.querySelector('i').classList.add('fa-chevron-right');
    elements.expandSidebarBtn.querySelector('i').classList.remove('fa-chevron-right');
    elements.expandSidebarBtn.querySelector('i').classList.add('fa-chevron-left');
}
    }

    // Event listeners 
    function setupEventListeners() {
       
        elements.sidebarToggle.addEventListener('click', toggleSidebar);
        elements.menuToggle.addEventListener('click', toggleSidebar);
elements.expandSidebarBtn.addEventListener('click', toggleSidebar);

// New chat button
elements.newChatStripBtn.addEventListener('click', startNewChat);

// About Us 
elements.aboutUsBtn.addEventListener('click', openAboutModal);
elements.closeAboutModal.addEventListener('click', closeAboutModal);
elements.closeAboutBtn.addEventListener('click', closeAboutModal);
elements.aboutModalOverlay.addEventListener('click', function(e) {
    if (e.target === this) {
        closeAboutModal();
    }
});
        // New chat button
        elements.newChatBtn.addEventListener('click', startNewChat);
        
        // Send message
        elements.sendBtn.addEventListener('click', sendMessage);
        elements.messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
        
        // Auto resize textarea
        elements.messageInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
            elements.sendBtn.disabled = this.value.trim() === '';
        });
        
        // Theme switch
        elements.themeButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const theme = this.getAttribute('data-theme');
                switchTheme(theme);
            });
        });
        
        // Groups dropdown
        elements.groupsToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            elements.groupsDropdown.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            elements.groupsDropdown.classList.remove('show');
        });
        
        // Group creation 
        elements.createGroupBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openGroupModal();
        });
        
        elements.closeGroupModal.addEventListener('click', closeGroupModal);
        elements.cancelGroupBtn.addEventListener('click', closeGroupModal);
        elements.groupModalOverlay.addEventListener('click', function(e) {
            if (e.target === this) {
                closeGroupModal();
            }
        });
        
        // Group form submission
        elements.groupForm.addEventListener('submit', createGroup);
        
      
        // Member input handling
        elements.memberInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
        e.preventDefault();
        addMemberToGroup();
        }
        });
elements.memberInput.addEventListener('input', function() {
    const addMemberBtn = document.getElementById('addMemberBtn');
    addMemberBtn.disabled = this.value.trim() === '';
});
        // Add member 
document.getElementById('addMemberBtn').addEventListener('click', function() {
    addMemberToGroup();
});
        
        // Load initial messages
        if (state.messages.length > 0) {
            const lastChat = state.messages[state.messages.length - 1];
            state.currentChatId = lastChat.id;
            loadMessages(lastChat.id);
        }
    }

    // Theme 
    function switchTheme(theme) {
        state.currentTheme = theme;
        applyTheme(theme);
        localStorage.setItem('caltech-theme', theme);
        updateThemeButtons();
    }

    function applyTheme(theme) {
        document.body.className = `${theme}-mode`;
    }

    function updateThemeButtons() {
        elements.themeButtons.forEach(btn => {
            if (btn.getAttribute('data-theme') === state.currentTheme) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // Sidebar Functions
    function toggleSidebar() {
        const sidebar = elements.mainSidebar;
        const collapsedStrip = elements.sidebarCollapsedStrip;
        
        // Toggle  sidebar
        sidebar.classList.toggle('collapsed');
        
      
        if (sidebar.classList.contains('collapsed')) {
            collapsedStrip.classList.add('show');
        } else {
            collapsedStrip.classList.remove('show');
        }
        
        // Update toggle button icons
        elements.sidebarToggle.querySelector('i').classList.toggle('fa-chevron-left');
        elements.sidebarToggle.querySelector('i').classList.toggle('fa-chevron-right');
        elements.expandSidebarBtn.querySelector('i').classList.toggle('fa-chevron-right');
        elements.expandSidebarBtn.querySelector('i').classList.toggle('fa-chevron-left');
        
        // Update state
        state.sidebarOpen = !sidebar.classList.contains('collapsed');
        localStorage.setItem('caltech-sidebar', state.sidebarOpen ? 'open' : 'closed');
    }

    // Chat Functions
    function startNewChat() {
        state.currentChatId = null;
        elements.chatWelcome.style.display = 'flex';
        elements.chatMessages.style.display = 'none';
        elements.messageInput.value = '';
        elements.messageInput.style.height = 'auto';
        elements.sendBtn.disabled = true;
        
        // Remove active state from all chat history items
        document.querySelectorAll('#chatHistoryList li').forEach(item => {
            item.classList.remove('active');
        });
    }

    function sendMessage() {
        const messageText = elements.messageInput.value.trim();
        if (!messageText) return;
        
        // Create new chat if none exists
        if (!state.currentChatId) {
            state.currentChatId = 'chat_' + Date.now();
            const chatTitle = messageText.length > 30 ? messageText.substring(0, 30) + '...' : messageText;
            
            state.messages.push({
                id: state.currentChatId,
                title: chatTitle,
                messages: []
            });
            
            // Hide welcome message and show chat
            elements.chatWelcome.style.display = 'none';
            elements.chatMessages.style.display = 'block';
            
            // Add to chat history
            addToChatHistory(state.currentChatId, chatTitle);
        }
        
        // Add user message
        const userMessage = {
            id: 'msg_' + Date.now(),
            sender: 'user',
            text: messageText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        // Find current chat and add message
        const currentChat = state.messages.find(chat => chat.id === state.currentChatId);
        currentChat.messages.push(userMessage);
        
        // Display message
        displayMessage(userMessage);
        
        // Clear input
        elements.messageInput.value = '';
        elements.messageInput.style.height = 'auto';
        elements.sendBtn.disabled = true;
        
        // Auto-scroll
        scrollToBottom();
        
        // Simulate AI response after delay
        setTimeout(simulateAIResponse, 1000);
        
        // Save to localStorage
        saveToLocalStorage();
    }

    function simulateAIResponse() {
        const responses = [
            "Machine learning offers numerous benefits, including automated data analysis, pattern recognition, predictive capabilities, and improved decision-making across various industries.",
            "I understand you're asking about the benefits of machine learning. It enables systems to learn from data, identify patterns, and make decisions with minimal human intervention.",
            "The main advantages include handling large datasets, improving over time through experience, automating repetitive tasks, and providing personalized experiences for users.",
            "Machine learning can process vast amounts of data much faster than humans, uncover hidden insights, and adapt to new information, making it invaluable for businesses and research."
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const aiMessage = {
            id: 'msg_' + Date.now(),
            sender: 'assistant',
            text: randomResponse,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        // Add to current chat
        const currentChat = state.messages.find(chat => chat.id === state.currentChatId);
        if (currentChat) {
            currentChat.messages.push(aiMessage);
            displayMessage(aiMessage);
            scrollToBottom();
            saveToLocalStorage();
        }
    }

    function displayMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = `message message-${message.sender}`;
        
        const avatarClass = message.sender === 'user' ? 'user-avatar' : 'assistant-avatar';
        const avatarIcon = message.sender === 'user' ? 'fas fa-user' : 'fas fa-robot';
        const bubbleClass = message.sender === 'user' ? 'user-bubble' : 'assistant-bubble';
        const timeClass = message.sender === 'user' ? 'user-time' : '';
        
        messageElement.innerHTML = `
            ${message.sender === 'assistant' ? 
                `<div class="message-avatar assistant-avatar">
                    <i class="${avatarIcon}"></i>
                </div>` : ''
            }
            <div class="message-content">
                <div class="message-bubble ${bubbleClass}">
                    ${message.text}
                </div>
                <div class="message-time ${timeClass}">${message.timestamp}</div>
            </div>
            ${message.sender === 'user' ? 
                `<div class="message-avatar user-avatar">
                    <i class="${avatarIcon}"></i>
                </div>` : ''
            }
        `;
        
        elements.chatMessages.appendChild(messageElement);
    }

    function loadMessages(chatId) {
        const chat = state.messages.find(chat => chat.id === chatId);
        if (!chat) return;
        
        state.currentChatId = chatId;
        elements.chatWelcome.style.display = 'none';
        elements.chatMessages.style.display = 'block';
        elements.chatMessages.innerHTML = '';
        
        chat.messages.forEach(message => {
            displayMessage(message);
        });
        
        // Mark as active in history
        document.querySelectorAll('#chatHistoryList li').forEach(item => {
            if (item.getAttribute('data-chat-id') === chatId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        scrollToBottom();
    }

    function loadChatHistory() {
        elements.chatHistoryList.innerHTML = '';
        
        state.messages.forEach(chat => {
            const li = document.createElement('li');
            li.setAttribute('data-chat-id', chat.id);
            li.innerHTML = `<i class="fas fa-message"></i> ${chat.title}`;
            
            li.addEventListener('click', function() {
                loadMessages(chat.id);
            });
            
            elements.chatHistoryList.appendChild(li);
        });
    }

    function addToChatHistory(chatId, title) {
        const li = document.createElement('li');
        li.setAttribute('data-chat-id', chatId);
        li.innerHTML = `<i class="fas fa-message"></i> ${title}`;
        
        li.addEventListener('click', function() {
            loadMessages(chatId);
        });
        
        elements.chatHistoryList.appendChild(li);
    }

    function scrollToBottom() {
        elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
    }

    // Group Functions
    function openGroupModal() {
         // Close About modal if open
    elements.aboutModalOverlay.classList.remove('show');
        elements.groupModalOverlay.classList.add('show');
        elements.groupName.value = '';
        elements.memberInput.value = '';
        elements.membersTags.innerHTML = '';
        state.groupMembers = [];
        
        // Reset add button state
        document.getElementById('addMemberBtn').disabled = true;
    }

    function closeGroupModal() {
        elements.groupModalOverlay.classList.remove('show');
    }

    function addMemberToGroup() {
        const addMemberBtn = document.getElementById('addMemberBtn');
        const email = elements.memberInput.value.trim();
        
        if (!email) return;
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        // Check maximum members
        if (state.groupMembers.length >= 5) {
            alert('Maximum 5 members allowed per group');
            return;
        }
        
        // Check if already added
        if (state.groupMembers.includes(email)) {
            alert('This member is already added to the group');
            return;
        }
        
        // Add to state
        state.groupMembers.push(email);
        
        // Create tag element
        const tag = document.createElement('div');
        tag.className = 'member-tag';
        tag.innerHTML = `
            ${email}
            <button type="button" class="remove-member" data-email="${email}">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        elements.membersTags.appendChild(tag);
        
        // Clear input
        elements.memberInput.value = '';
        addMemberBtn.disabled = true;
        // Add event listener to remove button
        tag.querySelector('.remove-member').addEventListener('click', function() {
            const emailToRemove = this.getAttribute('data-email');
            removeMemberFromGroup(emailToRemove);
        });
    }

    function removeMemberFromGroup(email) {
        state.groupMembers = state.groupMembers.filter(member => member !== email);
        
        // Re-render tags
        elements.membersTags.innerHTML = '';
        state.groupMembers.forEach(memberEmail => {
            const tag = document.createElement('div');
            tag.className = 'member-tag';
            tag.innerHTML = `
                ${memberEmail}
                <button type="button" class="remove-member" data-email="${memberEmail}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            elements.membersTags.appendChild(tag);
            
            // Add event listener to remove button
            tag.querySelector('.remove-member').addEventListener('click', function() {
                const emailToRemove = this.getAttribute('data-email');
                removeMemberFromGroup(emailToRemove);
            });
        });
    }

    function createGroup(e) {
        e.preventDefault();
        
        const groupName = elements.groupName.value.trim();
        
        if (!groupName) {
            alert('Please enter a group name');
            return;
        }
        
        if (state.groupMembers.length === 0) {
            alert('Please add at least one member to the group');
            return;
        }
        
        // Create group object
        const group = {
            id: 'group_' + Date.now(),
            name: groupName,
            members: state.groupMembers,
            created: new Date().toISOString()
        };
        
        // Add to state
        state.groups.push(group);
        
        // Save to localStorage
        localStorage.setItem('caltech-groups', JSON.stringify(state.groups));
        
        // Close modal
        closeGroupModal();
        
        // Show success message
        alert(`Group "${groupName}" created successfully!`);
        
        // Redirect to your_groups page
        window.location.href = 'your_groups.html';
    }

    // Utility Functions
    function saveToLocalStorage() {
        localStorage.setItem('caltech-messages', JSON.stringify(state.messages));
    }
    function openAboutModal() {
        elements.aboutModalOverlay.classList.add('show');
        // Close any other open dropdowns
        elements.groupsDropdown.classList.remove('show');
        
        // Reset scroll position to top
        const modalBody = elements.aboutModalOverlay.querySelector('.modal-body');
        if (modalBody) {
            modalBody.scrollTop = 0;
        }
        
        // Show scroll indicator
        const scrollIndicator = elements.aboutModalOverlay.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.classList.remove('hidden');
        }
        
        // Hide scroll to top button initially
        const scrollToTopBtn = document.getElementById('scrollToTopBtn');
        if (scrollToTopBtn) {
            scrollToTopBtn.classList.remove('visible');
        }
        
        // Setup scroll events
        setupAboutModalScroll();
    }

    function closeAboutModal() {
        elements.aboutModalOverlay.classList.remove('show');
        
        // Clean up scroll indicators
        const scrollIndicator = elements.aboutModalOverlay.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.classList.remove('hidden');
        }
        
        const scrollToTopBtn = document.getElementById('scrollToTopBtn');
        if (scrollToTopBtn) {
            scrollToTopBtn.classList.remove('visible');
        }
    }
    function setupAboutModalScroll() {
        const modalBody = elements.aboutModalOverlay.querySelector('.modal-body');
        const scrollIndicator = elements.aboutModalOverlay.querySelector('.scroll-indicator');
        const scrollToTopBtn = document.getElementById('scrollToTopBtn');
        
        if (!modalBody || !scrollIndicator || !scrollToTopBtn) return;
        
        // Handle scroll events
        modalBody.addEventListener('scroll', function() {
            const scrollTop = this.scrollTop;
            
            // Hide scroll indicator after some scrolling
            if (scrollTop > 100) {
                scrollIndicator.classList.add('hidden');
            } else {
                scrollIndicator.classList.remove('hidden');
            }
            
            // Show scroll to top button after significant scroll
            if (scrollTop > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });
        
        // Handle swipe/scroll gestures (touch devices)
        let touchStartY = 0;
        let touchEndY = 0;
        
        modalBody.addEventListener('touchstart', function(e) {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });
        
        modalBody.addEventListener('touchmove', function(e) {
            touchEndY = e.touches[0].clientY;
            
            // Hide scroll indicator when actively scrolling
            if (Math.abs(touchEndY - touchStartY) > 50) {
                scrollIndicator.classList.add('hidden');
            }
        }, { passive: true });
        
        // Click to scroll to top
        scrollToTopBtn.addEventListener('click', function() {
            modalBody.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Hide the button after click
            setTimeout(() => {
                this.classList.remove('visible');
            }, 300);
        });
    
        modalBody.addEventListener('wheel', function() {
            if (this.scrollTop > 100) {
                scrollIndicator.classList.add('hidden');
            }
        }, { passive: true });
    }
    // Initialize the app
    init();

});
