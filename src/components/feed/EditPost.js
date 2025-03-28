import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPosts, updatePost } from '../../utils/post.utils';
import defaultProfilePic from '../../assets/img/defaultProfile.jpg';

const EditPost = () => {
  const { id } = useParams(); // Get post ID from URL
  const navigate = useNavigate();
  const [thoughts, setThoughts] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const posts = await getPosts();
        const post = posts.find((p) => p.id === parseInt(id));
        if (post) {
          setThoughts(post.content);
          if (post.image) {
            setPhotoPreview(post.image); // Base64 string from db.json
          }
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching post:", error);
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageBase64 = photoPreview;
      if (photoFile) {
        imageBase64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(photoFile);
        });
      }

      const updatedPost = {
        content: thoughts,
        image: imageBase64 || "",
      };

      await updatePost(id, updatedPost);
      navigate('/'); // Redirect back to feed
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header">
          <h5>Edit Post</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="d-flex align-items-center mb-3">
              <img
                src={defaultProfilePic}
                alt="Profile"
                className="profile-pic me-2"
                style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '50%' }}
              />
              <textarea
                className="form-control"
                placeholder="Share your thoughts..."
                rows="3"
                value={thoughts}
                onChange={(e) => setThoughts(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="editPhotoUpload" className="form-label">Update Photo</label>
              <input
                type="file"
                id="editPhotoUpload"
                accept="image/*"
                className="form-control"
                onChange={handlePhotoUpload}
              />
              {photoPreview && (
                <img src={photoPreview} alt="Preview" className="mt-2" style={{ maxWidth: '100%' }} />
              )}
            </div>
            <div className="d-flex justify-content-end">
              <button type="button" className="btn btn-secondary me-2" onClick={() => navigate('/')}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPost;