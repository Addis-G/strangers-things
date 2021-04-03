import {
  handlePostDeletBtnClick,
  handleMessageIconClick,
  handleMessageCountLinkClick,
  handleModalCloseClick,
  handlePaginationNextClick,
  handlePaginationPrevClick,
  handleMatchingItemClicked,
} from "./handlers.js";

export const renderPosts = function ({ posts }) {
  const startRecordIndex = window.app_state.currentPage * 9 - 9;
  const lastRecordIndex = window.app_state.currentPage * 9;
  const currentPagePosts = posts.filter((post, index) =>
    index >= startRecordIndex && index < lastRecordIndex ? post : ""
  );

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
  $(".posts-display").append(renderPaging);
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
