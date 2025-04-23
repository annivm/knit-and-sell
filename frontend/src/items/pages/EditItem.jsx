
import {useRef, useEffect} from "react";
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
    //console.log("itemId: " + itemId);


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
            imageRef.current.value = data.image || "";
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
            console.error(error);
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

    const itemSubmitHandler = async event => {
        event.preventDefault();
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
            image: imageRef.current.value,
            token: token,
            userId: userId
        };
        updateItemMutation.mutate(updatedItem);

    };

    return(
        <form className="item-form" onSubmit={itemSubmitHandler}>
            <div className="item__image">
                <img src={`${import.meta.env.VITE_API_URL}/images/${data.image}`} alt={data.name}/>
            </div>
            <Input id="name" ref={nameRef} type="text" label="Name"/>
            <Input id="price" ref={priceRef} type="text" label="Price"/>
            <Input id="description" ref={descriptionRef} type="text" label="Description"/>
            <Input id="material" ref={materialRef} type="text" label="Material"/>
            <Input id="size" ref={sizeRef} type="text" label="Size"/>
            <Input id="color" ref={colorRef} type="text" label="Color"/>
            <Input id="category" ref={categoryRef} type="text" label="Category"/>
            <Input id="other" ref={otherRef} type="text" label="Other"/>
            <Input id="image" ref={imageRef} type="text" label="Image"/>
            <Button type="submit">
                Update Item
            </Button>
            <Button inverse onClick={() => history.push("/")}>
                Cancel
            </Button>
        </form>
    )
}

export default EditItem;