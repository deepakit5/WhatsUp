import express from 'express';
import {
  uploadStatus,
  //   addReply,
  //   getStatusSeenList,
  getMyStatuses,
  getAllStatus,
} from '../controllers/status.controller.js';
import {upload} from '../middlewares/multer.middleware.js';
import {verifyJWT} from '../middlewares/auth.middleware.js';

const router = express.Router();

router
  .route('/upload')
  .post(verifyJWT, upload.array('media', 15), uploadStatus); // Allow up to 15 files

// router.route('/reply').post(verifyJWT, replyToStatus);

// router.route('/seen/:statusId').get(verifyJWT, getStatusSeenList);

// router.route('/getAll').get(verifyJWT, getAllStatus);
// ----x-------------x-----------

router.route('/myStatuses').get(verifyJWT, getMyStatuses);
router.route('/getAllStatus').get(verifyJWT, getAllStatus);
// router.post('/view', protect, markStatusAsViewed);
// router.post('/reply', protect, replyToStatus);
export default router;
