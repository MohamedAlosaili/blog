import { useEffect } from "react";
import { useLoaderData, Form, useSubmit } from "react-router-dom";

import { getPosts, getPostsFromSearch } from "../../fetchData";
import "./home.css";
import Post from "./Post";

export async function loader({ request }) {
  let posts;

  const query = new URL(request.url).searchParams.get("search");

  if (query) {
    posts = await getPostsFromSearch(query);
  } else {
    posts = await getPosts();
  }

  if (!posts.success)
    throw new Response({}, { status: posts.status, statusText: posts.error });

  return { posts: posts.data, query };
}

const Home = () => {
  const { posts, query } = useLoaderData();
  const submit = useSubmit();

  useEffect(() => {
    document.title = `<Blog />${
      query ? ` | Search result for '${query}'` : ""
    }`;
  }, [query]);

  const postsList = posts.map(post => <Post key={post.id} post={post} />);

  const noPostsFound = query ? (
    <p className="home--notfound">
      No posts found for <i>{query}</i>
    </p>
  ) : (
    <p className="home--notfound">No posts found</p>
  );

  return (
    <main className="home">
      <Form className="home--form">
        <input
          type="search"
          placeholder="Search..."
          name="search"
          className="home--search"
          defaultValue={query}
          onChange={e =>
            submit(e.currentTarget.form, { replace: query !== null })
          }
        />
      </Form>
      <section className="home--posts">
        {postsList.length > 0 ? postsList : noPostsFound}
      </section>
    </main>
  );
};

export default Home;
