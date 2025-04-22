import PropTypes from "prop-types"
import Item from "./Item"
import './ItemList.css'

const ItemsList = ({items}) =>{

    return(
        <ul className="item-list">
            {items.map( (item) =>
                <Item
                    key={item.id}
                    itemId={item.id}
                    name={item.name}
                    price={item.price}
                    description={item.description}
                    image={item.image}
                />
            )}
        </ul>
    )
}

ItemsList.prototype = {
    items: PropTypes.array
}

export default ItemsList