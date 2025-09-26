const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

console.log("Base url -> ", import.meta.env.VITE_APP_BASE_URL);

export const homeEndpoints = {
  GET_COUNTS_API: BASE_URL + "/home-routes/get-all-counts",
};
