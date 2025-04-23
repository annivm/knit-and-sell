export const getItems = async () => {
    const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/items`
    );
    return await res.json();
}

export const getMyItems = async ({token}) => {
  const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/items/myitems`,
      {
          headers: {
              Authorization: 'Bearer ' + token
          }
      }
  );
  if (!res.ok) {
    throw new Error('Failed to fetch user items');
  }

  return await res.json();
}

export const createItem = async ({name, price, description, material, size, color, category, other, image, token, userId}) => {
    console.log(name, price, description, material, size, color, category, other, image, userId);
    const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/items`,
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                Authorization: 'Bearer ' + token
            },
            body: JSON.stringify({
                name,
                price,
                description,
                material,
                size,
                color,
                category,
                other,
                image
            })
        }
    );
    return await res.json();
}

export const getItemById = async ({itemId}) => {
    const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/items/${itemId}`
      );

      if (!res.ok) throw new Error("Failed to fetch item data");

      return await res.json();
}

export const updateItem = async ({itemId, name, price, description, material, size, color, category, other, image, token}) => {
 const res = await fetch(
    `${import.meta.env.VITE_API_URL}/api/items`,
    {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        id: itemId,
        name,
        price,
        description,
        material,
        size,
        color,
        category,
        other,
        image
      })
    }
  );

  if (!res.ok) {
    throw new Error("Failed to update item");
  }

  return await res.json();
}

export const deleteItem = async ({itemId, token}) => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/items/${itemId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + token
        }
      }
    )
    if (!res.ok) throw new Error("Failed to delete item");

    return await res.json();
}