import { blogFilePaths } from '@/utils/mdxUtils'
import { getStaticFilePaths } from '@/utils/common/getStaticFilePaths'

export async function getStaticPaths() {
	return getStaticFilePaths(blogFilePaths)
}