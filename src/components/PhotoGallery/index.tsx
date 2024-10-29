import "./styles.css";
import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import axios from "axios";

interface UnsplashPhoto {
  id: string;
  urls: {
    thumb: string;
  };
  user: {
    name: string;
  };
}

const PhotoGallery: React.FC = () => {
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      if (!hasMore || loading) return; // Prevents multiple fetches

      setLoading(true);
      try {
        const response = await axios.get<UnsplashPhoto[]>(
          "https://api.unsplash.com/photos",
          {
            params: {
              client_id: "qW2c6cT4MZUMpE4E4CGWL9vEp8i8F-CTIoaeZ4qbBAM",
              page,
              per_page: 20,
            },
          }
        );
        setPhotos((prev) => [...prev, ...response.data]);
        setHasMore(response.data.length > 0); // Stops if no more photos
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [page]);

  useEffect(() => {
    const loadMorePhotos = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !loading) {
        setPage((prev) => prev + 1);
      }
    };

    observer.current = new IntersectionObserver(loadMorePhotos, {
      rootMargin: "200px", // Load before the user reaches the end
    });

    const sentinel = document.getElementById("sentinel");
    if (sentinel) observer.current.observe(sentinel);

    return () => {
      if (observer.current && sentinel) {
        observer.current.unobserve(sentinel);
      }
    };
  }, [hasMore, loading]);

  return (
    <Box className="gallery">
      <div className="image-list">
        {photos.map((photo) => (
          <div className="photo-card" key={photo.id}>
            <Link
              to={`/photos/${photo.id}`}
              style={{ textDecoration: "none" }}
              sx={{
                height: "100%",
              }}
            >
              <img
                src={photo.urls.thumb}
                alt={photo.user.name}
                loading="lazy"
                className="photo"
              />
              <Typography
                variant="caption"
                className="author"
                sx={{
                  fontWeight: "bold",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  maxWidth: 200,
                }}
              >
                Photo by: {photo.user.name}
              </Typography>
            </Link>
          </div>
        ))}
      </div>
      {loading && (
        <div className="loading">
          <CircularProgress color="primary" size={24} />
          <span>Loading more photos...</span>
        </div>
      )}
      {error && <Typography color="error">{error}</Typography>}
      <div id="sentinel" style={{ height: 1 }}></div>
    </Box>
  );
};

export default PhotoGallery;
