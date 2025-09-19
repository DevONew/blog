import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import type { Metadata } from 'next';

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
    excerpt: content.substring(0, 150), // Simple excerpt
  };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost({ slug });
  const url = `https://my-blog.com/blog/${slug}`;

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: url,
      type: 'article',
      publishedTime: post.date,
      // Add a default image if you have one
      // images: [
      //   {
      //     url: 'https://my-blog.com/og-image.png',
      //     width: 1200,
      //     height: 630,
      //     alt: post.title,
      //   },
      // ],
    },
  };
}

import MdxImage from '@/components/mdx-image';

// ... (imports remain the same)

// ... (generateStaticParams and getPost remain the same)

// ... (generateMetadata remains the same)

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost({ slug });
  const url = `https://my-blog.com/blog/${slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.date,
    dateModified: post.date,
    description: post.excerpt,
    url: url,
    author: {
      '@type': 'Person',
      name: 'Your Name', // Change this
    },
    // Add image details if available
  };

  const components = {
    img: MdxImage,
  };

  return (
    <article className="prose dark:prose-invert">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
      <p className="text-gray-500 mb-8">{post.date}</p>
      <MDXRemote source={post.content} components={components} />
    </article>
  );
}
