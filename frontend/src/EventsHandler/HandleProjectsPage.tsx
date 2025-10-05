import { useState } from "react";
import axios from "axios";
import { faL } from "@fortawesome/free-solid-svg-icons";

export const useProjectPageData = () => {
  const [projectData, setProjectData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currOffset, setCurrOffset] = useState(0);

  const getProjectData = (
    loadMore: boolean = true,
    sortOrder: string = "-1",
    startIndex: string = "0"
  ) => {
    setLoading(true);
    axios
      .get(
        `http://localhost:8000/api/view_create_post/?loadMore=${loadMore}&sortOrder=${sortOrder}&st=${startIndex}`,
        { withCredentials: true }
      )
      .then((response) => {
        console.log(response.data);
        let currOffsett = response.data.pop();
        let hasMoreFlag = response.data.pop();
        if (hasMoreFlag === undefined) {
          hasMoreFlag = { hasMore: false };
        }
        if (currOffsett === undefined) {
          currOffsett = { curr_offset: 0 };
        }
        console.log(hasMoreFlag);
        console.log(currOffsett);
        setHasMore(hasMoreFlag["hasMore"]);
        setCurrOffset(currOffsett["curr_offset"]);
        setProjectData(() => {
          let prevData = [...projectData];
          if (loadMore) {
            return [...prevData, ...response.data];
          }
          return [...response.data];
        });
        setError(false);
      })
      .catch((err) => {
        setHasMore(false);
        console.error(err);
        setProjectData([]);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return {
    hasMore,
    setHasMore,
    currOffset,
    setCurrOffset,
    projectData,
    loading,
    setLoading,
    error,
    getProjectData,
    setProjectData,
  };
};
