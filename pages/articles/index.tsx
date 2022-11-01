import { useEffect } from 'react'
import { fetchArticles } from '^lib/firebase/firestore'

const ArticlesPage = () => {
  useEffect(() => {
    fetchArticles()
  }, [])
  return <div>Articles Page</div>
}

export default ArticlesPage
