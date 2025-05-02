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
    const [inputErrors, setInputErrors] = useState({});
    const [imageFile, setImageFile] = useState(null);

    const nameRef = useRef();
    const priceRef = useRef();
    const descriptionRef = useRef();
    const materialRef = useRef();
    const sizeRef = useRef();
    const colorRef = useRef();
    const categoryRef = useRef();
    const otherRef = useRef();
    //const imageRef = useRef();

    const createItemMutation = useMutation({
        mutationFn: createItem,
        onSuccess: () => {
            queryClient.invalidateQueries("itemData");
            setErrorMessage("");
            history.push('/');
        },
        onError: (error) => {
            // console.error(error.response?.error);
            if (error.response?.error) {
                // Get all errors from the inputs
                const errors = {};
                error.response.error.forEach((err) => {
                    errors[err.field] = err.message;
                });
                setInputErrors(errors);
            } else {
                setInputErrors({ general: "Failed to add item. Please try again." });
            }

        }
    });

    const handleImageChange = (event) => {
        const file = event.target.files[0]
        // console.log(file)
        if (file) {
            setImageFile(file)
        } else {
            setImageFile(null)
        }
    }

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
            image: imageFile,
            token: token,
            userId: userId
        })

    };

    return(
        <>
            <h2>Add Item</h2>
            <form className="item-form" onSubmit={itemSubmitHandler}>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <Input id="name" ref={nameRef} type="text" label="Name"/>
                {inputErrors.name && <p className="error-message">{inputErrors.name}</p>}

                <Input id="price" ref={priceRef} type="text" label="Price"/>
                {inputErrors.price && <p className="error-message">{inputErrors.price}</p>}

                <Input id="description" ref={descriptionRef} type="text" label="Description"/>
                {inputErrors.description && <p className="error-message">{inputErrors.description}</p>}

                <Input id="material" ref={materialRef} type="text" label="Material (optional)"/>
                <Input id="size" ref={sizeRef} type="text" label="Size (optional)"/>
                <Input id="color" ref={colorRef} type="text" label="Color (optional)"/>
                <Input id="category" ref={categoryRef} type="text" label="Category (optional)"/>
                <Input id="other" ref={otherRef} type="text" label="Other (optional)"/>

                <div>
                    {imageFile && <p>{imageFile?.name}</p>}
                    <label htmlFor="file" className="button button--inverse" >+ Upload Image</label>
                    <input id="file" type="file" accept="image/*" onChange={handleImageChange}/>
                </div>

                <Button id="add-item" type="submit">
                    Add Item
                </Button>
            </form>
        </>
    )
}


export default AddItem