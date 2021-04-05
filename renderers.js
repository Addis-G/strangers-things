import {
  handlePostDeletBtnClick,
  handleMessageIconClick,
  handleMessageCountLinkClick,
  handleModalCloseClick,
  handlePaginationNextClick,
  handlePaginationPrevClick,
  handleMatchingItemClicked,
  handleMessagePostClick,
  handleIncomingMessagePostClick,
} from "./handlers.js";

import { testMe } from "./api_calls.js";
export const renderPosts = function ({ posts }, paging = 1) {
  let currentPagePosts;
  if (paging == 1) {
    const startRecordIndex = window.app_state.currentPage * 9 - 9;
    const lastRecordIndex = window.app_state.currentPage * 9;
    currentPagePosts = posts.filter((post, index) =>
      index >= startRecordIndex && index < lastRecordIndex ? post : ""
    );
  }

  if (paging == 0) {
    currentPagePosts = [...posts];
  }
  const postsElement = currentPagePosts.map((post) =>
    $(`<div class='post'></div>`)
      .append(
        `${Object.entries(post)
          .map((entry) => createPostElement(entry))
          .join("")}`
      )
      .data("post_id", post._id)
      .prepend(
        `<header class='post-header'>${createPostEntryElement(
          "Title",
          post["title"]
        )}  ${
          post.messages.length > 0
            ? `<span class="notification-icon">notifications</span><span class='notification-number'>${post.messages.length}</span>`
            : ""
        }</header>`
      )
      .append(
        `<footer class="post-footer">${
          post.isAuthor
            ? `<span class='post-delete'>delete</span>`
            : `<span class='message-icon' >message</span>`
        }
        </footer>`
      )
  );

  $(".posts-display").empty();
  $(".posts-display").append(postsElement);
  $(".posts-display").on(
    "click",
    ".post .post-footer .post-delete",
    handlePostDeletBtnClick
  );
  $(".posts-display").on(
    "click",
    ".post .post-footer .message-icon",
    handleMessageIconClick
  );

  $(".posts-display").on(
    "click",
    ".post .post-header .notification-number",
    handleMessageCountLinkClick
  );
  $(".main").find(".navigation-container").empty();
  if (paging == 1) $(".main").append(renderPaging);
};

export const createPostElement = function ([enteryName, enteryValue]) {
  if (enteryName == "_id") return "";
  if (enteryName == "__v") return "";
  if (enteryName == "cohort") return "";
  if (enteryName == "messages") return "";
  if (enteryName == "isAuthor") return "";
  enteryName = enteryName
    .replace("willDeliver", "Will Deliver?")
    .replace("createdAt", "Created At")
    .replace("updatedAt", "Updated At")
    .replace("isAuthor", "Is Author");
  if (enteryName == "title") {
    return "";
  }
  if (enteryName == "messages") {
    return createPostEntryElement(
      enteryName,
      enteryValue.length > 0
        ? `<a href='#' class='message-count-link'>${enteryValue.length}</a>`
        : 0
    );
  }
  if (enteryName == "author" && enteryValue !== undefined) {
    const { username } = enteryValue;
    return createPostEntryElement(enteryName, username);
  }
  return createPostEntryElement(enteryName, enteryValue);
};

const createPostEntryElement = (enteryName, enteryValue) =>
  `<span class="post-entries"><strong>${toTitleCase(enteryName)}:</strong>  ${
    enteryValue === true ? `Yes` : enteryValue === false ? `No` : enteryValue
  }</span>`;
const toTitleCase = (text) =>
  text.split("")[0].toUpperCase() +
  text
    .split("")
    .splice(1, text.split("").length - 1)
    .join("");

export const renderMessages = (messages) => {
  const messageModal = $(
    `<div class="message-modal"><span class="modal-close">highlight_off</span></div>`
  ).append(
    $(`<div class='message-box'></div>`).append(
      messages
        .map(
          ({ content, fromUser: { username }, createdAt }) =>
            `<div class='message-container'><span>From <strong>${username}</strong></span><span>${createdAt}</span><p>${content}</p></div>`
        )
        .join("")
    )
  );
  messageModal.find(".modal-close").click(handleModalCloseClick);
  return messageModal;
};

