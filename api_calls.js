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
    console.log(token);

    // response = fetch(API_BASE_URL + "/test/me", {
    //   headers: { Authorization: token },
    // });
    // console.log(response);

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
  //debugger;
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
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}
export const fetchPosts = async function () {
  try {
    const response = await generalFetch(
      "/posts",
      "GET",
      "",
      "Bearer " + localStorage.getItem("token"),
      "user"
    );

    renderPosts(response);
  } catch (error) {
    console.log(error);
  }
};
export const createPost = async function (body) {
  debugger;
  try {
    const { post } = await generalFetch(
      "/posts",
      "POST",
      JSON.stringify({ post: body }),
      "Bearer " + localStorage.getItem("token"),
      "post"
    );
    const posts = $(".posts-display").data("posts");
    posts.push(post);
    renderPosts(posts);
    console.log(posts);
  } catch (error) {
    console.log(error);
  }
};
