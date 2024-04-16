"use client";
import React from 'react';
import { useSidebar } from '../hooks/useSIdebar';

const Sidebar: React.FC = () => {
    const { component } = useSidebar();

    return (
        <div className="flex flex-col p-4 text-slate-200">
            {/* <button onClick={toggleSidebar}>Toggle Sidebar</button> */}
            <span>Component: {component}</span>
        </div>
    );
};

export default Sidebar;