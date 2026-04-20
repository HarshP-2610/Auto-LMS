import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Send, 
  MoreVertical, 
  MessageSquare, 
  User as UserIcon,
  Check,
  CheckCheck,
  Loader2,
  ArrowLeft,
  Paperclip,
  FileIcon,
  Download,
  X,
  FileText,
  Smile
} from 'lucide-react';
import { toast } from 'sonner';
import { messageService } from '@/services/messageService';
import { format } from 'date-fns';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

interface Message {
  _id: string;
  sender: string;
  receiver: string;
  content: string;
  status: 'sent' | 'seen';
  timestamp: string;
  attachment?: string;
  attachmentType?: string;
  attachmentName?: string;
}

interface Contact {
  _id: string;
  name: string;
  avatar: string;
  role: string;
  lastMessage?: {
    content: string;
    timestamp: string;
    status: string;
    isSender: boolean;
  };
}

export function Messages() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [showMobileContacts, setShowMobileContacts] = useState(true);
  
  // Attachment state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const commonEmojis = ['😊', '😂', '👍', '❤️', '🙌', '🔥', '✨', '🤔', '👋', '🎉', '✅', '❌', '🙏', '💯', '🚀', '⭐', '🎈', '😎', '💡', '📚'];
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const currentUserId = userData._id;
  const userRole = userData.role || 'student';

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    if (activeContact) {
      fetchMessages(activeContact._id);
      // Small delay to ensure state updates before scroll
      setTimeout(scrollToBottom, 100);
    }
  }, [activeContact]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await messageService.getContacts();
      if (res.success) {
        setContacts(res.data);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (otherUserId: string) => {
    try {
      setMessagesLoading(true);
      const res = await messageService.getMessages(otherUserId);
      if (res.success) {
        setMessages(res.data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('File too large. Maximum size is 10MB.');
      return;
    }

    setSelectedFile(file);
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newMessage.trim() && !selectedFile) || !activeContact) return;

    try {
      setUploading(true);
      let attachmentData = {};

      if (selectedFile) {
        const uploadRes = await messageService.uploadFile(selectedFile);
        if (uploadRes.filePath) {
          attachmentData = {
            attachment: uploadRes.filePath,
            attachmentType: uploadRes.fileType,
            attachmentName: uploadRes.fileName
          };
        }
      }

      const res = await messageService.sendMessage({
        receiverId: activeContact._id,
        content: newMessage,
        ...attachmentData
      });

      if (res.success) {
        setMessages(prev => [...prev, res.data]);
        setNewMessage('');
        removeFile();
        
        // Update contact list last message
        setContacts(prev => prev.map(c => 
          c._id === activeContact._id 
            ? { ...c, lastMessage: { 
                content: newMessage || (selectedFile?.name ? `Sent an attachment: ${selectedFile.name}` : 'Sent an attachment'), 
                timestamp: new Date().toISOString(), 
                status: 'sent', 
                isSender: true 
              } }
            : c
        ));
        
        setTimeout(scrollToBottom, 10);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const addEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout userRole={userRole as 'student' | 'instructor' | 'admin'}>
      <div className="flex flex-col h-[calc(100vh-160px)] overflow-hidden bg-white/50 dark:bg-gray-950/50 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-800/50 shadow-2xl">
        <div className="flex h-full relative">
        
        {/* Contact List (Left Sidebar) */}
        <div className={`
          ${showMobileContacts ? 'flex' : 'hidden lg:flex'} 
          w-full lg:w-80 flex-col border-r border-gray-200/50 dark:border-gray-800/50 bg-white/30 dark:bg-gray-950/30 backdrop-blur-md
        `}>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Messages</h2>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="Search contacts..."
                className="w-full bg-gray-100/50 dark:bg-gray-900/50 border-none rounded-2xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-gray-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar px-3 space-y-1 pb-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-40 gap-3 text-gray-400">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                <span className="text-xs font-medium">Loading contacts...</span>
              </div>
            ) : filteredContacts.length === 0 ? (
              <div className="text-center py-10 px-4">
                <p className="text-gray-500 dark:text-gray-400 text-sm">No contacts found.</p>
              </div>
            ) : (
              filteredContacts.map(contact => (
                <button
                  key={contact._id}
                  onClick={() => {
                    setActiveContact(contact);
                    setShowMobileContacts(false);
                  }}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group ${
                    activeContact?._id === contact._id
                      ? 'bg-blue-600 shadow-lg shadow-blue-500/20 text-white'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-900/50 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className="relative">
                    <img
                      src={contact.avatar === 'no-photo.jpg' 
                        ? `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name)}&background=random` 
                        : (contact.avatar.startsWith('http') ? contact.avatar : `/uploads/${contact.avatar}`)}
                      alt={contact.name}
                      className="w-12 h-12 rounded-2xl object-cover shadow-sm ring-2 ring-white/10"
                    />
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-950 rounded-full" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex justify-between items-start mb-0.5">
                      <span className="text-sm font-bold truncate">{contact.name}</span>
                      <span className={`text-[10px] ${activeContact?._id === contact._id ? 'text-blue-100' : 'text-gray-400'}`}>
                        {contact.lastMessage ? format(new Date(contact.lastMessage.timestamp), 'HH:mm') : ''}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <p className={`text-xs truncate ${activeContact?._id === contact._id ? 'text-blue-50' : 'text-gray-500 dark:text-gray-400'}`}>
                        {contact.lastMessage?.isSender && <span className="mr-1">You:</span>}
                        {contact.lastMessage ? contact.lastMessage.content : 'No messages yet'}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Window (Right Side) */}
        <div className={`
          ${!showMobileContacts ? 'flex' : 'hidden lg:flex'} 
          flex-1 flex-col bg-white/10 dark:bg-gray-950/10 backdrop-blur-sm relative
        `}>
          {activeContact ? (
            <>
              {/* Chat Header */}
              <div className="px-6 py-4 flex items-center justify-between border-b border-gray-200/50 dark:border-gray-800/50 bg-white/40 dark:bg-gray-950/40 backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setShowMobileContacts(true)}
                    className="lg:hidden p-2 -ml-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                  </button>
                  <div className="relative">
                    <img
                      src={activeContact.avatar === 'no-photo.jpg' 
                        ? `https://ui-avatars.com/api/?name=${encodeURIComponent(activeContact.name)}&background=random` 
                        : (activeContact.avatar.startsWith('http') ? activeContact.avatar : `/uploads/${activeContact.avatar}`)}
                      alt={activeContact.name}
                      className="w-10 h-10 rounded-xl object-cover ring-2 ring-blue-500/20"
                    />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-950 rounded-full" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{activeContact.name}</h3>
                    <p className="text-[10px] font-medium text-green-500 uppercase tracking-wider">Online</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-500 transition-all active:scale-95">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Message Area */}
              <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6 custom-scrollbar bg-gradient-to-b from-transparent to-gray-50/30 dark:to-gray-900/10">
                {messagesLoading ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    <span className="text-sm font-medium">Loading history...</span>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-center my-6">
                      <span className="px-3 py-1 bg-gray-200/50 dark:bg-gray-800/50 text-[10px] font-bold text-gray-500 dark:text-gray-400 rounded-full uppercase tracking-widest">
                        Conversation Started
                      </span>
                    </div>

                    {messages.map((msg, idx) => {
                      const isMe = msg.sender === currentUserId;
                      return (
                        <motion.div
                          key={msg._id}
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.2, delay: idx * 0.02 }}
                          className={`flex ${isMe ? 'justify-end' : 'justify-start'} group`}
                        >
                          <div className={`max-w-[80%] lg:max-w-[65%] space-y-1`}>
                            <div className={`
                              px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm relative pr-10
                              ${isMe 
                                ? 'bg-blue-600 text-white rounded-tr-none' 
                                : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 text-gray-800 dark:text-gray-200 rounded-tl-none'
                              }
                            `}>
                               {msg.attachment && (
                                 <div className="mb-2">
                                   {msg.attachmentType?.startsWith('image/') ? (
                                     <a href={`http://localhost:5000${msg.attachment}`} target="_blank" rel="noreferrer">
                                       <img 
                                         src={`http://localhost:5000${msg.attachment}`} 
                                         alt="attachment" 
                                         className="max-w-full rounded-lg max-h-60 object-contain bg-black/5 cursor-pointer hover:opacity-90 transition-opacity" 
                                       />
                                     </a>
                                   ) : (
                                     <a 
                                       href={`http://localhost:5000${msg.attachment}`} 
                                       target="_blank" 
                                       rel="noreferrer"
                                       className={`flex items-center gap-3 p-3 rounded-xl border ${isMe ? 'bg-blue-700/50 border-blue-500/50 text-white' : 'bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300'} hover:bg-opacity-80 transition-all`}
                                     >
                                       <div className={`p-2 rounded-lg ${isMe ? 'bg-blue-500' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
                                         <FileText className={`w-5 h-5 ${isMe ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`} />
                                       </div>
                                       <div className="flex-1 min-w-0">
                                         <p className="text-xs font-bold truncate">{msg.attachmentName || 'Attachment'}</p>
                                         <p className="text-[10px] opacity-70">Click to view/download</p>
                                       </div>
                                       <Download className="w-4 h-4 opacity-50" />
                                     </a>
                                   )}
                                 </div>
                               )}
                               {msg.content && <p>{msg.content}</p>}
                              <div className={`absolute bottom-1 right-2 flex items-center gap-1`}>
                                <span className={`text-[9px] ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                                  {format(new Date(msg.timestamp), 'HH:mm')}
                                </span>
                                {isMe && (
                                  msg.status === 'seen' 
                                    ? <CheckCheck className="w-3 h-3 text-blue-100" /> 
                                    : <Check className="w-3 h-3 text-blue-200/60" />
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 lg:p-6 bg-white/40 dark:bg-gray-950/40 backdrop-blur-md border-t border-gray-200/50 dark:border-gray-800/50">
                {/* Attachment Preview */}
                <AnimatePresence>
                  {selectedFile && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="mb-4 flex items-center gap-4 bg-gray-50 dark:bg-gray-900/80 p-3 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm relative group"
                    >
                      <button 
                        onClick={removeFile}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors z-10"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      {filePreview ? (
                        <img src={filePreview} alt="preview" className="w-12 h-12 rounded-lg object-cover" />
                      ) : (
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                          <FileIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{selectedFile.name}</p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-tighter">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Ready to send</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form 
                  onSubmit={handleSendMessage}
                  className="relative flex items-center gap-3"
                >
                  <div className="flex-1 relative flex items-center">
                    <div className="absolute left-3 flex items-center">
                       <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 text-gray-400 hover:text-blue-500 transition-colors rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      >
                        <Paperclip className="w-5 h-5" />
                      </button>
                      <input 
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        className="hidden"
                        accept="image/*,.pdf,.doc,.docx,.zip,.txt"
                      />
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                          className={`p-2 transition-colors rounded-xl ${showEmojiPicker ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'}`}
                        >
                          <Smile className="w-5 h-5" />
                        </button>

                        <AnimatePresence>
                          {showEmojiPicker && (
                            <motion.div
                              initial={{ opacity: 0, y: 20, scale: 0.9 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 20, scale: 0.9 }}
                              className="absolute bottom-full left-0 mb-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 p-4 w-64 z-50 overflow-hidden"
                            >
                              <div className="flex items-center justify-between mb-3 px-1">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Quick Emojis</span>
                              </div>
                              <div className="grid grid-cols-5 gap-1">
                                {commonEmojis.map(emoji => (
                                  <button
                                    key={emoji}
                                    type="button"
                                    onClick={() => addEmoji(emoji)}
                                    className="text-xl p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all hover:scale-110 active:scale-95"
                                  >
                                    {emoji}
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    <input
                      type="text"
                      placeholder="Type your message here..."
                      className="w-full bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-gray-800 rounded-2xl py-4 px-24 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-inner"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    
                    <div className="absolute right-3">
                      <button 
                        type="submit"
                        disabled={(!newMessage.trim() && !selectedFile) || uploading}
                        className={`
                          p-2.5 rounded-xl transition-all duration-300
                          ${(newMessage.trim() || selectedFile) && !uploading
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/40 hover:scale-105 active:scale-95' 
                            : 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'}
                        `}
                      >
                        {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50/50 dark:bg-gray-900/20">
              <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-blue-500/10">
                <MessageSquare className="w-12 h-12 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Welcome to Messages</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto text-sm leading-relaxed">
                Connect with your {userData.role === 'student' ? 'instructors' : 'students'} instantly. Select a contact from the list to start chatting.
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.4);
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
    </DashboardLayout>
  );
}
