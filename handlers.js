import { generalFetch, createPost, register, logIn } from "./api_calls.js";

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

const clearRegistrationInputs = function () {
  for (let el of $(".registration-container")
    .closest("div")
    .children("input")) {
    $(el).val("");
  }
};

const renderAvatar = async function (userName) {
  const { url } = await fetch(
    `https://avatars.dicebear.com/api/avataaars/${userName}.svg`
  );
  $(".img-avatar").attr("src", url);
  $(".img-avatar").addClass("active");
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
  createPost(body);
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
  } else {
    $(".register-link").attr("disabled", false);
    $(".login-link").attr("disabled", false);
    $(".logout-link ").attr("disabled", true);
    $(".img-avatar").attr("src", "");
    $(".img-avatar").removeClass("active");
  }
};