const renderPaging = () => {
  const currentPage = window.app_state.currentPage;
  const lastPage = Math.ceil(window.app_state.posts.length / 9);

  const pagingElement = $(`<div class='navigation-container'><button class='navigation prev' ${
    currentPage == 1 ? `disabled` : ""
  }>navigate_before<button> 
                         <button class='navigation next' ${
                           lastPage == currentPage ? `disabled` : ""
                         }>navigate_next</button></div>`);
  pagingElement.find(".navigation.next").click(handlePaginationNextClick);
  pagingElement.find(".navigation.prev").click(handlePaginationPrevClick);
  return pagingElement;
};

export const renderMatchingTitles = (matchingPosts) => {
  $(`.search-text-result`).find(".matching-ul").remove();

  // const ul = $(`<ul class='matching-ul'> </ul>`);
  // matchingPosts.forEach((post) => {
  //   const postElement = $(`<li class="search-li"> <h5>${post.title}</h5></li>`);
  //   postElement.click(function (e) {
  //     console.log(post.title);
  //   });
  //   ul.append(postElement);
  // });

  const ul = $(`<ul class='matching-ul'> </ul>`);
  matchingPosts.forEach((post) => {
    const postElement = $(
      `<li class="search-li"> <h5>${post.title}</h5></li>`
    ).data("title", post.title);
    ul.append(postElement);
  });
  ul.click(handleMatchingItemClicked);

  $(".search-text-result").append(ul);
};

export const renderLoggedInUserMessage = function () {
  $(".loggedIn-posts-display").find(".message-group-incoming").remove();
  $(".loggedIn-posts-display").find(".message-group-outgoing").remove();
  const { messages } = window.app_state.currentUser;

  const incominMessages = messages.filter(({ fromUser }) => {
    console.log(window.app_state.userName);
    return fromUser.username !== window.app_state.userName;
  });

  const currentUserPosts = window.app_state.posts.filter(
    (post) => post.author.username == window.app_state.userName
  );

  const incomingMessageGrpElement = $(
    `<div class='message-group-incoming'><h4>Inbox(${incominMessages.length})</h4></div>`
  );

  currentUserPosts.map((post) => {
    const messagesToUser = messages.filter(
      (message) => message.post._id == post._id
    );
    incomingMessageGrpElement.append(
      $(`<div class="post-m-list">
          ${post.title} by ${post.author.username} <p>${post.description}</p> </div>`)
        .data("post_id", post._id)
        .click(handleIncomingMessagePostClick)
    );

    messagesToUser.forEach((mtu) => {
      incomingMessageGrpElement.append(
        $(
          `<div class="message-lists"> From ${mtu.fromUser.username}<p>${mtu.content}</p></div>`
        ).data("post_id", post._id)
      );
    });
  });

  const outGoingMessages = messages.filter(
    ({ fromUser }) => fromUser.username == window.app_state.userName
  );

  const postsCurrentUserSentMsgOn = window.app_state.posts.filter((post) =>
    outGoingMessages.some((op) => op.post._id == post._id)
  );

  const outGoingMessageGrpElement = $(
    `<div class='message-group-outgoing'><h4>Sent(${outGoingMessages.length})</h4></div>`
  );

  postsCurrentUserSentMsgOn.forEach((post) => {
    const postsMessages = outGoingMessages.filter(
      (m) => m.post._id == post._id
    );
    outGoingMessageGrpElement.append(
      $(
        `<div class="post-m-list">
    ${post.title} by ${post.author.username}
    <p>${post.description}</p>
  </div>`
      )
        .data("post_id", post._id)
        .click(handleMessagePostClick)
    );
    postsMessages.forEach((m) =>
      outGoingMessageGrpElement.append(
        $(
          `<div class="message-lists"> From ${m.fromUser.username}<p>${m.content}</p></div>`
        ).data("post_id", post._id)
      )
    );
  });

  //debugger;

  $(".loggedIn-posts-display").append(incomingMessageGrpElement);

  $(".loggedIn-posts-display").append(outGoingMessageGrpElement);
};

export const renderAvatar = async function () {
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
