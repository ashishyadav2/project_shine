import { range } from "lodash";
import React from "react";
interface SkeletonProps {
  isAdmin?: boolean;
}
const Skeleton = ({ isAdmin = false }: SkeletonProps) => {
  const skeletonArray = range(1, 7);
  const cls = isAdmin ? "cardPageContainerBtmAdmin" : "cardPageContainerBtm";
  return (
    <div className={`skeletonLoaderContainer ${cls} animate-pulse`}>
      {skeletonArray.map((index) => (
        <div className="cardContainer" key={index}>
          <div className="cardBgImg">
            <div className="cardTagsContainer"></div>
          </div>

          <div className="cardContent">
            <div className="cardTitle font-body"></div>
            <div className="cardDescription font-body"></div>
            <div className="cardActions"></div>
          </div>

          <div className="cardDateDiv font-ui">
            <span className="from"></span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Skeleton;
