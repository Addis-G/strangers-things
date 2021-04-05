import { fetchPosts, usersMe, testMe } from "./api_calls.js";
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
  handleMyMsgClick,
  handleMyPostsClick,
  handleAllPostsClick,
} from "./handlers.js";
import {
  renderLoggedInUserMessage,
  renderPosts,
  renderAvatar,
} from "./renderers.js";
import { isLoggedIn } from "./helpers.js";

window.app_state = { userName: null, posts: null };

async function bootStrapping() {
  if (isLoggedIn()) {
    udpateLoginButtons();
    await testMe();
    await usersMe();
    renderLoggedInUserMessage();
    //await fetchPosts();
    //renderPosts(window.app_state);
    $(".posts-display").addClass("hidden");
    $(".msg-post-option").removeClass("hidden");
    renderAvatar();
    window.app_state.currentView = 0; //messages
  } else {
    await fetchPosts();
    renderPosts(window.app_state, 0);
    $(".posts-display").removeClass("hidden");
    $(".msg-post-option").addClass("hidden");
  }
}
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

$(".loggedIn-posts-display").on(
  "click",
  ".msg-post-option #my-messages",
  handleMyMsgClick
);

$(".loggedIn-posts-display").on(
  "click",
  ".msg-post-option #my-posts",
  handleMyPostsClick
);

$(".loggedIn-posts-display").on(
  "click",
  ".msg-post-option #all-posts",
  handleAllPostsClick
);

$("#my-messages").click(handleMyPostsClick);
udpateLoginButtons();
fetchPosts();

bootStrapping();
