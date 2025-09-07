import { useState } from "react";
import axios from "axios";

export const useProjectPageData = () => {
  const [projectData, setProjectData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const getProjectData = () => {
    setLoading(true);
    axios
      .get("http://localhost:8000/api/view_create_post/")
      .then((response) => {
        console.log(response.data);
        setProjectData(response.data);
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

  return { projectData, loading, error, getProjectData, setProjectData };
};
