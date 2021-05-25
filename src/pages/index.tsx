import React, { useState } from 'react';
import Head from 'next/head';
import { GetStaticProps } from 'next';
import Prismic from '@prismicio/client';
import { ptBR } from 'date-fns/locale';
import { format, parseISO } from 'date-fns';

import { Document } from '@prismicio/client/types/documents';

import { FiCalendar, FiUser } from 'react-icons/fi';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

function getFormattedPost(post: Document): Post {
  const formattedPost = {
    uid: post.uid,
    first_publication_date: format(
      parseISO(post.first_publication_date),
      'dd MMM yyyy',
      {
        locale: ptBR,
      }
    ),
    data: {
      title: post.data.title,
      subtitle: post.data.subtitle,
      author: post.data.author,
    },
  };
  return formattedPost;
}

export default function Home({
  postsPagination: { results, next_page },
}: HomeProps): React.ReactElement {
  const [posts, setPosts] = useState(results);
  const [nextPage, setNextPage] = useState(next_page);

  function handleGetMorePosts(): void {
    fetch(nextPage)
      .then(response => response.json())
      .then(data => {
        setNextPage(data.next_page);
        const formattedNewPosts = data.results.map(post => {
          return getFormattedPost(post);
        });
        setPosts([...posts, ...formattedNewPosts]);
      });
  }

  return (
    <>
      <Head>Home | spacetravelling</Head>

      <main className={commonStyles.container}>
        <div className={styles.posts}>
          {posts.map(post => (
            <a key={post.uid} href="#">
              <strong>{post.data.title}</strong>
              <p>{post.data.subtitle}</p>
              <div>
                <time>
                  <FiCalendar />
                  {post.first_publication_date}
                </time>
                <span>
                  <FiUser />
                  {post.data.author}
                </span>
              </div>
            </a>
          ))}

          {nextPage && (
            <button type="button" onClick={() => handleGetMorePosts()}>
              Carregar mais posts
            </button>
          )}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'post')],
    {
      fetch: ['post.title', 'post.subtitle', 'post.author'],
      pageSize: 1,
    }
  );

  const { next_page } = postsResponse;

  const results = postsResponse.results.map(post => {
    return getFormattedPost(post);
  });

  const postsPagination = { next_page, results };

  return {
    props: { postsPagination },
  };
};
