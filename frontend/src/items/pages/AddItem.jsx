import { useMutation, useQueryClient } from "@tanstack/react-query"
import Button from "../../shared/components/Button/Button"
import Input from "../../shared/components/Input/Input"
import './AddItem.css'
import { useRef } from "react"
import { createItem } from "../api/items"
import { useAuthContext } from "../../shared/context/auth-context"
import { useHistory } from "react-router-dom"

const AddItem = () =>{

    const queryClient = useQueryClient();

    const { token } = useAuthContext();
    const history = useHistory();

    const nameRef = useRef();
    const priceRef = useRef();
    const descriptionRef = useRef();
    const imageRef = useRef();

    const createItemMutation = useMutation({
        mutationFn: createItem,
        onSuccess: (response) => {
            console.log(response);
            queryClient.invalidateQueries("itemData");
        },
        onError: (error) => {
            console.error(error);
        }
    });

    const itemSubmitHandler = async event => {
        event.preventDefault();
        createItemMutation.mutate({
            name: nameRef.current.value,
            price: priceRef.current.value,
            description: descriptionRef.current.value,
            image: imageRef.current.value,
            token: token
        })
        history.push('/');
    };

    return(
        <form className="item-form" onSubmit={itemSubmitHandler}>
            <Input id="name" ref={nameRef} type="text" label="Name"/>
            <Input id="price" ref={priceRef} type="text" label="Price"/>
            <Input id="description" ref={descriptionRef} type="text" label="Description"/>
            <Input id="image" ref={imageRef} type="text" label="Image"/>
            <Button id="add-item" type="submit">
                Add Item
            </Button>
        </form>
    )
}


export default AddItem