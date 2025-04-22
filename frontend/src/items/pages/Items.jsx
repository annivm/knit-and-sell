import { useQuery } from "@tanstack/react-query";
import ItemsList from "../components/ItemsList";
import LoadingSpinner from "../../shared/components/LoadingSpinner/LoadingSpinner";

import { getItems } from '../api/items';


const Items = () => {
    const { isLoading, error, data } = useQuery({
        queryKey: ['itemsData'],
        queryFn: () => getItems()

    })
    if(isLoading){
        return (
            <div className="center">
                <LoadingSpinner />
            </div>
        )
    }
    if(error){
        return <h1>Something went wrong</h1>
    }

    return (
        <ItemsList items={data}/>
    )
}


export default Items