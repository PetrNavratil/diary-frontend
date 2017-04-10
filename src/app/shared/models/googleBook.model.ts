export interface GoogleBook {
  selfLink: string,
  id: string,
  volumeInfo: BookInfo
}

interface BookInfo {
  authors?: Author[],
  isbn?: ISBN[],
  language: string,
  pageCount: number,
  previewLink: string,
  publishDate: string,
  title: string,
  imageLinks: Thumbnail
}

interface Thumbnail {
  smallThumbnail: string,
  thumbnail: string
}


interface Author {
  name: string
}

interface ISBN {
  identifier: string,
  type: string,
}


export function createBook(input: any): GoogleBook {
  return {
    selfLink: input.selfLink,
    id: input.id,
    volumeInfo: mapBook(input.volumeInfo)
  };
}

function mapBook(input: any): BookInfo {
  return {
    authors: input.authors,
    isbn: input.industryIdentifiers,
    language: input.language,
    pageCount: input.pageCount,
    previewLink: input.previewLink,
    publishDate: input.publishDate,
    title: input.title,
    imageLinks: input.imageLinks ? input.imageLinks : undefined
  }
}