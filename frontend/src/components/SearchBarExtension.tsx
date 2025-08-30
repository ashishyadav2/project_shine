import React, { useState } from "react";
import InputField from "./InputField";
import TagContainer from "./TagContainer";
import { SearchBarProvider } from "./SearchBarContext";
import { useSearchBarExt } from "../EventsHandler/HandleSearchBarExt";
interface SearchBarExtensionProps {
  tags: string[];
  searchReq: any;
  inputChangeHandlers: any;
}
export const SearchBarExtension = ({
  tags,
  searchReq,
  inputChangeHandlers,
}: SearchBarExtensionProps) => {
  // const { tags, searchReq, inputChangeHandlers } = useSearchBarExt();
  console.log(searchReq);
  return (
    <SearchBarProvider
      handleTags={inputChangeHandlers.handleTags}
      selectedTags={searchReq.tags}
      isSearchMode={true}
    >
      <div className="searchBarExtensionContainer">
        <div className="searchCheckboxes">
          <label className="container">
            All
            <input
              type="checkbox"
              name="all_chk"
              checked={searchReq.filter.all_chk}
              onChange={inputChangeHandlers.handleCheckBoxes}
            />
            <span className="checkmark"></span>
          </label>

          <label className="container">
            Title
            <input
              type="checkbox"
              name="title_chk"
              checked={searchReq.filter.title_chk}
              onChange={inputChangeHandlers.handleCheckBoxes}
            />
            <span className="checkmark"></span>
          </label>

          <label className="container">
            Description
            <input
              type="checkbox"
              name="desc_chk"
              checked={searchReq.filter.desc_chk}
              onChange={inputChangeHandlers.handleCheckBoxes}
            />
            <span className="checkmark"></span>
          </label>
        </div>

        <div className="searchDateAndSort">
          <div className="sdasDateRange">
            <InputField
              type="date"
              fieldName="From:"
              name="from"
              value={searchReq.date_range.from}
              min={searchReq.date_range.min_date}
              max={searchReq.date_range.max_date}
              inputFunc={inputChangeHandlers.handleDate}
            />
            <InputField
              type="date"
              fieldName="To:"
              name="to"
              value={searchReq.date_range.to}
              min={searchReq.date_range.min_date}
              max={searchReq.date_range.max_date}
              inputFunc={inputChangeHandlers.handleDate}
            />
          </div>

          <div className="sdasSortDiv">
            <p>Sort by:</p>
            <select
              value={searchReq.sort}
              onChange={inputChangeHandlers.handleSort}
            >
              <option value={1}>Latest</option>
              <option value={0}>Older</option>
            </select>
          </div>
        </div>

        <div className="searchByTags">
          <p>Search By Tags</p>
          <div className="tags">
            <TagContainer tagTextArr={tags} />
          </div>
        </div>
      </div>
    </SearchBarProvider>
  );
};
