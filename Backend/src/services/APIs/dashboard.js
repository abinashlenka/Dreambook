import { appendQueryParams } from "../server-apis/helper";
import { URL, responseValidator, apiError, getAuthToken } from "./helper";

export const getAllEmployees = async (payload) => {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${await getAuthToken()}`);
  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  try {
    const response = await fetch(
      URL + `/users${appendQueryParams(payload)}`,
      requestOptions
    );
    return responseValidator(response);
  } catch (e) {
    return apiError(e);
  }
};

