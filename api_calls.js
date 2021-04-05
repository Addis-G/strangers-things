const API_BASE_URL =
  "https://strangers-things.herokuapp.com/api/2101-VPI-RM-WEB-PT";

export let loginToken;
export const generalFetch = async function (url, method, body, token) {
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
    //console.log(data);
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
    ""
  );

  if (success) {
    const { token, message } = data;

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
    const response = await generalFetch(
      "/users/register",
      "POST",
      JSON.stringify({
        user: {
          username,
          password,
        },
      })
    );
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
      "Bearer " + localStorage.getItem("token")
    );

    window.app_state.posts = [...data.posts];
    window.app_state.currentPage = 1;
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
      "Bearer " + localStorage.getItem("token")
    );

    return response;
  } catch (error) {
    console.log(error);
  }
};

export const testMe = async () => {
  try {
    const response = await fetch(API_BASE_URL + "/test/me", {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
    });
    const { data } = await response.json();
    window.app_state.userName = data.user.username;
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const usersMe = async () => {
  try {
    const response = await generalFetch(
      "/users/me",
      "GET",
      "",
      "Bearer " + localStorage.getItem("token")
    );
    const { data } = response;
    window.app_state.currentUser = data;
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
      "Bearer " + localStorage.getItem("token")
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const createMessage = async function (post_id, message) {
  try {
    const response = await generalFetch(
      "/posts/" + post_id + "/messages",
      "POST",
      JSON.stringify({
        message: { content: message },
      }),
      "Bearer " + localStorage.getItem("token")
    );
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const updatePost = async function (post_id, body) {
  try {
    const response = await generalFetch(
      `/posts/${post_id}`,
      "PATCH",
      JSON.stringify({ post: body }),
      "Bearer " + localStorage.getItem("token")
    );

    return response;
  } catch (error) {
    console.log(error);
  }
};
