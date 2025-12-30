import { create } from 'zustand'

interface User {
    id: string;
    name: string;
    email: string;
    profile: string;
}

interface UserStore {
    user: User | null;
    addUser: (u: User) => void;
    removeUser: () => void;
}

const useUserStore = create<UserStore>((set) => ({
    user: null,
    addUser: (u: User) => {
        set({ user: u });
    },
    removeUser: () => {
        set({ user: null });
    }
}));

export default useUserStore;