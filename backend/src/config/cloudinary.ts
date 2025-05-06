import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// for image upload
const storage =
    // If cloudinary credentials are not set, use local storage
    (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET)
    ? multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/images');
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + '-' + file.originalname);
        }
    })

    : new CloudinaryStorage({
        cloudinary,
        params: async (req, file) => ({
            folder: 'item_images',
            allowed_formats: ['jpg', 'png', 'jpeg'],
            public_id: `${Date.now()}-${file.originalname}`
        }),
    })

export { storage };