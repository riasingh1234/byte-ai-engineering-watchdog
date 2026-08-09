// backend/publishing/feedStore.js

let posts = [];

function addPost(post) {
  posts.push(post);
}

function getPosts() {
  return [...posts].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
}

function getPostCount() {
  return posts.length;
}

module.exports = {
  addPost,
  getPosts,
  getPostCount,
};