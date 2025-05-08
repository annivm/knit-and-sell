
import {useRef, useEffect, useState} from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useHistory } from "react-router-dom";
import { useAuthContext } from "../../shared/context/auth-context"
import { getItemById, updateItem } from "../api/items"
import LoadingSpinner from "../../shared/components/LoadingSpinner/LoadingSpinner";
import Input from "../../shared/components/Input/Input";
import Button from "../../shared/components/Button/Button";

import './AddItem.css'


const EditItem = () => {
    const { userId, token } = useAuthContext();

    const history = useHistory();

    const queryClient = useQueryClient();
    const nameRef = useRef();
    const priceRef = useRef();
    const descriptionRef = useRef();
    const materialRef = useRef();
    const sizeRef = useRef();
    const colorRef = useRef();
    const categoryRef = useRef();
    const otherRef = useRef();
    const imageRef = useRef();

    const { id: itemId } = useParams();
    const [inputErrors, setInputErrors] = useState({});
    const [imageFile, setImageFile] = useState(null);

    const { data, isLoading, isError } = useQuery(
        {
            queryKey: ["itemData", itemId],
            queryFn: () => getItemById({ itemId })
        }
    )

    useEffect(() => {
        if (data) {
            nameRef.current.value = data.name || "";
            priceRef.current.value = data.price || "";
            descriptionRef.current.value = data.description || "";
            materialRef.current.value = data.material || "";
            sizeRef.current.value = data.size || "";
            colorRef.current.value = data.color || "";
            categoryRef.current.value = data.category || "";
            otherRef.current.value = data.other || "";
            imageRef.current.value = "";
        }
    }, [data])

    const updateItemMutation = useMutation({
        mutationFn: updateItem,
        onSuccess: () => {
            queryClient.invalidateQueries("itemData");
            queryClient.invalidateQueries(["item", itemId]);
            history.push("/");
        },
        onError: (error) => {
            if (error.response?.error) {
                // Get all errors from the inputs
                const errors = {};
                error.response.error.forEach((err) => {
                    errors[err.field] = err.message;
                });
                setInputErrors(errors);
            } else {
                setInputErrors({ general: "Failed to update item. Please try again." });
            }
        }
    });

    if (isLoading) {
        return (
            <div className="center">
                <LoadingSpinner />
            </div>
        )
    }

    if (isError) {
        return (
            <div className="center">
                <h2>Failed to load the item for editing</h2>
            </div>
        )
    }

    const handleImageChange = (event) => {
        const file = event.target.files[0]
        if (file) {
            setImageFile(file)
            imageRef.current.value = file.name;
        } else {
            setImageFile(null)
        }
    }

    const itemSubmitHandler = async event => {
        event.preventDefault();
        setInputErrors({});

        const errors = {};
        if (!nameRef.current.value) errors.name = "Name is required.";
        if (!priceRef.current.value) errors.price = "Price is required.";
        if (!descriptionRef.current.value) errors.description = "Description is required.";

        if (Object.keys(errors).length > 0) {
            setInputErrors(errors);
            return;
        }

        const updatedItem = {
            itemId: parseInt(itemId),
            name: nameRef.current.value,
            price: priceRef.current.value,
            description: descriptionRef.current.value,
            material: materialRef.current?.value || "",
            size: sizeRef.current?.value || "",
            color: colorRef.current?.value || "",
            category: categoryRef.current?.value || "",
            other: otherRef.current?.value || "",
            image: imageFile || data.image,
            token: token,
            userId: userId
        };
        updateItemMutation.mutate(updatedItem);

    };

    return(
        <>
            <h2>Edit Item</h2>
            <form className="item-form" onSubmit={itemSubmitHandler}>
                <div className="item__image">
                    <img
                        src={data.image.startsWith("http") ? data.image : `${import.meta.env.VITE_API_URL}/images/${data.image || "default.png"}`}
                        alt={data.name}
                    />
                </div>
                <Input id="name" ref={nameRef} type="text" label="Name"/>
                {inputErrors.name && <p className="error-message">{inputErrors.name}</p>}

                <Input id="price" ref={priceRef} type="text" label="Price"/>
                {inputErrors.price && <p className="error-message">{inputErrors.price}</p>}

                <Input id="description" ref={descriptionRef} type="text" label="Description"/>
                {inputErrors.description && <p className="error-message">{inputErrors.description}</p>}

                <Input id="material" ref={materialRef} type="text" label="Material"/>
                <Input id="size" ref={sizeRef} type="text" label="Size"/>
                <Input id="color" ref={colorRef} type="text" label="Color"/>
                <Input id="category" ref={categoryRef} type="text" label="Category"/>
                <Input id="other" ref={otherRef} type="text" label="Other"/>
                <Input id="image" label="Image" readOnly ref={imageRef}/>
                <div className="image__upload">
                    {imageFile && <p>{imageFile?.name}</p>}
                    <label htmlFor="file" className="button button--inverse" >+ Upload Image</label>
                </div>
                    <input id="file" type="file" accept="image/*" onChange={handleImageChange}/>

                <div className="item-form__actions">
                    {inputErrors.general && <p className="error-message">{inputErrors.general}</p>}
                    <Button type="submit">
                        Update Item
                    </Button>
                    <Button inverse onClick={() => history.push("/")}>
                        Cancel
                    </Button>
                </div>
            </form>
        </>
    )
}

export default EditItem;