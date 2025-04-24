import { useMutation, useQueryClient } from "@tanstack/react-query"
import Button from "../../shared/components/Button/Button"
import Input from "../../shared/components/Input/Input"
import './AddItem.css'
import { useRef, useState } from "react"
import { createItem } from "../api/items"
import { useAuthContext } from "../../shared/context/auth-context"
import { useHistory } from "react-router-dom"

const AddItem = () =>{

    const queryClient = useQueryClient();

    const { userId, token } = useAuthContext();
    const history = useHistory();

    const [errorMessage, setErrorMessage] = useState("");

    const nameRef = useRef();
    const priceRef = useRef();
    const descriptionRef = useRef();
    const materialRef = useRef();
    const sizeRef = useRef();
    const colorRef = useRef();
    const categoryRef = useRef();
    const otherRef = useRef();
    const imageRef = useRef();

    const createItemMutation = useMutation({
        mutationFn: createItem,
        onSuccess: (response) => {
            console.log(response);
            queryClient.invalidateQueries("itemData");
            setErrorMessage("");
            history.push('/');
        },
        onError: (error) => {
            console.error(error);
            setErrorMessage(error.response?.data?.error || "Failed to add item. Please try again.");
        }
    });

    const itemSubmitHandler = async event => {
        event.preventDefault();
        setErrorMessage("");

        if (!nameRef.current.value || !priceRef.current.value || !descriptionRef.current.value) {
            setErrorMessage("Name, Price, and Description are required fields.");
            return;
        }

        createItemMutation.mutate({
            name: nameRef.current.value,
            price: priceRef.current.value,
            description: descriptionRef.current.value,
            material: materialRef.current?.value || "",
            size: sizeRef.current.value,
            color: colorRef.current?.value || "",
            category: categoryRef.current?.value || "",
            other: otherRef.current?.value || "",
            image: imageRef.current.value || "default.png",
            token: token,
            userId: userId
        })

    };

    return(
        <form className="item-form" onSubmit={itemSubmitHandler}>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <Input id="name" ref={nameRef} type="text" label="Name"/>
            <Input id="price" ref={priceRef} type="text" label="Price"/>
            <Input id="description" ref={descriptionRef} type="text" label="Description"/>
            <Input id="material" ref={materialRef} type="text" label="Material (optional)"/>
            <Input id="size" ref={sizeRef} type="text" label="Size (optional)"/>
            <Input id="color" ref={colorRef} type="text" label="Color (optional)"/>
            <Input id="category" ref={categoryRef} type="text" label="Category (optional)"/>
            <Input id="other" ref={otherRef} type="text" label="Other (optional)"/>
            <Input id="image" ref={imageRef} type="text" label="Image (optional)"/>
            <Button id="add-item" type="submit">
                Add Item
            </Button>
        </form>
    )
}


export default AddItem