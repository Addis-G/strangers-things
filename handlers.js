import {
  generalFetch,
  createPost,
  register,
  logIn,
  testMe,
} from "./api_calls.js";
import { renderPosts } from "./renderers.js";

export const handleCloseButtonClick = function () {
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

export const handleRegisterButtonClick = async function (e) {
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

export const handleLoginButtonClick = async function (e) {
  e.preventDefault();
  const token = localStorage.getItem("token");
  if (token !== null) {
    renderAvatar();
    return;
  }
  const userName = $("#login-user-id").val();
  const passWord = $("#login-user-password").val();
  try {
    const response = await logIn({
      username: userName, //$("#login-user-id").val(),
      password: passWord, //$("#login-user-password").val(),
    });
    const { success, data, error } = response;

    if (success) {
      notificationLoReg(
        data.message,
        $(".login-container").find(".notification-span"),
        "green-result-notification"
      );
      window.app_state.userName = $("#login-user-id").val();
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

const clearRegistrationInputs = function () {
  for (let el of $(".registration-container")
    .closest("div")
    .children("input")) {
    $(el).val("");
  }
};

const renderAvatar = async function () {
  if (window.app_state.userName == null) {
    const token = localStorage.getItem("token");
    if (token == null) return;
    try {
      const response = await testMe(token);
      const { data } = await response.json();
      getAvatar(data.user.username);
    } catch (error) {
      console.log(error);
    }
  } else {
    getAvatar(window.app_state.userName);
  }
};
const getAvatar = async (username) => {
  try {
    const { url } = await fetch(
      `https://avatars.dicebear.com/api/avataaars/${username}.svg`
    );
    $(".img-avatar").attr("src", url);
    $(".img-avatar").addClass("active");
  } catch (error) {
    console.log(error);
  }
};

export const handleNavLinksClick = function (e) {
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

export const handleLogOutLinkClick = async function () {
  const token = await localStorage.getItem("token");
  if (token !== null) localStorage.removeItem("token");
  udpateLoginButtons();
};

export const handlePostBtnClick = function (e) {
  e.preventDefault();
  //debugger;
  const body = {
    title: $("#post-title").val(),
    description: $("#post-description").val(),
    price: $("#post-price").val(),
    location: $("#post-location").val(),
    willDeliver: $("#post-is-delivered").is(":checked") ? true : false,
  };
  try {
    const post = createPost(body);
    window.app_stat.posts.push(post);
    renderPosts(window.app_stat);
  } catch (error) {
    console.log(error);
  }

  console.log(body);
};

const notificationLoReg = function (message, element, messageClass) {
  element.text(message);
  element.addClass(`active ${messageClass}`);
};
export const udpateLoginButtons = async function () {
  const token = await localStorage.getItem("token");
  if (token !== null) {
    $(".register-link").attr("disabled", true);
    $(".login-link").attr("disabled", true);
    $(".logout-link ").attr("disabled", false);
    renderAvatar();
  } else {
    $(".register-link").attr("disabled", false);
    $(".login-link").attr("disabled", false);
    $(".logout-link ").attr("disabled", true);
    $(".img-avatar").attr("src", "");
    $(".img-avatar").removeClass("active");
  }
};
