import { useState } from 'react';

const AddPost = ({ onPostSubmit }) => {
  const [thoughts, setThoughts] = useState('');
  const [photo, setPhoto] = useState(null);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(URL.createObjectURL(file)); // Create a URL for the uploaded photo
    }
  };

  const handleSubmit = () => {
    if (!thoughts && !photo) return; // Don't submit empty posts

    const newPost = {
      username: "Sam Lanson", // Hardcoded for now; ideally, get from UserContext
      role: "Web Developer at Stackbros",
      time: "Just now",
      content: thoughts,
      image: photo,
      likes: 0,
      comments: 0,
      shares: 0,
    };

    onPostSubmit(newPost); // Pass the new post to the parent (Feed)

    // Reset the form
    setThoughts('');
    setPhoto(null);

    // Close the modal
    const modal = window.bootstrap.Modal.getInstance(document.querySelector('#shareThoughtsModal'));
    modal.hide();
  };

  return (
    <div className="share-thoughts-card"> {/* Reverted to match HTML */}
      <div className="d-flex align-items-center mb-2">
        <img
          src="https://scontent.fktm7-1.fna.fbcdn.net/v/t39.30808-1/330281752_620459683426393_4928535324287345477_n.jpg?stp=c0.41.700.700a_dst-jpg_s200x200_tt6&_nc_cat=108&ccb=1-7&_nc_sid=e99d92&_nc_ohc=8NkKuCSU7HUQ7kNvgFco3NP&_nc_oc=AdkpAEDdHurupwBUTo9zGdD03NECfTCxXSvVM89c7LbGWOVwVrBpiBKSue533b2gYh0&_nc_zt=24&_nc_ht=scontent.fktm7-1.fna&_nc_gid=KAaAVweVD6cmXsjDLsvKgA&oh=00_AYHYSc1mbVxqjf0Dt8nwzUtG-XQUuV78dJ4-b705tisJlw&oe=67E2BD93"
          alt="Profile"
          className="profile-pic me-2"
        />
        <input
          type="text"
          className="form-control rounded-pill"
          placeholder="Share your thoughts..." // Reverted to match HTML
          readOnly
          data-bs-toggle="modal"
          data-bs-target="#shareThoughtsModal" // Reverted to match HTML
        />
      </div>
      <div className="d-flex justify-content-between mt-2">
        <button
          className="btn btn-sm text-white"
          style={{ backgroundColor: '#28a745' }}
          data-bs-toggle="modal"
          data-bs-target="#shareThoughtsModal" // Reverted to match HTML
        >
          <i className="fas fa-camera me-1"></i> Photo
        </button>
        <button className="btn btn-sm text-white" style={{ backgroundColor: '#007bff' }}>
          <i className="fas fa-video me-1"></i> Video
        </button>
        <button className="btn btn-sm text-white" style={{ backgroundColor: '#dc3545' }}>
          <i className="fas fa-calendar-alt me-1"></i> Event
        </button>
        <button className="btn btn-sm text-white" style={{ backgroundColor: '#ffc107' }}>
          <i className="fas fa-smile me-1"></i> Feeling/Activity
        </button>
      </div>

      {/* Share Thoughts Modal */}
      <div className="modal fade" id="shareThoughtsModal" tabIndex="-1" aria-labelledby="shareThoughtsModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="shareThoughtsModalLabel">Add post photo</h5> {/* Reverted to match HTML */}
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form id="shareThoughtsForm"> {/* Reverted to match HTML */}
                <div className="d-flex align-items-center mb-3">
                  <img
                    src="https://scontent.fktm7-1.fna.fbcdn.net/v/t39.30808-1/330281752_620459683426393_4928535324287345477_n.jpg?stp=c0.41.700.700a_dst-jpg_s200x200_tt6&_nc_cat=108&ccb=1-7&_nc_sid=e99d92&_nc_ohc=8NkKuCSU7HUQ7kNvgFco3NP&_nc_oc=AdkpAEDdHurupwBUTo9zGdD03NECfTCxXSvVM89c7LbGWOVwVrBpiBKSue533b2gYh0&_nc_zt=24&_nc_ht=scontent.fktm7-1.fna&_nc_gid=KAaAVweVD6cmXsjDLsvKgA&oh=00_AYHYSc1mbVxqjf0Dt8nwzUtG-XQUuV78dJ4-b705tisJlw&oe=67E2BD93"
                    alt="Profile"
                    className="profile-pic me-2"
                  />
                  <textarea
                    className="form-control"
                    placeholder="Share your thoughts..." // Reverted to match HTML
                    rows="2"
                    style={{ resize: 'none' }}
                    value={thoughts}
                    onChange={(e) => setThoughts(e.target.value)}
                  />
                </div>
                <div className="upload-area mb-3">
                  <div className="drag-drop-area text-center p-4">
                    <i className="fas fa-images fa-2x mb-2"></i>
                    <p>Drag here or click to upload photo.</p>
                    <input
                      type="file"
                      id="photoUpload"
                      accept="image/*"
                      hidden
                      onChange={handlePhotoUpload}
                    />
                    {photo && <img src={photo} alt="Uploaded" style={{ maxWidth: '100%', marginTop: '10px' }} />}
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-danger" data-bs-dismiss="modal">
                Cancel
              </button>
              <button type="button" className="btn btn-primary" id="postButton" onClick={handleSubmit}>
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPost;