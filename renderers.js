import {
  handlePostDeletBtnClick,
  handleMessageIconClick,
  handleMessageCountLinkClick,
} from "./handlers.js";

export const renderPosts = function ({ posts }) {
  //const { posts } = data;
  //debugger;

  const postsElement = posts.map((post) =>
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
        )}</header>`
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
    ".post .post-entries .message-count-link",
    handleMessageCountLinkClick
  );
};

export const createPostElement = function ([enteryName, enteryValue]) {
  if (enteryName == "_id") return "";
  if (enteryName == "__v") return "";
  if (enteryName == "cohort") return "";
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
export const renderMessages = (messages) =>
  $("<div></div>").append(
    messages
      .map(
        ({ content, fromuser, reatedat }) =>
          `<span>From ${fromuser.username}</span><span>${createdat}</span>${content}<p></p>`
      )
      .join()
  );
