import { Request, Response } from "express";
import { deleteItemById, fetchItemById, fetchItems, fetchItemsByOwner, findByName, insertItem, updateItemById, handleImageData, handleImageDelete } from "../services/item.service";
import { itemByIdRequestSchema, itemCreateRequestSchema, itemUpdateRequestSchema } from "../models/items.model";
import { ZodError } from "zod";
import jwt from 'jsonwebtoken';
import { config } from "../config/env";

const getItems = async (req: Request, res:Response): Promise<void> =>{
    try{
        const data = await fetchItems();
        if (!data) {
            throw new Error('Something went wrong');
        }
        res.json(data);
    }catch(error){
        res.status(500).json({ message: `error fetching items(${error})` })
    }
}

const getMyItems = async (req: Request, res: Response): Promise<void> => {
    try {
        // Extract the token from the Authorization header
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        // Verify the token and extract the user ID
        const decodedToken = jwt.verify(token, config.JWT_KEY) as { id: string };
        const userId = decodedToken.id;

        if (!userId) {
            res.status(400).json({ message: 'Invalid user ID in token' });
            return;
        }

        // Fetch items for the logged-in user
        const data = await fetchItemsByOwner(userId);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getItemById = async (req: Request, res:Response): Promise<void> =>{
    try {
        const id = parseInt(req.params.id)
        const data = await fetchItemById(id);

        if (!data){
            res.status(404).json({ message: "Item not found" })
            return
        }
        res.json(data)

    } catch (error) {
        res.status(500).json({ message: 'Internal server error'})
    }
}

const createItem = async (req: Request, res:Response): Promise<void> =>{
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const decodedToken = jwt.verify(token, config.JWT_KEY) as { id: string };
        const ownerId = decodedToken.id;
        req.body.owner_id = ownerId;

       const name = req.body.name;
       const existingItem = await findByName(name);

       // Check if the item with same name already exist
       if (existingItem != null) {
            const error = [{
                field: 'name',
                message: 'Item with this name already exist'}]
            res.status(400).json({ error: error });
            return
        }

        // Add image to the request body
        const { image, image_id } = handleImageData(req);
        req.body.image = image;
        req.body.image_id = image_id

        const validatedItem = itemCreateRequestSchema.parse(req.body);
        const data = await insertItem(validatedItem)

        res.status(201).send(data);

      } catch (error) {
        if (error instanceof ZodError) {
            const errors = error.issues.map(err => ({
                field: err.path.join('.'),
                message: err.message}));
            res.status(400).json({ error: errors })
            return;
        }
        if(error instanceof Error){
          if('errors' in error){
            res.status(400).json({ message: "Missing a value" })
            return
          }
        }
        res.status(500).json({ message: 'Internal server error' })
      }
}

const deleteItem = async (req: Request, res: Response): Promise<void> => {
    try {
        // check if user is logged in
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const decodedToken = jwt.verify(token, config.JWT_KEY) as { id: string };
        if (!decodedToken.id || decodedToken.id === undefined) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const validatedId = itemByIdRequestSchema.parse(req.params.id)
        const item = await fetchItemById(validatedId);

        if (!item) {
            res.status(404).json({ message: "Item not found" });
            return
        }
        // Check if the user is the owner of the item
        const userId = decodedToken.id;
        if (item.owner_id !== userId) {
            res.status(403).json({ message: 'Forbidden' });
            return;
        }

        // Delete the image from Cloudinary or local storage
        await handleImageDelete(item)

        // Delete the item from the database
        await deleteItemById(validatedId)

        res.status(200).json({ message: `Item "${item.name}" deleted successfully.` });
    } catch (error) {
        if (error instanceof ZodError) {
            const errors = error.issues.map(err => ({
                field: err.path.join('.'),
                message: err.message}));
            res.status(400).json({ error: errors })
            return;
        }
        if (error instanceof Error) {
            if ('errors' in error) {
            res.status(400).json({ error: "Failed to delete item" })
            return
            }
        }
        res.status(500).json({ error: 'Internal server error' })
    }
};

const updateItem = async (req: Request, res: Response) => {
    try {
        // check if user is logged in
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const decodedToken = jwt.verify(token, config.JWT_KEY) as { id: string };
        if (!decodedToken.id || decodedToken.id === undefined) {}
        const userId = decodedToken.id;

        // add image to the request body if it was given
        if (req.file) {
            const { image, image_id } = handleImageData(req);
            req.body.image = image;
            req.body.image_id = image_id
        }

        const validatedItem = itemUpdateRequestSchema.parse(req.body)
        const exist = await fetchItemById(validatedItem.id)

        if (!exist){
            res.status(400).json({ error: "Trying to update a non existing item" })
            return
        }

        // check if the item with same name already exist
        const name = req.body.name;
        const existingItem = await findByName(name);

        if (existingItem !== null && existingItem.name !== name) {
             const error = [{
                 field: 'name',
                 message: 'Item with this name already exist'}]
             res.status(400).json({ error: error });
             return
         }

        // check if the logged in user is the owner
        const itemOwner = exist.owner_id
        if (itemOwner!== userId) {
            res.status(403).json({ error: 'Forbidden' });
            return;
        }

        const data = await updateItemById(validatedItem)

        // Delete the old image from Cloudinary or local storage if new one is uploaded
        if(req.file) {
            await handleImageDelete(exist)
        }

        res.status(200).send(data)
    } catch (error) {
        if (error instanceof ZodError) {
            const errors = error.issues.map(err => ({
                field: err.path.join('.'),
                message: err.message}));
            res.status(400).json({ error: errors })
            return;
        }
        if (error instanceof Error) {
            if ('errors' in error) {
            res.status(400).json({ error: "Missing a required value!" })
            return
            }
        }
        res.status(500).json({ error: 'Internal server error' })
    }
}

export {
    getItems,
    getMyItems,
    getItemById,
    createItem,
    deleteItem,
    updateItem
}