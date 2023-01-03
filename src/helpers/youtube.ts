export const getYoutubeEmbedUrlFromId = (id: string) => {
  const embedUrl = `https://www.youtube.com/embed/${id}`

  return embedUrl
}

export const getYoutubeThumbnailFromId = (id: string): string =>
  `https://img.youtube.com/vi/${id}/0.jpg`
