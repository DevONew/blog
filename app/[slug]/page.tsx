import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import type { Metadata } from 'next';
import Link from 'next/link';

const postsDirectory = path.join(process.cwd(), 'posts');

export async function generateStaticParams() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => ({
    slug: fileName.replace(/\.mdx$/, ''),
  }));
}

async function getPost({ slug }: { slug: string }) {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    title: data.title,
    date: data.date,
    content,
    excerpt: content.substring(0, 150),
  };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost({ slug });

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost({ slug });

  return (
    <main>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <nav className="mb-8">
          <Link
            href="/"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Back to Home
          </Link>
        </nav>
        <article className="prose dark:prose-invert prose-lg max-w-none">
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg">{post.date}</p>
          </header>
          <div className="prose-content">
            <MDXRemote
              source={post.content}
              options={{
                parseFrontmatter: true,
              }}
            />
          </div>
        </article>
      </div>
    </main>
  );
}