import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector.js";

import { homeEndpoints } from "../endPoints/homeEndpoints.js";
const { GET_COUNTS_API } = homeEndpoints;

export const getUtilityCounts = (data) => async (dispatch) => {

  try {

    const response = await apiConnector("GET", GET_COUNTS_API, {});

    console.log("Response from home api -> ", response);

   

    
    return response?.data;
  } catch (error) {
    console.log("Error: ", error);
    return;
  }
};
