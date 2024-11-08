import { create } from "zustand";
import { ChatState } from "../@types/types";

export const useChatStore = create<ChatState>((set) => ({
    currentChat: "",
    setCurrentChat: (currentChat) => set({ currentChat }),
    message: "",
    setMessage: (message) => set({ message }),
    response: "",
    setResponse: (response) => set({ response }),
    loading: false,
    setLoading: (loading) => set({ loading }),
}))