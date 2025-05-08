import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { useAuthContext } from "../../shared/context/auth-context";
import { deleteItem } from "../api/items";
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Button from '../../shared/components/Button/Button';
import Card from '../../shared/components/Card/Card';
import Modal from '../../shared/components/Modal/Modal';
import './Item.css'


const Item = ({ itemId, name, price, description, material, size, color, category, other, image, owner, isOwner, setDeleteMessage }) => {

    const history = useHistory();
    const { token } = useAuthContext();
    const queryClient = useQueryClient();

    const [showDescription, setShowDescription] = useState(false);
    const [showFullImage, setShowFullImage] = useState(false);

    const [showPurchaseModal, setShowPurchaseModal] = useState(false);

    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const showConfirmationHandler = () => setShowConfirmationModal(true);
    const cancelConfirmationHandler = () => setShowConfirmationModal(false);

    const deleteItemMutation = useMutation({
        mutationFn: deleteItem,
        onSuccess: (data) => {
            queryClient.invalidateQueries(['items'])
            setDeleteMessage(data.message);
            setTimeout( () => setDeleteMessage(""), 5000);
        },
        onError: (error) => {
            setDeleteMessage("Failed to delete item. " + error);
            setTimeout( () => setDeleteMessage(""), 5000);
        }
    })

    const deleteConfirmedHandler = () => {
        setShowConfirmationModal(false)
        deleteItemMutation.mutate({
            itemId: itemId,
            token: token
        })
    }

    const handleEdit = () => {
        history.push(`/items/edit/${itemId}`);
    }

    const toggleDescriptionHandler = () => {
        setShowDescription((prevState) => !prevState); // Show/hide info
        setShowFullImage((prevState) => !prevState);
    };

    const handleBuy = () => {
        setShowPurchaseModal(true); // Show the purchase modal
    };

    const closePurchaseModalHandler = () => {
        setShowPurchaseModal(false); // Close the purchase modal
    };

    const itemDetails = [
        { label: "🧵 Material", value: material },
        { label: "📏 Size", value: size },
        { label: "🎨 Color", value: color },
        { label: "🗂️ Category", value: category },
        { label: "💬 Other", value: other },
    ];

    // Filter out rows where the value is empty or null
    const filteredDetails = itemDetails.filter(detail => detail.value);

    return(
        <>
            <li className='item'>
                <Card className="item__content">
                    <div className={`item__image ${showFullImage ? "item__image--scaled" : ""}`}>
                        <img
                            src={image.startsWith("http") ? image : `${import.meta.env.VITE_API_URL}/images/${image}`}
                            alt={name}
                        />
                    </div>
                    <div className='item__info'>
                        <h3>{name} - {price} €</h3>
                        {showDescription && <h4>Seller: {owner}</h4>}
                        {showDescription && <p>{description}</p>}
                        {showDescription && (
                            <div className="item__details">
                                <table className="item__details-table">
                                    <tbody>
                                        {filteredDetails.map((detail, index) => (
                                            <tr key={index}>
                                                <td><strong>{detail.label}:</strong></td>
                                                <td>{detail.value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                    {isOwner ? (
                        <div className='item__actions'>
                            <Button onClick={toggleDescriptionHandler}>
                                {showDescription ? 'Hide' : 'View'}
                            </Button>
                            <Button inverse onClick={handleEdit}>Edit</Button>
                            <Button danger onClick={showConfirmationHandler}>Delete</Button>
                        </div>
                    ) : (
                        <div className='item__actions'>
                            <Button onClick={toggleDescriptionHandler}>
                                {showDescription ? 'Hide' : 'View'}
                            </Button>
                            <Button onClick={handleBuy}>Buy</Button>
                        </div>
                    )}
                </Card>
            </li>
            {/* Modal for deleting */}
            <Modal
                show = {showConfirmationModal}
                header="Are you sure?"
                footerClass="place-item__modal-actions"
                footer={
                    <>
                        <Button inverse onClick={cancelConfirmationHandler}>Cancel</Button>
                        <Button delete onClick={deleteConfirmedHandler}>Delete</Button>
                    </>
                }
            >
                <p>Are you sure? Once it´s gone, it´s gone! 😰</p>
            </Modal>
            {/* Purchase Modal */}
            <Modal
                show={showPurchaseModal}
                header="Purchase Successful✨"
                footerClass="place-item__modal-actions"
                footer={
                    <Button onClick={closePurchaseModalHandler}>Close</Button>
                }
            >
                <p>Thank you for your purchase!</p>
                <p>You will receive a confirmation email shortly.</p>
                <p>Enjoy your new item!</p>
                <p>Best regards, {owner}</p>
                <p className='modal__emoji'>🫱🏻‍🫲🏻</p>
            </Modal>
        </>
    )
}

Item.propTypes = {
    itemId: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    material: PropTypes.string,
    size: PropTypes.string,
    color: PropTypes.string,
    category: PropTypes.string,
    other: PropTypes.string,
    owner: PropTypes.string.isRequired,
    isOwner: PropTypes.bool.isRequired,
    image: PropTypes.string.isRequired,
    setDeleteMessage: PropTypes.func.isRequired,
}


export default Item