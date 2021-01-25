const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const likesArray = blogs.map((blog) => blog.likes);
  const likesSum = likesArray.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );
  return likesSum;
};

const favoriteBlog = (blog) => {
  const favorite = blog.sort((a, b) => b.likes - a.likes)[0];
  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes,
  };
};
module.exports = { dummy, totalLikes, favoriteBlog };
