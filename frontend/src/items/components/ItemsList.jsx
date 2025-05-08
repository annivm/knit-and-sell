import PropTypes from "prop-types"
import Item from "./Item"
import './ItemList.css'
import { useState } from "react";

const ItemsList = ({items, userId, heading, isEmpty}) =>{

    const [deleteMessage, setDeleteMessage] = useState("");

    return(
        <>
            { deleteMessage && <p className="message">{deleteMessage}</p> }
            <h1 className="heading">{heading}</h1>
            { items.length === 0 && <p className="list_empty">{isEmpty}</p> }
            <ul className="item-list">
                {items.map( (item) =>
                    <Item
                        key={item.id}
                        itemId={item.id}
                        name={item.name}
                        price={item.price}
                        description={item.description}
                        material={item.material || ""}
                        size={item.size || ""}
                        color={item.color || ""}
                        category={item.category || ""}
                        other={item.other || ""}
                        image={item.image || "default.png"}
                        owner={item.owner_name}
                        isOwner={item.owner_id === userId}
                        setDeleteMessage={setDeleteMessage}
                    />
                )}
            </ul>
        </>
    )
}

ItemsList.propTypes = {
    items: PropTypes.array
}

export default ItemsList