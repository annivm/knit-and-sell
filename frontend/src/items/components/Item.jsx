import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

import { useAuthContext } from "../../shared/context/auth-context";


import { deleteItem } from "../api/items";
import './Item.css'
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Button from '../../shared/components/Button/Button';
import Card from '../../shared/components/Card/Card';
import Modal from '../../shared/components/Modal/Modal';


const Item = props => {

    const history = useHistory();
    const { isLoggedIn, token } = useAuthContext();
    const queryClient = useQueryClient();

    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const showConfirmationHandler = () => setShowConfirmationModal(true);
    const cancelConfirmationHandler = () => setShowConfirmationModal(false);

    const deleteItemMutation = useMutation({
        mutationFn: deleteItem,
        onSuccess: (data) => {
            console.log(data);
            queryClient.invalidateQueries(['items'])
        },
        onError: (error) => {
            console.error(error)
        }
    })

    const deleteConfirmedHandler = () => {
        setShowConfirmationModal(false)
        deleteItemMutation.mutate({
            itemId: props.itemId,
            token: token
        })
    }

    const handleEdit = () => {
        history.push(`/items/edit/${props.itemId}`);
    }

    return(
        <>
            <li className='item'>
                <Card className="item__content">
                    <div className='item__image'>
                        <img src={`${import.meta.env.VITE_API_URL}/images/${props.image}`} alt={props.name}/>
                        {/* kuva kansiosta -> {`http://localhost:5001/images/${image}`} */}
                    </div>
                    <div className='item__info'>
                        <h3>{props.name} - {props.price}</h3>
                    </div>
                    {isLoggedIn && (
                        <div className='item__actions'>
                            <Button onClick={handleEdit}>Edit</Button>
                            <Button danger onClick={showConfirmationHandler}>Delete</Button>
                        </div>
                    )}
                </Card>
            </li>
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
                <p>Are you sure? Once it´ gone, it´s gone! 😰</p>
            </Modal>
        </>
    )
}

Item.propTypes = {
    itemId: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired
}


export default Item