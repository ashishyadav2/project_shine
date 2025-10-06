import axios from "axios";
import { useEffect, useState } from "react";

export const utils = () => {
  const getISODate = (inputDate: string) => {
    try {
      inputDate = inputDate.split("T")[0];
      let dateParts = inputDate.split("-");
      const outputDate = `${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`;
      return outputDate;
    } catch (error) {
      if (import.meta.env.VITE_LOGGING) {
        console.log(error);
      }
      return "2002-11-22";
    }
  };
  const strToDate = (inputDateString: string) => {
    try {
      return new Date(inputDateString).toISOString();
    } catch (error) {
      if (import.meta.env.VITE_LOGGING) {
        console.log(error);
      }
    }
  };
  const prettifyDate = (inputDate: string) => {
    try {
      const shortMonths = Array.from({ length: 12 }, (_, i) =>
        new Date(0, i).toLocaleString("en-US", { month: "short" })
      );
      inputDate = getISODate(inputDate);
      let [year, month, day] = inputDate.split("-");
      const prettyDate = `${day}-${shortMonths[Number(month) - 1]}-${year}`;
      return prettyDate;
    } catch (error) {
      if (import.meta.env.VITE_LOGGING) {
        console.log(error);
      }
    }
  };
  return { getISODate, strToDate, prettifyDate };
};
