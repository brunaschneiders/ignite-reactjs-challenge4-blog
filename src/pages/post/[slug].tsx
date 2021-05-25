import Head from 'next/head';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';

import { GetStaticPaths, GetStaticProps } from 'next';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post() {
  return (
    <>
      <Head>Post | Criando um app CRA do zero</Head>

      <main className={commonStyles.container}>
        <article className={styles.post}>
          <h1>Criando um app CRA do zero</h1>
          <div>
            <time>
              <FiCalendar />
              15 Mar 2021
            </time>
            <span>
              <FiUser />
              Joseph Oliveira
            </span>
            <span>
              <FiClock /> 4 min
            </span>
          </div>
          <div className={styles.postContent} />
        </article>
      </main>
    </>
  );
}

// export const getStaticPaths = async () => {
//   const prismic = getPrismicClient();
//   const posts = await prismic.query(TODO);

//   // TODO
// };

// export const getStaticProps = async context => {
//   const prismic = getPrismicClient();
//   const response = await prismic.getByUID(TODO);

//   // TODO
// };
