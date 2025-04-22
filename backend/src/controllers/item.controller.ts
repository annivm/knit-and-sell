import { Request, Response } from "express";
import { deleteItemById, fetchItemById, fetchItems, findByName, insertItem, updateItemById } from "../services/item.service";
import { itemByIdRequestSchema, itemCreateRequestSchema, itemUpdateRequestSchema } from "../models/items.model";
import { ZodError } from "zod";


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
        const validatedId = itemByIdRequestSchema.parse(req.params.id)
        console.log(validatedId);

        const item = await fetchItemById(validatedId);
        console.log(item)

        if (!item) {
            res.status(404).json({ error: "Item not found" });
            return
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
        const validatedItem = itemUpdateRequestSchema.parse(req.body)

        const exist = await fetchItemById(validatedItem.id)
        console.log(exist);

        if (!exist){
            res.status(400).json({ error: "Trying to update a non existing item" })
            return
        }
        console.log(validatedItem);

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
    getItemById,
    createItem,
    deleteItem,
    updateItem
}