import {create} from 'zustand';

type SidebarState = {
    isOpen: boolean;
    toggleSidebar: () => void;
    component: "spreadsheet" | "chart"
    setComponent: (component: "spreadsheet" | "chart") => void;
};

export const useSidebar = create<SidebarState>((set) => ({
    isOpen: false,
    toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
    component: "spreadsheet",
    setComponent: (component) => set({ component }),
}));