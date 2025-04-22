import { pool } from "../db/db";
import { Item, ItemCreateRequest, ItemUpdateRequest } from "../models/items.model";


// fetchItems
const fetchItems = async(): Promise<Item[]> => {
    try {
        const response = await pool.query('SELECT * FROM items');
        console.log(response.rows);
        return response.rows;

    } catch (error) {
        console.error(`error fetching items (${error})`)
        throw new Error('Database error')
    }
}



// fetchItemById
const fetchItemById = async(id: number): Promise<Item | null> => {
    try {
        const response = await pool.query('SELECT * FROM items WHERE id=$1;', [id])

        if(response.rows.length === 0){
            return null
        }
        return response.rows[0]
    } catch (error) {
        console.error('Database query error: ', error)
        throw new Error("Database query failed");
    }
}


// insertItem
const insertItem = async(item: ItemCreateRequest): Promise<Item> => {
    try {
        const { name, price, description, image } = item
        const sql = 'INSERT into items(name, price, description, image) VALUES ($1, $2, $3, $4) RETURNING *;'
        const { rows } = await pool.query(sql, [name, price, description, image])
        //console.log(rows);

        return rows[0]

      } catch (error) {
        console.error('Database query error: ', error)
        throw new Error('Database query failed')
      }
}


// findByName
const findByName = async (name: string): Promise<Item | null> => {
    try {
        const sql = 'SELECT * FROM items WHERE LOWER(name) = LOWER($1);';
        //console.log(name);

        const { rows } = await pool.query(sql, [name])

        //console.log(rows)
        if(rows.length === 0){
            return null
        }
        return rows[0]
    } catch (error) {
        console.error('Database query error: ', error);
        throw new Error('Database query failed');
    }
};


// deleteItemById
const deleteItemById = async (id: number): Promise<number | null> =>{
    try {
        const sql = 'DELETE FROM items WHERE id = $1;';
        const response = await pool.query(sql, [id]);

        console.log(response);

        if (response.rowCount === 0){
            return null
        }

        return id
    } catch (error) {
        console.error('Database query error: ', error)
    throw new Error('Database query failed')
    }
}


// updateItemById
const updateItemById = async (item: ItemUpdateRequest): Promise<Item> =>{
    try {
        const { id, name, description, price, image } = item
        const sql = 'UPDATE items SET name=$1, description=$2, price=$3, image=$4 WHERE id=$5 RETURNING *;'
        const { rows } = await pool.query(sql,[name, description, price, image, id])


        return rows[0]

      } catch(error) {
        console.error('Database query error: ', error)
        throw new Error('Database query failed')
      }
}

export {
    fetchItems,
    fetchItemById,
    insertItem,
    findByName,
    deleteItemById,
    updateItemById
}