import { fetchPosts } from "./api_calls.js";
import { udpateLoginButtons } from "./handlers.js";
import {
  handleLoginButtonClick,
  handleCloseButtonClick,
  handleRegisterButtonClick,
  handleNavLinksClick,
  handleLogOutLinkClick,
  handlePostBtnClick,
  handleSearchTextFocusOut,
  handleSearchTextInput,
  handleSearchBtnClick,
} from "./handlers.js";

window.app_state = { userName: null, posts: null };

const logOut = function () {};

const isLoggedIn = function () {};

$(".registration-container").on(
  "click",
  ".close-button",
  handleCloseButtonClick
);

$(".login-container").on("click", ".close-button", handleCloseButtonClick);
$(".nav-bar").on("click", ".login-link, .register-link", handleNavLinksClick);
$(".login-btn").on("click", ".login-btn", handleLoginButtonClick);
$(".register-btn").click(handleRegisterButtonClick);
$(".login-btn").click(handleLoginButtonClick);
$(".logout-link").click(handleLogOutLinkClick);
$(".submit-post-btn").click(handlePostBtnClick);
$(".search-bar").on(
  "input",
  `.search-form input[type="text"]`,
  handleSearchTextInput
);
$(".search-bar").on(
  "focusout",
  `.search-form input[type="text"]`,
  handleSearchTextFocusOut
);
$(".search-btn").click(handleSearchBtnClick);
udpateLoginButtons();
fetchPosts();
