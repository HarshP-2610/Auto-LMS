const API_URL = 'http://localhost:5000/api/messages';

const getContacts = async () => {
    const token = localStorage.getItem('userToken');
    const response = await fetch(`${API_URL}/contacts`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.json();
};

const getMessages = async (otherUserId: string) => {
    const token = localStorage.getItem('userToken');
    const response = await fetch(`${API_URL}/${otherUserId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.json();
};

const sendMessage = async (messageData: { 
    receiverId: string; 
    content?: string; 
    attachment?: string; 
    attachmentType?: string; 
    attachmentName?: string; 
}) => {
    const token = localStorage.getItem('userToken');
    const response = await fetch(`${API_URL}/send`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(messageData)
    });
    return response.json();
};

const uploadFile = async (file: File) => {
    const token = localStorage.getItem('userToken');
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('http://localhost:5000/api/upload/message-attachment', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    });
    return response.json();
};

export const messageService = { getContacts, getMessages, sendMessage, uploadFile };
