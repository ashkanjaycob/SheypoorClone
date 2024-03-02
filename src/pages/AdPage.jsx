import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getmyAds } from '../Services/user';

const AdPage = () => {
  const { data, isLoading } = useQuery(["get-my-ads"], getmyAds);
  const { id } = useParams(); // Access the ad ID from URL parameters

  return (
    <div>
      <h2>Ad Details</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {data.posts.find(ad => ad._id === id) ? ( // Check if the fetched ad ID matches the URL parameter
            <div>
              <h3>{data.posts.find(ad => ad._id === id).options.title}</h3>
              {/* Display other ad details */}
            </div>
          ) : (
            <p>Ad not found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdPage;
