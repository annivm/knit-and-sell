import { useQuery } from "@tanstack/react-query";
import ItemsList from "../components/ItemsList";
import LoadingSpinner from "../../shared/components/LoadingSpinner/LoadingSpinner";
import { useAuthContext } from '../../shared/context/auth-context'

import { getMyItems } from '../api/items';


const MyItems = () => {
    const { token, userId } = useAuthContext();

    const { isLoading, error, data } = useQuery({
        queryKey: ['myItems'],
        queryFn: () => getMyItems({ token }),

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
        <ItemsList items={data} userId={userId} heading={"My Items"}/>
    )
}


export default MyItems