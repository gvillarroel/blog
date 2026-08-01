import rss from '@astrojs/rss';
import { getPublishedPosts } from '../lib/posts';

export async function GET(context) {
  const posts = (await getPublishedPosts()).filter((post) => !post.data.draft);
  return rss({
    title: 'Guillermo Villarroel — Technical Notes',
    description: 'Evidence-grounded notes on software engineering and data science.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.summary,
      pubDate: post.data.pubDate,
      link: `posts/${post.id}/`,
      categories: post.data.tags,
    })),
  });
}
