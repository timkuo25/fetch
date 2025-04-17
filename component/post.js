const parsedTS = (ts) => {
  const date = new Date(ts);

  const pad = (n) => n.toString().padStart(2, '0');

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hour = pad(date.getHours());
  const minute = pad(date.getMinutes());
  const second = pad(date.getSeconds());

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

const Post = ({ author, category, description, image, published_at, title, url }) => {
  return (
    <div className='post'>
      <div className='image-holder'>
        <img src={image || '/empty.png'} />
      </div>
      <div className='content'>
        <div className='category'>{category}</div>
        <div>
          <span>{parsedTS(published_at)} | </span>
          <span>Author: {author}</span>
        </div>
        <h2>{title}</h2>
        <div>{description}</div>
        <a href={url}> Read More </a>
      </div>
    </div>
  )

};


export default Post;