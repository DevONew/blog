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

export default function BlogPage() {
  const posts = getPosts();

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.slug}>
            <h2 className="text-2xl font-bold">
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </h2>
            <p className="text-gray-500">{post.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
