export const isLoggedIn = function () {
  if (localStorage.getItem("token")) return true;
  return false;
};

export const getMatchingPosts = (searchText) => {
  const searchTokens = searchText.toLowerCase().split(" ");
  const { posts } = window.app_state;
  const matchingTitles = posts.filter((post) =>
    post.title
      .toLowerCase()
      .split(" ")
      .some((titleToken) =>
        searchTokens.some((searchToken) => titleToken.includes(searchToken))
      )
  );
  return matchingTitles;
};
