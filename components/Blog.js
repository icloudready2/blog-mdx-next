import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { MDXProvider } from '@mdx-js/react'
import MDX from '@mdx-js/runtime'
import { renderToStaticMarkup } from 'react-dom/server'

import { BLOG_PATH, blogFilePaths } from '@/utils/mdxUtils'
import { Image } from '@/components/Image'

const MDXComponents = { Image }

const Blog = ({ source, frontMatter }) => {
	return (
		<div>
			<h1>{frontMatter.title}</h1>
			<MDXProvider components={MDXComponents}>
				<div
					dangerouslySetInnerHTML={{
						__html: source,
					}}
				/>
			</MDXProvider>
		</div>
	)
}

export async function getStaticPaths() {
	const paths = blogFilePaths.map((path) => {
		const split = path.split('/')
		const slug = split[split.length - 2]
		return {
			params: {
				slug,
			},
		}
	})

	return {
		paths,
		fallback: false,
	}
}

export const getStaticProps = async ({ params }) => {
	const { slug } = params
	const blogFilePath = path.join(BLOG_PATH, `/blog/${slug}/index.mdx`)

	const source = fs.readFileSync(blogFilePath)
	const { content, data } = matter(source)
	const mdx = renderToStaticMarkup(<MDX>{content}</MDX>)

	if (!blogFilePath) {
		console.warn('No MDX file found for slug')
	}

	return {
		props: {
			source: mdx,
			frontMatter: data,
		},
	}
}

export default Blog
