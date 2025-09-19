import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'posts');

function getPosts() {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPosts = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.mdx$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);

    return {
      slug,
      title: data.title,
      date: data.date,
    };
  });

  return allPosts.sort((a, b) => {
    if (new Date(a.date) < new Date(b.date)) {
      return 1;
    } else {
      return -1;
    }
  });
}

export default function Home() {
  const posts = getPosts();

  return (
    <main>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Latest Posts</h1>
        <div className="space-y-6">
          {posts.map((post) => (
            <article key={post.slug} className="border-b border-gray-200 dark:border-gray-800 pb-6">
              <h2 className="text-2xl font-bold mb-2">
                <Link
                  href={`/${post.slug}`}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {post.title}
                </Link>
              </h2>
              <p className="text-gray-500 dark:text-gray-400">{post.date}</p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
