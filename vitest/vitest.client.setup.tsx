import React from "react";
import { vi } from "vitest";

vi.mock('react-winbox', () => ({
    default: ({ children }) => <div className="mocked-winbox">{children}</div>
}));