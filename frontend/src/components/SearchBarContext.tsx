import React, { createContext, useContext, useState } from "react";

interface SearchBarContextType {
  handleTags: (tag: string) => void;
  selectedTags: string[];
  isSearchMode: boolean;
}

const SearchBarContext = createContext<SearchBarContextType | undefined>(
  undefined
);

export const SearchBarProvider = ({
  children,
  handleTags,
  selectedTags,
  isSearchMode,
}: {
  children: React.ReactNode;
  handleTags: (tag: string) => void;
  selectedTags: string[];
  isSearchMode: boolean;
}) => {
  return (
    <SearchBarContext.Provider
      value={{ handleTags, selectedTags, isSearchMode }}
    >
      {children}
    </SearchBarContext.Provider>
  );
};

export const useSearchBar = () => {
  const context = useContext(SearchBarContext);
  if (!context) {
    return { handleTags: () => {}, selectedTags: [], isSearchMode: false };
  }
  return context;
};
