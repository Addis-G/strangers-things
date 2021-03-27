export const renderPosts = function ({ data }) {
  const { posts } = data;
  const postsElement = posts.map((post) =>
    $(`<div class='post'>`)
      .append(
        `${Object.entries(post)
          .map((entry) => createPostElement(entry))
          .join("")}`
      )
      .data("post", post)
  );
  $(".posts-display").empty();
  $(".posts-display").data("posts", data);
  $(".posts-display").append(postsElement);

  console.log(postsElement);
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
  if (enteryName == "messages") {
    return `<span class="post-entries"><strong>Messages</strong>: ${enteryValue.length}</span>`;
  }
  if (enteryName == "author" && enteryValue !== undefined) {
    const { username } = enteryValue;
    return `<span class="post-entries"><strong>${
      enteryName.split("")[0].toUpperCase() +
      enteryName
        .split("")
        .splice(1, enteryName.split("").length - 1)
        .join("")
    }:</strong> ${username}</span>`;
  }
  //debugger;

  return `<span class="post-entries"><strong>${
    enteryName.split("")[0].toUpperCase() +
    enteryName
      .split("")
      .splice(1, enteryName.split("").length - 1)
      .join("")
  }:</strong>  ${
    enteryValue == true ? `Yes` : enteryValue == false ? `No` : enteryValue
  }</span>`;
};
