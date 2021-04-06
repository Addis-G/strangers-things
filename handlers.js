import {
  createPost,
  register,
  logIn,
  deletePost,
  createMessage,
  fetchPosts,
  usersMe,
  updatePost,
} from "./api_calls.js";
import {
  renderPosts,
  renderMessages,
  renderMatchingTitles,
  renderLoggedInUserMessage,
  renderAvatar,
} from "./renderers.js";
import { getMatchingPosts, isLoggedIn } from "./helpers.js";

export const handleCloseButtonClick = function () {
  clearRegistrationInputs();
  let openWindow = $(this).closest(".registration-container");
  if (openWindow.length == 1) {
    openWindow.removeClass("active");
    $(".registeration-result-notification").removeClass("active");
    $("registeration-form").trigger("reset");
    $(".notification-span").text("");
    return;
  } else {
    openWindow = $(this).closest(".login-container");
    openWindow.removeClass("active");
    $(".login-form").trigger("reset");
  }
  $(".notification-span").text("");
};

export const handleRegisterButtonClick = async function (e) {
  e.preventDefault();
  if (
    $("#register-user-id").val() == "" ||
    $("#register-user-id").val().length < 5
  ) {
    notificationLoReg(
      $("#register-user-id").val() == ""
        ? "User Id is a required field"
        : "User Id cannot be less than 5 characters",
      $(".registration-container").find(".notification-span"),
      "red-result-notification"
    );
    return;
  }
  if (
    $("#register-login-password").val() == "" ||
    $("#register-login-password").val().length < 5
  ) {
    notificationLoReg(
      $("#register-login-password").val() == ""
        ? "Password is a required field"
        : "Password cannot be less than 5 characters",
      $(".registration-container").find(".notification-span"),
      "red-result-notification"
    );
    return;
  } //
  if (
    $("#register-reenter-login-password").val() !==
    $("#register-login-password").val()
  ) {
    notificationLoReg(
      "Re-Entered password should match Password",
      $(".registration-container").find(".notification-span"),
      "red-result-notification"
    );
    return;
  }
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
    await renderAvatar();
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

      udpateLoginButtons();
      await usersMe();
      renderLoggedInUserMessage();
      await fetchPosts();
      renderPosts(window.app_state);
      renderAvatar();
      $(".posts-display").addClass("hidden");
      $(".msg-post-option").removeClass("hidden");
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
  $(".posts-display").empty();
  $(".msg-post-option").addClass("hidden");
  $(".message-group-incoming").empty();
  $(".message-group-outgoing").empty();
  await fetchPosts();
  renderPosts(window.app_state, 0);
  $(".posts-display").removeClass("hidden");
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
    let response;
    if ($(".post-form").data("Operation") == "Update") {
      response = await updatePost($(".post-form").data("post_id"), body);
    } else {
      response = await createPost(body);
    }

    const { data } = response;
    if ($(".post-form").data("Operation") !== "Update") {
      window.app_state.posts.push(data.post);
      renderPosts(window.app_state);
    } else {
      await fetchPosts();
      await usersMe();
      renderPosts(window.app_state.currentUser);
    }
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
  if (window.app_state.currentPage + 1 > window.app_state.posts.length / 9)
    return;
  window.app_state.currentPage++;
  if (!window.app_state.searchText) {
    renderPosts(window.app_state);
  } else renderPosts({ posts: getMatchingPosts(window.app_state.searchText) });
};
export const handlePaginationPrevClick = () => {
  window.app_state.currentPage--;
  if (!window.app_state.searchText) {
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
  renderPosts({ posts: getMatchingPosts(window.app_state.searchText) });
  $(".matching-ul").remove();
};

export const handleMessagePostClick = (e) => {
  if ($(e.target).data("post_id") == undefined) return;
  const nl = $(".message-group-outgoing").children(); //find(".message-lists");
  Array.from($(nl)).forEach((mList) => {
    if (
      $(mList).data("post_id") == $(e.target).data("post_id") &&
      !$(mList).hasClass("post-m-list")
    )
      $(mList).toggleClass("hidden");
  });
  if ($(e.target).data("click_status") == 0) {
    $(e.target).data("click_status", 1);
    $(e.target).find(".msg-click-icons").text("add");
  } else {
    $(e.target).data("click_status", 0);
    $(e.target).find(".msg-click-icons").text("remove");
  }
};

export const handleIncomingMessagePostClick = (e) => {
  if ($(e.target).data("post_id") == undefined) return;
  const nl = $(".message-group-incoming").children();
  Array.from($(nl)).forEach((mList) => {
    if (
      $(mList).data("post_id") == $(e.target).data("post_id") &&
      !$(mList).hasClass("post-m-list")
    )
      $(mList).toggleClass("hidden");
  });
  if ($(e.target).data("click_status") == 0) {
    $(e.target).data("click_status", 1);
    $(e.target).find(".msg-click-icons").text("add");
  } else {
    $(e.target).data("click_status", 0);
    $(e.target).find(".msg-click-icons").text("remove");
  }
};

export const handleMyPostsClick = (e) => {
  e.preventDefault();

  window.app_state.currentView = 1; //posts
  $(".message-group-incoming").addClass("hidden");
  $(".message-group-outgoing").addClass("hidden");
  if ($(".posts-display").hasClass("hidden"))
    $(".posts-display").removeClass("hidden");
  renderPosts(window.app_state.currentUser, 0);
};
export const handleMyMsgClick = (e) => {
  e.preventDefault();
  $(".message-group-incoming").removeClass("hidden");
  $(".message-group-outgoing").removeClass("hidden");
  $(".posts-display").addClass("hidden");
};
export const handleAllPostsClick = (e) => {
  $(".message-group-incoming").addClass("hidden");
  $(".message-group-outgoing").addClass("hidden");
  $(".posts-display").removeClass("hidden");
  renderPosts(window.app_state, 0);
};

export const handlePostEditBtnClick = (e) => {
  const post_id = $(e.target).closest(".post").data("post_id");
  const [post] = window.app_state.posts.filter((p) => p._id == post_id);
  if (!post.active) return;
  $("#post-title").val(post.title);
  $("#post-price").val(post.price);
  $("#post-description").val(post.description);
  $("#post-location").val(post.location);
  $("#post-is-delivered").attr("isChecked", post.willDeliver);
  $(".submit-post-btn").text("Save");
  $(".post-form").data("Operation", "Update");
  $(".post-form").data("post_id", post_id);
};
