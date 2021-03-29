export const renderPosts = function ({ data }) {
  const { posts } = data;
  window.app_state.posts = posts;
  const postsElement = posts.map((post) =>
    $(`<div class='post'></div>`)
      .append(
        `${Object.entries(post)
          .map((entry) => createPostElement(entry))
          .join("")}`
      )
      .data("post", post)
      .prepend(
        `<header class='post-header'>${createPostEntryElement(
          "Title",
          post["title"]
        )}</header>`
      )
      .append(
        `<footer class="post-footer">${
          post.isAuthor ? `<button>Delete</button>` : `<button>Message</button>`
        }
        </footer>`
      )
  );
  const postHeaderElements = $(postsElement).find(".post"); //.find("header");
  console.log(postHeaderElements);
  $(".posts-display").empty();
  $(".posts-display").data("posts", data);
  $(".posts-display").append(postsElement);
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
    return createPostEntryElement(enteryName, enteryValue.length);
  }
  if (enteryName == "author" && enteryValue !== undefined) {
    const { username } = enteryValue;
    return createPostEntryElement(enteryName, username);
  }
  return createPostEntryElement(enteryName, enteryValue);
};

const createPostEntryElement = (enteryName, enteryValue) =>
  `<span class="post-entries"><strong>${toTitleCase(enteryName)}:</strong>  ${
    enteryValue == true ? `Yes` : enteryValue == false ? `No` : enteryValue
  }</span>`;
const toTitleCase = (text) =>
  text.split("")[0].toUpperCase() +
  text
    .split("")
    .splice(1, text.split("").length - 1)
    .join("");
