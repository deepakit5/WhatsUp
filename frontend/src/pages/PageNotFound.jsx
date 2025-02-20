import {Button, Typography, Container} from '@mui/material';
import {Link} from 'react-router-dom';

const PageNotFound = () => {
  return (
    <div
      maxWidth="md"
      className="flex flex-col items-center justify-center h-screen text-center">
      <h2 className="text-blue-500 text-5xl">Error: 404 ! </h2>
      <h5 className="text-gray-600 mt-9 mb-6">
        Oops! The page you're looking for doesn't exist.
      </h5>

      <Button
        component={Link}
        to="/"
        variant="contained"
        color="primary"
        className="mt-9">
        Go to Home
      </Button>
    </div>
  );
};

export default PageNotFound;
