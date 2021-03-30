import { renderPosts } from "./renderers.js";

const API_BASE_URL =
  "https://strangers-things.herokuapp.com/api/2101-VPI-RM-WEB-PT";

export let loginToken;
export const generalFetch = async function (
  url,
  method,
  body,
  token,
  createType
) {
  try {
    let response;

    if (method == "GET") {
      response = await fetch(API_BASE_URL + url, {
        headers: { Authorization: token },
      });
    } else {
      response = await fetch(API_BASE_URL + url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: body,
      });
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const logIn = async function (body) {
  const { success, error, data } = await generalFetch(
    "/users/login",
    "POST",
    JSON.stringify({ user: body }),
    "",
    "user"
  );

  if (success) {
    const { token, message } = data;
    console.log(data);
    loginToken = token;
    localStorage.setItem("token", token);
    return {
      success,
      error,
      data: { token, message },
    };
  } else {
    return { success, error };
  }
};

export async function register({ username, password }) {
  try {
    const response = await fetch("/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: {
          username,
          password,
        },
      }),
    });
    return response;
  } catch (error) {
    console.log(error);
  }
}

export const fetchPosts = async function () {
  try {
    const { data } = await generalFetch(
      "/posts",
      "GET",
      "",
      "Bearer " + localStorage.getItem("token"),
      "user"
    );
    //debugger;
    window.app_state.posts = [...data.posts];
    renderPosts(window.app_state);
  } catch (error) {
    console.log(error);
  }
};

export const createPost = async function (body) {
  try {
    const response = await generalFetch(
      "/posts",
      "POST",
      JSON.stringify({ post: body }),
      "Bearer " + localStorage.getItem("token"),
      "post"
    );

    return response;
  } catch (error) {
    console.log(error);
  }
};

export const testMe = async (token) => {
  try {
    const response = await fetch(API_BASE_URL + "/test/me", {
      headers: { Authorization: "Bearer " + token },
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const deletePost = async function (postId) {
  try {
    const response = await generalFetch(
      "/posts/" + postId,
      "DELETE",
      "",
      "Bearer " + localStorage.getItem("token"),
      ""
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};
