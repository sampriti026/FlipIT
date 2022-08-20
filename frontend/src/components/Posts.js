import React, { useState, useEffect } from "react";

/** Import Orbis SDK */

function Posts({ orbis }) {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);

  /** When the component mounts we start loading the posts from this context. */
  useEffect(() => {
    loadPosts();
  }, []);

  /** Use the Orbis SDK to retrieve the posts shared in this context */
  async function loadPosts() {
    setLoading(true);
    let { data, error, status } = await orbis.getPosts({
      context: "samp",
    });

    if (data) {
      /** If the query is successful we save the results returned in our posts array. */
      setPosts(data);
      setLoading(false);
    }
  }

  if (loading) {
    return <p>Loading posts...</p>;
  }

  /** Display the results returned from query */
  if (posts && posts.length > 0) {
    return posts.map((post, key) => {
      return (
        <div key={key}>
          <p>
            <b>Shared by: {post.creator}</b>
          </p>
          <p>{post.content?.body}</p>
        </div>
      );
    });
  } else {
    return <p>No posts shared in this context.</p>;
  }
}

export default Posts;
