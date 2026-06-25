import { Router } from 'express';
import { getAssignments, createAssignment } from '../controllers/assignmentController';
import { requireAuth } from '../middleware/authMiddleware';
import multer from 'multer';
import path from 'path';

const router = Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.use(requireAuth);

router.get('/', getAssignments);
// Use multer middleware for file upload
router.post('/', upload.single('file'), createAssignment);

export default router;
