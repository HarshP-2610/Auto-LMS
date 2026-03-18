const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Google Generative AI
const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || 'placeholder');

// @desc    Get AI Chatbot response
// @route   POST /api/chatbot
// @access  Public
exports.getChatbotResponse = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ success: false, message: 'Message is required' });
        }

        const systemInstruction = "You are an AI assistant for a Learning Management System. Only answer LMS-related questions like courses, dashboard, quizzes, and student help. Keep answers short and helpful.";

        let aiMessage;
        
        try {
            // Attempt to use requested gemini-1.5-flash
            const model = genAI.getGenerativeModel({ 
                model: "gemini-1.5-flash",
                systemInstruction: systemInstruction 
            });
            const result = await model.generateContent(message);
            aiMessage = result.response.text();
            
        } catch (e) {
            console.warn("First model failed. Error:", e.message);
            try {
                // Secondary fallback attempt: gemini-pro
                const fallbackModel = genAI.getGenerativeModel({ model: "gemini-pro" });
                const prompt = `${systemInstruction}\n\nUser Message: ${message}`;
                const result = await fallbackModel.generateContent(prompt);
                aiMessage = result.response.text();
            } catch (fallbackError) {
                console.warn("API completely failed, using intelligent local fallback engine.");
                // Final completely key-less offline fallback for demonstration
                const lowerMsg = message.toLowerCase();
                aiMessage = "I'm your Auto-LMS assistant! I can help you with courses, quizzes, and navigating the platform. What do you need help with?";

                if (lowerMsg.includes('hi') || lowerMsg.includes('hello') || lowerMsg.includes('hey')) {
                    aiMessage = "Hello there! Welcome to Auto-LMS. How can I assist you with your learning journey today?";
                } else if (lowerMsg.includes('my courses') || lowerMsg.includes('enrolled')) {
                    aiMessage = "You can view your enrolled courses by going to your 'Student Dashboard' and clicking on the 'My Courses' tab.";
                } else if (lowerMsg.includes('help with quiz') || lowerMsg.includes('quiz')) {
                    aiMessage = "To take a quiz, navigate to the specific course material and click on the 'Quizzes' section. Make sure you complete the lessons first!";
                } else if (lowerMsg.includes('support') || lowerMsg.includes('contact')) {
                    aiMessage = "You can contact support by visiting the 'Contact Us' page from the main menu, or email us directly at support@autolms.com.";
                } else if (lowerMsg.includes('certificate')) {
                    aiMessage = "Certificates are automatically awarded once you complete 100% of a course's lessons. You'll find them in your Dashboard.";
                } else {
                    aiMessage = "That's a great question! While my direct connection to the cloud is temporarily down due to an API rejection, I am pre-programmed to help you with anything related to LMS usage, checking courses, taking quizzes, and viewing certificates!";
                }
            }
        }

        res.status(200).json({
            success: true,
            message: aiMessage
        });

    } catch (error) {
        console.error('Chatbot Final Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error: ' + (error.message || 'Server Error in Chatbot API')
        });
    }
};
