import { useEffect } from "react";
import {
  useLoaderData,
  Form,
  useSubmit,
  useNavigation,
  Link,
} from "react-router-dom";
import { CgSpinnerTwo } from "react-icons/cg";

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
  const navigation = useNavigation();
  const submit = useSubmit();

  useEffect(() => {
    document.title = `<Blog />${
      query ? ` | Search result for '${query}'` : ""
    }`;
  }, [query]);

  const isSearching =
    navigation.location &&
    new URLSearchParams(navigation.location?.search).get("search");

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
        {isSearching && <CgSpinnerTwo className="loading-spinner" />}
      </Form>
      <section className="home--posts">
        {postsList.length > 0 ? postsList : noPostsFound}
      </section>
      <Link to="/posts/create" className="home--create--post">
        + <span className="create--post_text">Create Post</span>
      </Link>
    </main>
  );
};

export default Home;
