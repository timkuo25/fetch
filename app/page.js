'use client'

import { useCallback, useEffect, useRef, useState } from "react";
import Post from "@/component/post";
import '@/css/post.css';
import '@/css/post_pc.css';

const API_KEY = process.env.NEXT_PUBLIC_ACCESS_KEY;

const Home = () => {
  const [category, setCategory] = useState('');
  const [posts, setPosts] = useState({
    general: { data: [], offset: 0 },
    entertainment: { data: [], offset: 0 },
    science: { data: [], offset: 0 },
    technology: { data: [], offset: 0 },
  });
  const observer = useRef(null);
  const triggerRef = useRef(null);

  const LIMIT = 10;

  const getPosts = async (cat) => {
    const { offset } = posts[cat];

    const res = await fetch(
      `https://api.mediastack.com/v1/news?limit=${LIMIT}&offset=${offset}&access_key=${API_KEY}&categories=${cat}`
    );
    const returnedPosts = await res.json();

    return returnedPosts;
  }

  const appendPost = async () => {
    const { data } = await getPosts(category);
    setPosts(prev => ({
      ...prev,
      [category]: {
        data: prev[category].data.concat(data),
        offset: prev[category].offset + LIMIT,
      }
    }));
  }
  
  useEffect(() => {
    if (category !== '' && posts[category].data.length === 0){
      appendPost();
    }
  }, [category])

  // const handleScroll = useCallback(() => {
  //   const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  //   if (scrollTop + clientHeight >= scrollHeight) {
  //     appendPost();
  //   }
  // })


  // useEffect(() => {
  //   window.addEventListener('scroll', handleScroll);
  //   return () => window.removeEventListener('scroll', handleScroll);
  // }, [handleScroll]);


  const handleIntersect = useCallback(entries => {
    const entry = entries[0];
    if (
      category !== '' &&
      entry.isIntersecting &&
      posts[category].data.length !== 0 // Prevent from repeated getPost
    ) {
      appendPost();
    }
  }, [appendPost])

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(handleIntersect, {
      threshold: 1.0,
    });

    if (triggerRef.current) {
      observer.current.observe(triggerRef.current);
    }

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [handleIntersect]);


  return (
    <div className='outer'>
      <h2 className='title'>News</h2>
      <select className='select-cat' value={category} onChange={e => setCategory(e.target.value)}>
        <option value=''>select a category</option>
        <option value='general'>general</option>
        <option value='science'>science</option>
        <option value='entertainment'>entertainment</option>
        <option value='technology'>technology</option>
      </select>
      {
        category
        ?
        <>
        {
          posts[category].data.map((item, idx) => {
            return (
              <Post
                key={idx}
                author={item.author}
                category={item.category}
                description={item.description}
                image={item.image}
                published_at={item.published_at}
                source={item.source}
                title={item.title}
                url={item.url}
              />
            )})
        }
        </>
        : null
      }
      <div ref={triggerRef} style={{ height: 1 }} />
    </div>
  )
}

export default Home;