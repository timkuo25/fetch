'use client'

import { useCallback, useEffect, useRef, useState } from "react";
import Post from "@/component/post";
import '@/css/post.css';
import '@/css/post_pc.css';


const Home = () => {
  const [category, setCategory] = useState('');
  const [posts, setPosts] = useState([]);

  // For infinite scroll
  const observer = useRef(null);
  const triggerRef = useRef(null);

  const getPosts = async (category, offset) => {
    try {
      const response = await fetch(`/api/posts?cat=${category}&offset=${offset}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const appendPost = async () => {
    const { data } = await getPosts(category, posts.length);
    if (!data) {
      alert('Failed to get posts');
      setCategory('');
      return;
    }

    setPosts(prev => prev.concat(data));
  };

  const handleSwitchCat = async () => {
    const { data } = await getPosts(category, posts.length);
    if (!data) {
      alert('Failed to get posts');
      setCategory('');
      return;
    }
    setPosts(data);
  };

  const handleIntersect = useCallback(entries => {
    const entry = entries[0];
    if (
      category !== '' &&
      entry.isIntersecting &&
      posts.length !== 0 // Prevent from repeated getPost
    ) {
      appendPost();
    }
  }, [appendPost]);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(
      handleIntersect,
      {
        threshold: 1.0,
      }
    );

    if (triggerRef.current) {
      observer.current.observe(triggerRef.current);
    }

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [handleIntersect]);
  
  useEffect(() => {
    if (category !== ''){
      handleSwitchCat();
    }
  }, [category]);


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
          posts.map((item, idx) => {
            return (
              <Post
                key={idx}
                author={item.author}
                category={item.category}
                description={item.description}
                image={item.image}
                published_at={item.published_at}
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