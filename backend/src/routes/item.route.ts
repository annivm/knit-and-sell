import { Router } from "express";
import { createItem, deleteItem, getItemById, getItems, getMyItems, updateItem } from "../controllers/item.controller";
import { verifyToken } from "../middleware/verifyToken";
import multer from 'multer';


const router: Router = Router();

// for image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/images');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
})
const upload = multer({ storage })


// http://localhost:5000/api/items/
router.get('/', getItems);


router.get('/myitems', getMyItems);

router.get('/:id', getItemById)

//router.post('/', createItem)
router.post('/', upload.single('image'), verifyToken, createItem)

router.delete('/:id', verifyToken, deleteItem)

router.put('/', upload.single('image'), verifyToken, updateItem)

export default router;