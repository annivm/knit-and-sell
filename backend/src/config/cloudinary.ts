import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// for image upload
const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
        folder: 'item_images',
        allowed_formats: ['jpg', 'png', 'jpeg'],
        public_id: `${Date.now()}-${file.originalname}`
    }),
})

export { storage };