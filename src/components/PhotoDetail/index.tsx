import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Typography,
  Avatar,
  Link,
} from "@mui/material";

interface UnsplashPhotoDetail {
  id: string;
  urls: { full: string };
  user: {
    name: string;
    portfolio_url: string;
    profile_image: { small: string };
  };
  alt_description: string | null;
  description: string | null;
  likes: number;
  color: string;
}

const PhotoDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [photo, setPhoto] = useState<UnsplashPhotoDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPhotoDetail = async () => {
      setLoading(true);
      try {
        const response = await axios.get<UnsplashPhotoDetail>(
          `https://api.unsplash.com/photos/${id}`,
          {
            params: {
              client_id: "qW2c6cT4MZUMpE4E4CGWL9vEp8i8F-CTIoaeZ4qbBAM",
            },
          }
        );
        setPhoto(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchPhotoDetail();
  }, [id]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography color="error" variant="h6" marginLeft={1}>
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    photo && (
      <Card sx={{ maxWidth: 800, mx: "auto", mt: 5, boxShadow: 3 }}>
        <CardMedia
          component="img"
          image={photo.urls.full}
          alt={photo.alt_description || "Photo"}
        />
        <CardContent sx={{ padding: 4 }}>
          <Typography variant="h5" gutterBottom>
            {photo.alt_description || "Untitled"}
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            {photo.description || "No description provided"}
          </Typography>
          <Box display="flex" alignItems="center" mt={2}>
            <Avatar
              src={photo.user.profile_image.small}
              alt={photo.user.name}
            />
            <Box ml={2}>
              <Typography variant="subtitle1">
                <Link
                  href={photo.user.portfolio_url}
                  target="_blank"
                  rel="noopener"
                  underline="hover"
                >
                  {photo.user.name}
                </Link>
              </Typography>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" mt={3}>
            <Typography variant="body1" color="textSecondary">
              {photo.likes} Likes
            </Typography>
          </Box>
        </CardContent>
      </Card>
    )
  );
};

export default PhotoDetail;
