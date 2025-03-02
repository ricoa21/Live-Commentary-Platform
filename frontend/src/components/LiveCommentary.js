import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function LiveCommentary() {
  const { id } = useParams();
  const [commentaryData, setCommentaryData] = useState(null);

  useEffect(() => {
    // Fetch commentary data for the specific match ID
    const fetchCommentaryData = async () => {
      try {
        // Replace this with your actual API call
        const response = await fetch(`/api/live-commentary/${id}`);
        const data = await response.json();
        setCommentaryData(data);
      } catch (error) {
        console.error('Error fetching commentary data:', error);
      }
    };

    fetchCommentaryData();
  }, [id]);

  if (!commentaryData) {
    return <div>Loading commentary...</div>;
  }

  return (
    <div className="live-commentary">
      <h2>Live Commentary for Match {id}</h2>
      {/* Render your commentary data here */}
      {/* This is just a placeholder, replace with actual data rendering */}
      <ul>
        {commentaryData.comments.map((comment, index) => (
          <li key={index}>{comment}</li>
        ))}
      </ul>
    </div>
  );
}

export default LiveCommentary;
