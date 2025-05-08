import { Request } from "express";
import { pool } from "../db/db";
import { Item, ItemCreateRequest, ItemUpdateRequest } from "../models/items.model";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { storage } from "../config/cloudinary";
import cloudinary from 'cloudinary';
import fs from 'fs';

const fetchItems = async(): Promise<Item[]> => {
    try {
        const query = `
        SELECT
            items.id,
            items.name,
            items.price,
            items.description,
            items.material,
            items.size,
            items.color,
            items.category,
            items.other,
            items.image,
            items.image_id,
            items.owner_id,
            users.name AS owner_name
        FROM items
        INNER JOIN users ON items.owner_id = users.id
        `;
        const response = await pool.query(query);

        return response.rows;
    } catch (error) {
        throw new Error('Database error')
    }
}

const fetchItemsByOwner = async (ownerId: string): Promise<Item[]> => {
    try {
        const query = `
        SELECT
            items.id,
            items.name,
            items.price,
            items.description,
            items.material,
            items.size,
            items.color,
            items.category,
            items.other,
            items.image,
            items.image_id,
            items.owner_id,
            users.name AS owner_name
        FROM items
        INNER JOIN users ON items.owner_id = users.id
        WHERE items.owner_id = $1
        `;
        const { rows } = await pool.query(query, [ownerId]);

        return rows;
    } catch (error) {
        throw new Error('Database query failed');
    }
};

const fetchItemById = async(id: number): Promise<Item | null> => {
    try {
        const query = `
        SELECT
            items.id,
            items.name,
            items.price,
            items.description,
            items.material,
            items.size,
            items.color,
            items.category,
            items.other,
            items.image,
            items.image_id,
            items.owner_id,
            users.name AS owner_name
        FROM items
        INNER JOIN users ON items.owner_id = users.id
        WHERE items.id = $1
        `;
        const response = await pool.query(query, [id])

        if(response.rows.length === 0){
            return null
        }

        return response.rows[0]
    } catch (error) {
        throw new Error("Database query failed");
    }
}

const insertItem = async(item: ItemCreateRequest): Promise<Item> => {
    try {
        const { name, price, description, material, size, color, category, other, image, image_id, owner_id } = item
        const sql = `INSERT into items
                    (name, price, description, material, size, color, category, other, image, image_id, owner_id)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *;`
        const { rows } = await pool.query(sql, [
            name,
            price,
            description,
            material || null,
            size || null,
            color || null,
            category || null,
            other || null,
            image || DEFAULT_IMAGE,
            image_id || null,
            owner_id
        ])

        return rows[0]
      } catch (error) {
        throw new Error('Database query failed')
      }
}

const findByName = async (name: string): Promise<Item | null> => {
    try {
        const sql = 'SELECT * FROM items WHERE LOWER(name) = LOWER($1);';
        const { rows } = await pool.query(sql, [name])

        if(rows.length === 0){
            return null
        }

        return rows[0]
    } catch (error) {
        throw new Error('Database query failed');
    }
};

const deleteItemById = async (id: number): Promise<number | null> =>{
    try {
        const sql = 'DELETE FROM items WHERE id = $1;';
        const response = await pool.query(sql, [id]);

        if (response.rowCount === 0){
            return null
        }

        return id
    } catch (error) {
    throw new Error('Database query failed')
    }
}

const updateItemById = async (item: ItemUpdateRequest): Promise<Item> =>{
    try {
        const { id, name, description, price, material, size, color, category, other, image, image_id } = item
        const sql = `UPDATE items
                    SET name=$1, description=$2, price=$3, material=$4, size=$5, color=$6, category=$7, other=$8, image=$9, image_id=$10
                    WHERE id=$11 RETURNING *;`
        const { rows } = await pool.query(sql,[
            name,
            description,
            price,
            material || null,
            size || null,
            color || null,
            category || null,
            other || null,
            image || DEFAULT_IMAGE,
            image_id || null,
            id
        ])

        return rows[0]
      } catch(error) {
        throw new Error('Database query failed')
      }
}

const DEFAULT_IMAGE = "default.png";
const DEFAULT_IMAGE_ID = "default.png";

// check if the image is uploaded to cloudinary or local storage or use default image
const handleImageData = (req: Request) => {
    if (!req.file)
        return {
            image: DEFAULT_IMAGE,
            image_id: DEFAULT_IMAGE_ID
        }
    if (storage instanceof CloudinaryStorage) {
        return {
            image: req.file.path,
            image_id: req.file.filename
        }
    } else {
        return {
            image: req.file.filename,
            image_id: req.file.filename
        }
    }
};

const handleImageDelete = async (item: { image?: string; image_id?: string} ) => {
    // Delete the old image from cloudinary
    if (storage instanceof CloudinaryStorage) {
        if (item.image_id && item.image !== DEFAULT_IMAGE) {
                const publicId = item.image_id
            await cloudinary.v2.uploader.destroy(publicId)
                .then(result => console.log("Cloudinary delete result:", result))
                .catch(error => console.error("Cloudinary deletion error:", error));
        }
    } else {
        // Delete the old image from local storage
        const imagePath = `uploads/images/${item.image}`;
        if( fs.existsSync(imagePath)) {
            fs.unlink(imagePath, (err: any) => {
                if (err) {
                    console.error('Error deleting image:', err);
                } else {
                    console.log('Image deleted successfully');
                }
            })
        }
    }
}

export {
    fetchItems,
    fetchItemsByOwner,
    fetchItemById,
    insertItem,
    findByName,
    deleteItemById,
    updateItemById,
    handleImageData,
    handleImageDelete
}