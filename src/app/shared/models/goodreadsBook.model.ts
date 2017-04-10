export interface GRSearchBook {
  id: string,
  title: string,
  author: string,
  imageUrl: string,
}

interface GRSearchAuthor {
  id: string,
  name: string
}

export interface GRBook {
  id: string;
  title: string;
  isbn: string;
  isbn13: string;
  asin: string;
  countryCode: string;
  imageUrl: string;
  smallImageUrl: string;
  publicationYear: string;
  publicationMonth: string;
  publicationDay: string;
  publisher: string;
  languageCode: string;
  isEbook: string;
  description: string;
  averageRating: string;
  pages: string;
  originUrl: string;
  authors: GRAuthor[];
  series: GRSerie;
  similarBooks: GRSimilarBook[];
}

export interface GRAuthor {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  smallImageUrl: string;
  originUrl: string;
}

export interface GRSerie {
  id: string;
  title: string;
  count: string;
}

export interface GRSimilarBook {
  id: string;
  title: string;
  imageUrl: string;
  smallImageUrl: string;
  publicationYear: string;
  publicationMonth: string;
  publicationDay: string;
  pages: string;
  originUrl: string;
  authors: GRSimilarBookAuthor[];
}

export interface GRSimilarBookAuthor {
  id: string;
  name: string;
  originUrl: string;
}






