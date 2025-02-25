import {Slide} from '@mui/material';
import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';

const AiMain = ({containerRef}) => {
  console.log('inside ai main');
  const {isOpen} = useSelector((state) => state.leftDrawer);

  // Log containerRef updates for debugging
  useEffect(() => {
    console.log('containerRef in AiMain: ', containerRef?.current);
  }, [containerRef]);

  // Safeguard against null containerRef
  const slideContainer = containerRef?.current || document.body;

  return (
    <Slide
      in={isOpen}
      direction="right"
      timeout={300}
      easing="ease"
      // container={containerRef.current}

      container={slideContainer} // Fallback to `document.body` if `containerRef` is null
    >
      <div className="bg-gray-200 ">
        <p className="text-xl text-gray-600 p-5">
          This feature will be coming soon...
        </p>
      </div>
    </Slide>
  );
};

export default AiMain;
