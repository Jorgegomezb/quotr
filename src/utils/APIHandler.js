"use strict";
import * as axios from "axios";
import constants from "./APIConstants";

export function exceptionAxios(error) {
    let errorRes = "";
    if (error["response"] != null && error["response"]["data"] != null) {
      errorRes = error["response"]["data"];
    } else {
      errorRes = error;
    }
    return errorRes;
  }

export async function get(endUrl) {
    var res = [];
  
    let url =
      constants.API_URL + endUrl;
    console.log(url)
    try {
      await axios
        .get(url, {
          params: {},
          headers:constants.API_AUTH
        })
        .then(response => (res = response.data));
      return Promise.resolve(res);
    } catch (error) {
      throw exceptionAxios(error);
    }
  }