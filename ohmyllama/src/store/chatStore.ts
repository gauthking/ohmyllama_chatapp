import { create } from "zustand";
import { ChatStoreState, ChatState } from "../@types/types";

export const useChatStore = create<ChatStoreState>((set) => ({
    currentChat: null,
    setCurrentChat: (chat: ChatState | null) => set({ currentChat: chat }),
    message: "",
    setMessage: (message) => set({ message }),
    response: "",
    setResponse: (response) => set({ response }),
    loading: false,
    setLoading: (loading) => set({ loading }),
}));
