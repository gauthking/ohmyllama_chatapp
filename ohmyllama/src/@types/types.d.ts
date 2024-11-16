export type ChatStoreState = {
    currentChat: ChatState | null;
    setCurrentChat: (currentChat: ChatState | null) => void;
    message: string | null;
    setMessage: (message: string | null) => void;
    response: string | null;
    setResponse: (response: string | null) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
}

export type ChatMessage = {
    senderMsg: string;
    AiRes: string;
};

export type ChatState = {
    chatId: number;
    chatTitle: string;
    createdAt: string | null;
    lastContextChunk: string | null;
    messages: Array<ChatMessage> | null;
};