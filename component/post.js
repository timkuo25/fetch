
const Post = ({ author, category, description, image, published_at, source, title, url }) => {
  return (
    <div className='post'>
      <div className='image-holder'>
        <img src={image || '/empty.png'} />
      </div>
      <div className='content'>
        <div className='category'>{category}</div>
        <div>
          <span>{published_at} | </span>
          <span>{author}</span>
        </div>
        <h2>{title}</h2>
        <div>{description}</div>
        <a href={url}> Read More </a>
      </div>
    </div>
  )

};


export default Post;