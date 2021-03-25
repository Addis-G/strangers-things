const API_BASE_URL =
  "https://strangers-things.herokuapp.com/api/2101-VPI-RM-WEB-PT";

const generalFetch = async function (url, method, body) {
  try {
    //debugger;
    const response = await fetch(url, {
      method: `${method}`,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        user: body,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const logIn = async function (body) {
  //debugger;
  const { success, error, data } = await generalFetch(
    API_BASE_URL + "/users/login",
    "POST",
    body
  );

  if (success) {
    const { token, message } = data;
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
    //debugger;
    const response = await fetch(API_BASE_URL + "/users/register", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        user: {
          username,
          password,
        },
      }),
    });
    //debugger;
    const data = await response.json();
    return data;
  } catch (error) {
    //debugger;
    console.log(error);
  }
}

const clearRegistrationInputs = function () {
  for (let el of $(".registration-container")
    .closest("div")
    .children("input")) {
    $(el).val("");
  }
};
const handleCloseButtonClick = function () {
  //debugger;

  //   for (let el of $(this).closest("div").children("input")) {
  //     //console.log($(el));
  //     $(el).trigger("reset");
  //   }
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

$(".registration-container").on(
  "click",
  ".close-button",
  handleCloseButtonClick
);

const handleNavLinksClick = function (e) {
  e.preventDefault();
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
        $(this).closest(".notification-span"),
        "green-result-notification"
      );
    } else {
      const { name, message } = response.error;
      notificationLoReg(
        message,
        $(this).closest(".notification-span"),
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
  debugger;
  e.preventDefault();
  //debugger;
  const token = JSON.stringify(localStorage.getItem("token"));
  if (token !== "null") {
    return;
  }
  try {
    const response = await logIn({
      username: $("#login-user-id").val(),
      password: $("#login-user-password").val(),
    });
    const { success, data, error } = response;

    if (success) {
      console.log($(this).closest(".notification-span"));
      notificationLoReg(
        data.message,
        $(this).closest(".notification-span"),
        "green-result-notification"
      );
      return;
    } else {
      notificationLoReg(
        error.message,
        $(this).closest(".notification-span"),
        "red-result-notification"
      );
    }
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};

$(".login-container").on("click", ".close-button", handleCloseButtonClick);
$(".nav-bar").on("click", ".login-link, .register-link", handleNavLinksClick);
$(".login-btn").on("click", ".login-btn", handleLoginButtonClick);
$(".register-btn").click(handleRegisterButtonClick);
$(".login-btn").click(handleLoginButtonClick);
