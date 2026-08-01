import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

export async function getPublishedPosts(): Promise<Post[]> {
  const now = new Date();
  const posts = await getCollection('posts', ({ data }) => {
    if (!import.meta.env.PROD) return true;
    return !data.draft && data.pubDate <= now;
  });

  return posts.sort(
    (left, right) => right.data.pubDate.valueOf() - left.data.pubDate.valueOf(),
  );
}

export function postHref(post: Post): string {
  return `${import.meta.env.BASE_URL}posts/${post.id}/`;
}
