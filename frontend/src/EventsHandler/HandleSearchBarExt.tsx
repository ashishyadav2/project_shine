import axios from "axios";
import { useEffect, useState } from "react";

export const useSearchBarExt = () => {
  const [tags, setTags] = useState<string[]>([]);
  const [searchReq, setSearchReq] = useState(() => ({
    search_text: "",
    filter: {
      all_chk: false,
      title_chk: false,
      desc_chk: false,
    },
    date_range: {
      from: new Date(2019, 0, 2).toISOString().split("T")[0],
      to: new Date().toISOString().split("T")[0],
      min_date: new Date(2019, 0, 2).toISOString().split("T")[0],
      max_date: new Date().toISOString().split("T")[0],
    },
    sort: 1,
    tags: [] as string[],
  }));

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await axios.get<string[]>(
          "http://localhost:8000/api/get_tags/"
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
    setSearchReq((prev) => ({
      ...prev,
      filter: {
        ...prev.filter,
        [name]: checked,
      },
    }));
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

  const inputChangeHandlers = {
    handleCheckBoxes: handleCheckBoxChange,
    handleDate: handleDateChange,
    handleSort: handleSortChange,
    handleTags: handleTagsChange,
  };
  return { tags, searchReq, inputChangeHandlers };
};
