import { Request, Response } from "express";
import { deleteItemById, fetchItemById, fetchItems, fetchItemsByOwner, findByName, insertItem, updateItemById } from "../services/item.service";
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
        res.status(500).json({message: `error fetching items(${error})`})
    }
}

const getMyItems = async (req: Request, res: Response): Promise<void> => {
    try {
        // Extract the token from the Authorization header
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        // Verify the token and extract the user ID
        const decodedToken = jwt.verify(token, config.JWT_KEY) as { id: string };
        const userId = decodedToken.id;

        if (!userId) {
            res.status(400).json({ error: 'Invalid user ID in token' });
            return;
        }

        // Fetch items for the logged-in user
        const data = await fetchItemsByOwner(userId);
        res.json(data);
    } catch (error) {
        console.error('Error fetching user items:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const getItemById = async (req: Request, res:Response): Promise<void> =>{
    try {
        const id = parseInt(req.params.id)
        const data = await fetchItemById(id);

        if (!data){
            res.status(404).json({message: "Item not found"})
            return
        }
        res.json(data)

    } catch (error) {
        res.send(500).json({ error: 'Internal server error'})
    }
}

const createItem = async (req: Request, res:Response): Promise<void> =>{
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const decodedToken = jwt.verify(token, config.JWT_KEY) as { id: string };
        const ownerId = decodedToken.id;
        req.body.owner_id = ownerId;

       const name = req.body.name;
       const existingItem = await findByName(name);

       if (existingItem != null) {
            res.status(400).json({ error: "Item exist" });
            return
        }

        const validatedItem = itemCreateRequestSchema.parse(req.body);
        const data = await insertItem(validatedItem)
        //console.log(validatedItem);

        res.status(201).send(data);

      } catch (error) {
          if(error instanceof ZodError){
              const errorMessages = error.errors.map(err => err.message);
              res.status(400).json({ error: errorMessages.join(", ") });
              return
          }
        if(error instanceof Error){
          if('errors' in error){
            res.status(400).json( {error: "Missing a value"} )
            return
          }
        }
        res.status(500).json( {error: 'Internal server error'} )
      }
}

const deleteItem = async (req: Request, res: Response): Promise<void> => {
    try {
        // check if the logged in user is the owner
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const decodedToken = jwt.verify(token, config.JWT_KEY) as { id: string };
        if (!decodedToken.id || decodedToken.id === undefined) {}
        const userId = decodedToken.id;
        //console.log("userId: " + userId);

        const validatedId = itemByIdRequestSchema.parse(req.params.id)
        //console.log(validatedId);

        const item = await fetchItemById(validatedId);
        //console.log(item?.id)

        if (!item) {
            res.status(404).json({ error: "Item not found" });
            return
        }
        //console.log(item);
        if (item.owner_id !== userId) {
            res.status(403).json({ error: 'Forbidden' });
            return;
        }

        const data = await deleteItemById(validatedId)

        res.status(200).json({ message: "Item deleted successfully" });
    } catch (error) {
        if (error instanceof Error) {
            if ('errors' in error) {
              res.status(400).json({ error: "Missing a required value" })
              return
            }
          }
        res.status(500).json( {error: 'Internal server error'})
    }
};


// update item
const updateItem = async (req: Request, res: Response) => {
    try {
        // check if the logged in user is the owner
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const decodedToken = jwt.verify(token, config.JWT_KEY) as { id: string };
        if (!decodedToken.id || decodedToken.id === undefined) {}
        const userId = decodedToken.id;


        const validatedItem = itemUpdateRequestSchema.parse(req.body)
        const exist = await fetchItemById(validatedItem.id)

        if (!exist){
            res.status(400).json({ error: "Trying to update a non existing item" })
            return
        }

        const itemOwner = exist.owner_id

        if (itemOwner!== userId) {
            res.status(403).json({ error: 'Forbidden' });
            return;
        }

        const data = await updateItemById(validatedItem)
        res.status(200).send(data)
    } catch (error) {
        if (error instanceof Error) {
            if ('errors' in error) {
              res.status(400).json({ error: "Missing a required value!" })
              return
            }
          }
          res.status(500).json( {error: 'Internal server error'})
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