const Post = ({ username, role, time, content, image, likes, comments, shares }) => {
    return (
      <div className="card post-card mb-3">
        <div className="card-body">
          <div className="d-flex align-items-center mb-2">
            <img
              src="https://scontent.fktm7-1.fna.fbcdn.net/v/t39.30808-1/330281752_620459683426393_4928535324287345477_n.jpg?stp=c0.41.700.700a_dst-jpg_s200x200_tt6&_nc_cat=108&ccb=1-7&_nc_sid=e99d92&_nc_ohc=8NkKuCSU7HUQ7kNvgFco3NP&_nc_oc=AdkpAEDdHurupwBUTo9zGdD03NECfTCxXSvVM89c7LbGWOVwVrBpiBKSue533b2gYh0&_nc_zt=24&_nc_ht=scontent.fktm7-1.fna&_nc_gid=KAaAVweVD6cmXsjDLsvKgA&oh=00_AYHYSc1mbVxqjf0Dt8nwzUtG-XQUuV78dJ4-b705tisJlw&oe=67E2BD93"
              alt="Profile"
              className="profile-pic me-2"
            />
            <div>
              <strong>{username}</strong><br />
              <small className="text-muted">{role} • {time}</small>
            </div>
          </div>
          <p>{content}</p>
          {image && <img src={image} alt="Post Img" className="post-image" style={{ maxWidth: '100%' }} />}
          <div className="d-flex justify-content-between mt-2">
            <span>
              <i className="fas fa-thumbs-up"></i> Liked ({likes})
            </span>
            <span>
              <i className="fas fa-comment"></i> Comments ({comments})
            </span>
            <span>
              <i className="fas fa-share"></i> Share ({shares})
            </span>
          </div>
        </div>
      </div>
    );
  };
  
  export default Post;