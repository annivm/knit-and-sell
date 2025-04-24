import { pool } from "../db/db";
import { Item, ItemCreateRequest, ItemUpdateRequest } from "../models/items.model";


// fetchItems
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
            items.owner_id,
            users.name AS owner_name
        FROM items
        INNER JOIN users ON items.owner_id = users.id
        `;
        const response = await pool.query(query);
        //console.log(response.rows);
        return response.rows;

    } catch (error) {
        console.error(`error fetching items (${error})`)
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
            items.owner_id,
            users.name AS owner_name
        FROM items
        INNER JOIN users ON items.owner_id = users.id
        WHERE items.owner_id = $1
        `;
        const { rows } = await pool.query(query, [ownerId]);
        return rows;
    } catch (error) {
        console.error('Database query error:', error);
        throw new Error('Database query failed');
    }
};

// fetchItemById
const fetchItemById = async(id: number): Promise<Item | null> => {
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
            items.owner_id,
            users.name AS owner_name
        FROM items
        INNER JOIN users ON items.owner_id = users.id
        WHERE items.id=$1
    `;
    try {
        const response = await pool.query(query, [id])

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
        const { name, price, description, material, size, color, category, other, image, owner_id } = item
        const sql = `INSERT into items
                    (name, price, description, material, size, color, category, other, image, owner_id)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *;`
        const { rows } = await pool.query(sql, [
            name,
            price,
            description,
            material || null,
            size || null,
            color || null,
            category || null,
            other || null,
            image || "default.png",
            owner_id
        ])
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

        //console.log(response);

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
        const { id, name, description, price, material, size, color, category, other, image } = item
        const sql = `UPDATE items
                    SET name=$1, description=$2, price=$3, material=$4, size=$5, color=$6, category=$7, other=$8, image=$9
                    WHERE id=$10 RETURNING *;`
        const { rows } = await pool.query(sql,[
            name,
            description,
            price,
            material || null,
            size || null,
            color || null,
            category || null,
            other || null,
            image || "default.png",
            id
        ])


        return rows[0]

      } catch(error) {
        console.error('Database query error: ', error)
        throw new Error('Database query failed')
      }
}

export {
    fetchItems,
    fetchItemsByOwner,
    fetchItemById,
    insertItem,
    findByName,
    deleteItemById,
    updateItemById
}