import axios from "axios";
import { useEffect, useState } from "react";

export const useSearchBarExt = () => {
  const [tags, setTags] = useState<string[]>([]);
  const [searchReq, setSearchReq] = useState(() => ({
    search_text: "",
    filter: {
      all_chk: false,
      title_chk: true,
      desc_chk: false,
    },
    date_range: {
      from: new Date(2019, 0, 2).toISOString().split("T")[0],
      to: new Date().toISOString().split("T")[0],
      min_date: new Date(2019, 0, 2).toISOString().split("T")[0],
      max_date: new Date().toISOString().split("T")[0],
    },
    sort: -1,
    tags: [] as string[],
  }));

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await axios.get<string[]>(
          `${import.meta.env.VITE_BACKEND_URL}/api/get_tags/`
        );
        setTags(res.data);
        console.log(res.data);
      } catch (err) {
        console.error("Failed to fetch tags:", err);
      }
    };

    fetchTags();
  }, []);
  const handleCheckBoxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setSearchReq((prev) => {
      let chkFilter = { ...prev.filter, [name]: checked };
      if (name == "all_chk") {
        chkFilter = { ...chkFilter, title_chk: checked, desc_chk: checked };
      }
      if (chkFilter.desc_chk && chkFilter.title_chk) {
        chkFilter.all_chk = true;
      } else if (name != "all_chk") {
        chkFilter.all_chk = false;
      }
      return { ...prev, filter: chkFilter };
    });
  };
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchReq((prev) => ({
      ...prev,
      date_range: {
        ...prev.date_range,
        [name]: value,
      },
    }));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchReq((prev) => ({
      ...prev,
      sort: Number(e.target.value),
    }));
  };
  const handleTagsChange = (tag: string) => {
    setSearchReq((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };
  const handleSearchTextChange = (searchText: string) => {
    setSearchReq((prev) => ({
      ...prev,
      search_text: searchText,
    }));
  };
  const validateSearchData = () => {
    const from_date = searchReq.date_range.from;
    const to_date = searchReq.date_range.to;
    const min_date = searchReq.date_range.min_date;
    const max_date = searchReq.date_range.max_date;
    if (from_date < min_date || to_date > max_date || to_date < from_date) {
      return false;
    }
    return true;
  };
  const inputChangeHandlers = {
    handleCheckBoxes: handleCheckBoxChange,
    handleDate: handleDateChange,
    handleSort: handleSortChange,
    handleTags: handleTagsChange,
    handleSearchText: handleSearchTextChange,
    dataValidation: validateSearchData,
  };
  return { tags, searchReq, inputChangeHandlers };
};
