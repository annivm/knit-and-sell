import { useQuery } from "@tanstack/react-query";
import ItemsList from "../components/ItemsList";
import LoadingSpinner from "../../shared/components/LoadingSpinner/LoadingSpinner";

import { getItems } from '../api/items';
import { useAuthContext } from "../../shared/context/auth-context";


const Items = () => {

    const { userId } = useAuthContext();

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
        <ItemsList items={data} userId={userId} heading={"Items"} isEmpty={"No items here...😒"}/>
    )
}


export default Items