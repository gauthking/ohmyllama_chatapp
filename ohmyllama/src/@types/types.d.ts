export type ChatState = {
    currentChat: string;
    setCurrentChat: (currentChat: string) => void;
    message: string;
    setMessage: (message: string) => void;
    response: string;
    setResponse: (response: string) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
}