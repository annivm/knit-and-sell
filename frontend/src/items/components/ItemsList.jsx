import PropTypes from "prop-types"
import Item from "./Item"
import './ItemList.css'

const ItemsList = ({items, userId, heading}) =>{

    return(
        <>
            <h1 className="heading">{heading}</h1>
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
                        image={item.image}
                        owner={item.owner_name}
                        isOwner={item.owner_id === userId}
                    />
                )}
            </ul>
        </>
    )
}

ItemsList.prototype = {
    items: PropTypes.array
}

export default ItemsList