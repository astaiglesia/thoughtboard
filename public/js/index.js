/** Vanilla DOM Manipulation */
const postButton = document.getElementById('post'),
      postInput = document.getElementById('post-input'),
      userInput = document.getElementById('user'),
      pwInput = document.getElementById('pass'),
      postList = document.getElementById('post-list');
postList.style.listStyleType = 'none';

console.log('javascript successfully loaded');

// Dynamic UI Component
class Post_Card {
  constructor(post, index) {
    const post_card = document.createElement('li');
    post_card.className = 'post_card';
    post_card.id = index;
    post_card.innerText = `${post.content}   \n by ${post.username}`;

    const deleteButton = document.createElement('button');
    deleteButton.className = 'del';
    deleteButton.id = `${post._id}`;
    deleteButton.innerText = 'X';
    deleteButton.addEventListener('click', () => deletePost(post._id));

    post_card.appendChild(deleteButton);
    postList.appendChild(post_card);
  }
}

/** ------ Client Tasks -------- */
const getPosts = () => {
  const clearList = (postlist) => {
    while (postList.hasChildNodes()) {
      postList.removeChild(postList.firstChild);
    }
  };
  fetch('/api/messages')
    .then((data) => data.json())
    .then((posts) => {
      clearList(postList);
      posts.forEach((post, index) => new Post_Card(post, index));
    })
    .catch((err) =>
      console.error('there was an error in retrieving the messages', err)
    );
};
window.addEventListener('load',
  () => getPosts() //, setInterval(getPosts, 10000))
);

const addPost = () => {
  const content = postInput.value,
        author = 'tester', // get from logged in user state
        userID = '123tester(ASDF'; // [] setup redux if UI gets a version update to React

  if (!content.length) {
    alert('how about we spend a bit more time with that thought?');
    return false;
  }

  fetch('/api/messages', {
    method: 'POST',
    body: JSON.stringify({
      content,
      author,
      userID,
    }),
    headers: {
      'Content-type': 'application/json',
    },
  })
    .then(() => getPosts())
    .catch((err) => console.error('error in posting your new message: ', err));
};
postButton.addEventListener('click', addPost);

const deletePost = (param) => {
  fetch(`/api/messages/${param}`, {
    method: 'DELETE',
  })
    .then(() => getPosts())
    .catch((err) => console.error('error in deleting the message: ', err));
};
