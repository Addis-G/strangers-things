import {
  createPost,
  register,
  logIn,
  testMe,
  deletePost,
  createMessage,
  fetchPosts,
} from "./api_calls.js";
import {
  renderPosts,
  renderMessages,
  renderMatchingTitles,
} from "./renderers.js";
import { getMatchingPosts, isLoggedIn } from "./helpers.js";

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
      console.log(response);
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
      username: userName,
      password: passWord,
    });
    const { success, data, error } = response;

    if (success) {
      notificationLoReg(
        data.message,
        $(".login-container").find(".notification-span"),
        "green-result-notification"
      );
      window.app_state.userName = $("#login-user-id").val();
      //debugger;

      udpateLoginButtons();
      fetchPosts();
      renderAvatar();

      return;
    } else {
      notificationLoReg(
        error.message,
        $(".login-container").find(".notification-span"),
        "red-result-notification"
      );
    }
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
      $(".avatar h3").text("Welcome " + data.user.username + "!");
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
  delete window.app_state.userName;
  udpateLoginButtons();
  $(".avatar h3").text("");
  fetchPosts();
};

export const handlePostBtnClick = async function (e) {
  e.preventDefault();
  if (!isLoggedIn()) {
    $(".login-container").addClass("active");
    return;
  }

  const body = {
    title: $("#post-title").val(),
    description: $("#post-description").val(),
    price: $("#post-price").val(),
    location: $("#post-location").val(),
    willDeliver: $("#post-is-delivered").is(":checked") ? true : false,
  };
  try {
    const { data } = await createPost(body);
    window.app_state.posts.push(data.post);
    renderPosts(window.app_state);
    $(".post-form").trigger("reset");
  } catch (error) {
    console.log(error);
  }
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

export const handlePostDeletBtnClick = async function () {
  const post_id = $(this).closest(".post").data("post_id");

  try {
    const response = await deletePost(post_id);

    if (response.success) {
      window.app_state.posts = [
        ...window.app_state.posts.filter((post) => post._id !== post_id),
      ];
    }
    renderPosts(window.app_state);
  } catch (error) {
    console.log(error);
  }
};

export const handleMessageIconClick = async function () {
  const msgInputElement = $(this)
    .closest(".post-footer")
    .find(".message-input");

  if (Array.from(msgInputElement).length == 1) return;
  const postFooterElement = $(this).closest(".post-footer");

  postFooterElement.append(
    `<span class='message-input' ${
      isLoggedIn() ? `contenteditable='true'` : ""
    }>${
      !isLoggedIn()
        ? `Please Log In/Register to send a message to the poster`
        : ""
    }<span>`
  );

  $(".posts-display").on(
    "keypress",
    ".post .post-footer .message-input",
    handleMessageBoxKeyPress
  );
  $(".posts-display").on(
    "focusout",
    ".post .post-footer .message-input",
    handleMessageBoxBlur
  );
};

const handleMessageBoxKeyPress = async function (e) {
  const post_id = $(this).closest(".post").data("post_id");
  const messageText = $(this).text();
  try {
    if (e.which == 13 && messageText !== "") {
      const response = await createMessage(post_id, $(this).text());
      if (response.success == true) $(this).text("message Sent successfully!");
    }
  } catch (error) {
    console.log(error);
  }
};

const handleMessageBoxBlur = function (e) {
  $(this).remove();
};

export const handleMessageCountLinkClick = function (e) {
  const post_id = $(this).closest(".post").data("post_id");
  const post = window.app_state.posts.filter((post) => post._id == post_id);
  $("body").append(renderMessages(post[0].messages));
};
export const handleModalCloseClick = function () {
  $("body").find(".message-modal").remove();
};
export const handlePaginationNextClick = () => {
  window.app_state.currentPage++;
  if (window.app_state.searchText == "") {
    renderPosts(window.app_state);
  } else renderPosts({ posts: getMatchingPosts(window.app_state.searchText) });
};
export const handlePaginationPrevClick = () => {
  window.app_state.currentPage--;
  if (window.app_state.searchText == "") {
    renderPosts(window.app_state);
  } else renderPosts({ posts: getMatchingPosts(window.app_state.searchText) });
};

export const handleSearchTextInput = (e) => {
  const searchText = $(".search-form").find(".search-text").val();
  renderMatchingTitles(getMatchingPosts(searchText));
};

export const handleSearchTextFocusOut = (e) => {
  // $(".matching-ul").remove();
  //$(".search-text").val($(e.target).parent().data("title"));
  //$(".matching-ul").remove();
};

export const handleMatchingItemClicked = (e) => {
  $(".search-text").val($(e.target).parent().data("title"));
  $(".matching-ul").remove();
};

export const handleSearchBtnClick = (e) => {
  e.preventDefault();
  window.app_state.currentPage = 1;
  window.app_state.searchText = $(".search-text").val();
  console.log(window.app_state.searchText);
  renderPosts({ posts: getMatchingPosts(window.app_state.searchText) });
  $(".matching-ul").remove();
};
