const API_BASE_URL =
  "https://strangers-things.herokuapp.com/api/2101-VPI-RM-WEB-PT";

let loginToken;
const generalFetch = async function (url, method, body, token, createType) {
  try {
    let response;
    console.log(token);

    response = fetch(API_BASE_URL + "/test/me", {
      headers: { Authorization: token },
    });
    console.log(response);

    if (method == "GET") {
      response = await fetch(url);
    } else {
      response = await fetch(url, {
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

const logIn = async function (body) {
  const { success, error, data } = await generalFetch(
    API_BASE_URL + "/users/login",
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
const logOut = function () {};

const isLoggedIn = function () {};

async function register({ username, password }) {
  try {
    const response = await fetch(API_BASE_URL + "/users/register", {
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
const fetchPosts = async function () {
  try {
    const response = await generalFetch(
      API_BASE_URL + "/posts",
      "GET",
      "",
      "user"
    );
    //console.log(response);
    renderPosts(response);
  } catch (error) {
    console.log(error);
  }
};
const createPost = async function (body) {
  try {
    const { post } = await generalFetch(
      API_BASE_URL + "/posts",
      "POST",
      JSON.stringify({ post: body }),
      "Bearer " + loginToken,
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

const clearRegistrationInputs = function () {
  for (let el of $(".registration-container")
    .closest("div")
    .children("input")) {
    $(el).val("");
  }
};
const handleCloseButtonClick = function () {
  clearRegistrationInputs();
  let openWindow = $(this).closest(".registration-container");
  if (openWindow.length == 1) {
    openWindow.removeClass("active");
    $(".registeration-result-notification").removeClass("active");
    return;
  } else {
    openWindow = $(this).closest(".login-container");
    openWindow.removeClass("active");
  }
};
const renderAvatar = async function (userName) {
  const { url } = await fetch(
    `https://avatars.dicebear.com/api/avataaars/${userName}.svg`
  );
  $(".img-avatar").attr("src", url);
  $(".img-avatar").addClass("active");
};

$(".registration-container").on(
  "click",
  ".close-button",
  handleCloseButtonClick
);

const handleNavLinksClick = function (e) {
  e.preventDefault();
  const token = localStorage.getItem("token");
  if (token !== null) {
    return;
  }
  if ($(this).hasClass("login-link")) {
    $(".login-container").addClass("active");
    return;
  } else if ($(this).hasClass("register-link")) {
    $(".registration-container").addClass("active");
    return;
  }
};
const notificationLoReg = function (message, element, messageClass) {
  element.text(message);
  element.addClass(`active ${messageClass}`);
};
const handleRegisterButtonClick = async function (e) {
  e.preventDefault();

  let response;
  try {
    response = await register({
      username: $("#register-user-id").val(),
      password: $("#register-login-password").val(),
    });
    if (response.success) {
      const {
        data: { token, message },
      } = response;
      localStorage.setItem("token", token);
      notificationLoReg(
        message,
        $(".registration-container").find(".notification-span"),
        "green-result-notification"
      );
    } else {
      const { name, message } = response.error;
      notificationLoReg(
        message,
        $(".registration-container").find(".notification-span"),
        "red-result-notification"
      );
    }
  } catch (error) {
    console.log(error);
  } finally {
    clearRegistrationInputs();
  }
};

const handleLoginButtonClick = async function (e) {
  e.preventDefault();
  const token = localStorage.getItem("token");
  if (token !== null) {
    return;
  }
  const userName = $("#login-user-id").val();
  try {
    const response = await logIn({
      username: $("#login-user-id").val(),
      password: $("#login-user-password").val(),
    });
    const { success, data, error } = response;

    if (success) {
      notificationLoReg(
        data.message,
        $(".login-container").find(".notification-span"),
        "green-result-notification"
      );
      renderAvatar(userName);
      udpateLoginButtons();

      return;
    } else {
      notificationLoReg(
        error.message,
        $(".login-container").find(".notification-span"),
        "red-result-notification"
      );
    }
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};
const udpateLoginButtons = async function () {
  const token = await localStorage.getItem("token");
  loginToken = token;
  if (token !== null) {
    $(".register-link").attr("disabled", true);
    $(".login-link").attr("disabled", true);
    $(".logout-link ").attr("disabled", false);
  } else {
    $(".register-link").attr("disabled", false);
    $(".login-link").attr("disabled", false);
    $(".logout-link ").attr("disabled", true);
    $(".img-avatar").attr("src", "");
    $(".img-avatar").removeClass("active");
  }
};
const handleLogOutLinkClick = async function () {
  const token = await localStorage.getItem("token");
  if (token !== null) localStorage.removeItem("token");
  udpateLoginButtons();
};

const renderPosts = function ({ data }) {
  const { posts } = data;
  const postsElement = posts.map((post) =>
    $(`<div class='post'>`)
      .append(
        `${Object.entries(post)
          .map((entry) => createPostElement(entry))
          .join("")}`
      )
      .data("post", post)
  );
  $(".posts-display").empty();
  $(".posts-display").data("posts", data);
  $(".posts-display").append(postsElement);

  console.log(postsElement);
};

const createPostElement = function ([enteryName, enteryValue]) {
  if (enteryName == "_id") return "";
  if (enteryName == "__v") return "";
  if (enteryName == "cohort") return "";
  enteryName = enteryName
    .replace("willDeliver", "Will Deliver?")
    .replace("createdAt", "Created At")
    .replace("updatedAt", "Updated At")
    .replace("isAuthor", "Is Author");
  if (enteryName == "messages") {
    return `<span class="post-entries"><strong>Messages</strong>: ${enteryValue.length}</span>`;
  }
  if (enteryName == "author" && enteryValue !== undefined) {
    const { username } = enteryValue;
    return `<span class="post-entries"><strong>${
      enteryName.split("")[0].toUpperCase() +
      enteryName
        .split("")
        .splice(1, enteryName.split("").length - 1)
        .join("")
    }:</strong> ${username}</span>`;
  }

  return `<span class="post-entries"><strong>${
    enteryName.split("")[0].toUpperCase() +
    enteryName
      .split("")
      .splice(1, enteryName.split("").length - 1)
      .join("")
  }:</strong>  ${
    enteryValue == true ? `Yes` : enteryValue == false ? `No` : enteryValue
  }</span>`;
};

const handlePostBtnClick = function (e) {
  e.preventDefault();
  //debugger;
  const body = {
    title: $("#post-title").val(),
    description: $("#post-description").val(),
    price: $("#post-price").val(),
    location: $("#post-location").val(),
    willDeliver: $("#post-is-delivered").is(":checked") ? true : false,
  };
  createPost(body);
  console.log(body);
};

$(".login-container").on("click", ".close-button", handleCloseButtonClick);
$(".nav-bar").on("click", ".login-link, .register-link", handleNavLinksClick);
$(".login-btn").on("click", ".login-btn", handleLoginButtonClick);
$(".register-btn").click(handleRegisterButtonClick);
$(".login-btn").click(handleLoginButtonClick);
$(".logout-link").click(handleLogOutLinkClick);
$(".submit-post-btn").click(handlePostBtnClick);

udpateLoginButtons();
fetchPosts();
