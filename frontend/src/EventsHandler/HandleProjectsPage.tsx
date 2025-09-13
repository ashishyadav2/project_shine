import { useState } from "react";
import axios from "axios";
import { faL } from "@fortawesome/free-solid-svg-icons";

export const useProjectPageData = () => {
  const [projectData, setProjectData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const getProjectData = (loadMore: boolean = true) => {
    setLoading(true);
    axios
      .get(`http://localhost:8000/api/view_create_post/?loadMore=${loadMore}`)
      .then((response) => {
        console.log(response.data);
        let hasMoreFlag = response.data.pop();
        if (hasMoreFlag === undefined) {
          hasMoreFlag = { hasMore: false };
        }
        console.log(hasMoreFlag);
        setHasMore(hasMoreFlag["hasMore"]);
        setProjectData(() => {
          let prevData = [...projectData];
          if (prevData.length > 0 || loadMore) {
            return [...prevData, ...response.data];
          }
          return [...response.data];
        });
        setError(false);
      })
      .catch((err) => {
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
    projectData,
    loading,
    setLoading,
    error,
    getProjectData,
    setProjectData,
  };
};
