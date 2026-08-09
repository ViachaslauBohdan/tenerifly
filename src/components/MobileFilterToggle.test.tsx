import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { useState } from "react";

afterEach(() => {
  cleanup();
});

// Simple test component that mimics the mobile filter toggle behavior
function MobileFilterToggle() {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  const translations = {
    showFilters: "Show filters",
    hideFilters: "Hide filters",
  };
  
  return (
    <div>
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full justify-center"
          data-testid="mobile-filter-toggle"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            data-testid="filter-icon"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          <span className="font-medium">
            {showMobileFilters ? translations.hideFilters : translations.showFilters}
          </span>
        </button>
      </div>
      
      <div className={`lg:block ${showMobileFilters ? 'block' : 'hidden'}`} data-testid="filter-panel">
        <div>Filter content here</div>
      </div>
    </div>
  );
}

describe("Mobile Filter Toggle - Unit Tests", () => {
  it("should render the mobile filter toggle button", () => {
    render(<MobileFilterToggle />);
    
    const button = screen.getByTestId("mobile-filter-toggle");
    expect(button).toBeInTheDocument();
  });

  it("should display 'Show filters' text initially", () => {
    render(<MobileFilterToggle />);
    
    const button = screen.getByTestId("mobile-filter-toggle");
    expect(button).toHaveTextContent("Show filters");
  });

  it("should toggle filter visibility when button is clicked", async () => {
    const user = userEvent.setup();
    render(<MobileFilterToggle />);
    
    const button = screen.getByTestId("mobile-filter-toggle");
    const filterPanel = screen.getByTestId("filter-panel");
    
    // Initially hidden
    expect(filterPanel).toHaveClass("hidden");
    expect(button).toHaveTextContent("Show filters");
    
    // Click to show
    await user.click(button);
    expect(filterPanel).toHaveClass("block");
    expect(button).toHaveTextContent("Hide filters");
    
    // Click to hide again
    await user.click(button);
    expect(filterPanel).toHaveClass("hidden");
    expect(button).toHaveTextContent("Show filters");
  });

  it("should display filter icon in the toggle button", () => {
    render(<MobileFilterToggle />);
    
    const icon = screen.getByTestId("filter-icon");
    expect(icon).toBeInTheDocument();
    expect(icon.tagName).toBe("svg");
  });

  it("should have proper styling classes", () => {
    render(<MobileFilterToggle />);
    
    const button = screen.getByTestId("mobile-filter-toggle");
    
    expect(button.className).toMatch(/bg-blue-600/);
    expect(button.className).toMatch(/text-white/);
    expect(button.className).toMatch(/rounded-lg/);
    expect(button.className).toMatch(/w-full/);
  });

  it("should maintain state through multiple toggles", async () => {
    const user = userEvent.setup();
    render(<MobileFilterToggle />);
    
    const button = screen.getByTestId("mobile-filter-toggle");
    
    // Multiple toggles
    await user.click(button); // Show
    expect(button).toHaveTextContent("Hide filters");
    
    await user.click(button); // Hide
    expect(button).toHaveTextContent("Show filters");
    
    await user.click(button); // Show
    expect(button).toHaveTextContent("Hide filters");
    
    await user.click(button); // Hide
    expect(button).toHaveTextContent("Show filters");
  });

  it("should have lg:hidden class for mobile-only display", () => {
    render(<MobileFilterToggle />);
    
    const button = screen.getByTestId("mobile-filter-toggle");
    const container = button.parentElement;
    
    expect(container?.className).toMatch(/lg:hidden/);
  });

  it("should have lg:block class on filter panel for desktop", () => {
    render(<MobileFilterToggle />);
    
    const filterPanel = screen.getByTestId("filter-panel");
    
    expect(filterPanel.className).toMatch(/lg:block/);
  });
});
