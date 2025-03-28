// Placeholder images for profile pictures
const defaultProfilePic1 = "https://scontent.fktm7-1.fna.fbcdn.net/v/t39.30808-1/330281752_620459683426393_4928535324287345477_n.jpg?stp=c0.41.700.700a_dst-jpg_s200x200_tt6&_nc_cat=108&ccb=1-7&_nc_sid=e99d92&_nc_ohc=8NkKuCSU7HUQ7kNvgFco3NP&_nc_oc=AdkpAEDdHurupwBUTo9zGdD03NECfTCxXSvVM89c7LbGWOVwVrBpiBKSue533b2gYh0&_nc_zt=24&_nc_ht=scontent.fktm7-1.fna&_nc_gid=KAaAVweVD6cmXsjDLsvKgA&oh=00_AYHYSc1mbVxqjf0Dt8nwzUtG-XQUuV78dJ4-b705tisJlw&oe=67E2BD93";
const defaultProfilePic2 = "https://scontent.fktm8-1.fna.fbcdn.net/v/t39.30808-1/310097624_1170105163929877_6328810851952751452_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=102&ccb=1-7&_nc_sid=e99d92&_nc_ohc=Ky95KzpNvCQQ7kNvgHj_p9T&_nc_oc=AdkIDjaRRSt0R6dnwQPQ8kxBkLlJlrNx8l6GHYNPpOQwipKPUZpk3Qs18-vdluCheTOa1lnKuUbxQq2KR7hFh_v3&_nc_zt=24&_nc_ht=scontent.fktm8-1.fna&_nc_gid=7bS0MVexI8Kp3sxhYH-63g&oh=00_AYFjSJ010FuWwM2Wyk_imL3rVkmBhPpSqq5yo4rJq0X0Pw&oe=67E308D8";
const defaultProfilePic3 = "https://scontent.fktm8-1.fna.fbcdn.net/v/t39.30808-1/448510628_1134041854490274_7187517641010102699_n.jpg?stp=c9.34.539.540a_dst-jpg_s200x200_tt6&_nc_cat=109&ccb=1-7&_nc_sid=e99d92&_nc_ohc=4oNg9gqyuOYQ7kNvgGlJAv3&_nc_oc=AdnZMflCSH9yPDWsdQd2LxZqefz6PUtiD4t2Gg0UwDKmRwgfhi96L6mMsV4KiZQ1BEyAags5vV5b8x3a7Axtg_CK&_nc_zt=24&_nc_ht=scontent.fktm8-1.fna&_nc_gid=GCdLzUTxHXa39fNn07fsyg&oh=00_AYETGKhOuH9Z4vd4hkoNYIt6l-TguUcJxshbwAPP3LAyiQ&oe=67E2E839";

const RightSidebar = () => {
  
  const followSuggestions = [
    { name: "Sanjeev Darlagne Magar", title: "Billionaire", profilePic: defaultProfilePic1 },
    { name: "Sonu Topper", title: "Genius", profilePic: defaultProfilePic2 },
    { name: "Suvarna Shrestha", title: "The GOAT", profilePic: defaultProfilePic3 },
    { name: "Sausage Bajracharya", title: "Negative", profilePic: defaultProfilePic1 },
    { name: "Judy Nguyen", title: "News anchor", profilePic: defaultProfilePic1 },
  ];

  const newsItems = [
    { title: "Ten questions you should answer truthfully", time: "2hr" },
    { title: "Five unbelievable facts about money", time: "3hr" },
    { title: "Best Pinterest Boards for learning about business", time: "4hr" },
    { title: "Skills that you can learn from business", time: "6hr" },
    { title: "Top 10 productivity tips for developers", time: "8hr" },
    { title: "How to stay motivated in 2025", time: "10hr" },
  ];
  const handleFollow = (name) => {
    console.log(`Followed ${name}`);
  };

  return (
    <div className="right-sidebar">
      <h6>Who to follow</h6>
      {followSuggestions.map((suggestion, index) => (
        <div key={index} className="follow-suggestion">
          <img src={suggestion.profilePic} alt="Profile" className="profile-pic" />
          <div>
            <strong>{suggestion.name}</strong><br />
            <small className="text-muted">{suggestion.title}</small>
          </div>
          <button
            className="btn btn-custom-outline btn-sm"
            onClick={() => handleFollow(suggestion.name)}
          >
            <i className="fas fa-plus"></i>
          </button>
        </div>
      ))}
      <button className="btn btn-custom-outline w-100 mb-3">View more</button>

      <h6>Today’s news</h6>
      {newsItems.map((news, index) => (
        <div key={index} className="news-item">
          <a href="/">{news.title}</a><br />
          <small className="text-muted">{news.time}</small>
        </div>
      ))}
    </div>
  );
}

export default RightSidebar;