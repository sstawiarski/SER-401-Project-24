import React , {useState, useEffect} from 'react';
import AssetPageHeader from '../components/AssetPageHeader'
import AssetList from '../components/AssetList'
import Searchbar from '../components/Searchbar'
import AssetTable from '../components/AssetTable'

const AllAssets = () => {

    const REQUEST_STATUS = {
        LOADING: "loading",
        SUCCESS: "success",
        ERROR: "error"
    }
    const [assets, setAssets] = useState([]);
    const [status, setStatus] = useState(REQUEST_STATUS.LOADING);
    const [error, setError] = useState({});

    const success = status === REQUEST_STATUS.SUCCESS;
    const isLoading = status === REQUEST_STATUS.LOADING;
    const hasErrored = status === REQUEST_STATUS.ERROR;

    useEffect(() =>{
        const fetchAssets = async () => {
            try {
            const result = await fetch(`http://localhost:4000/assets/`);
            const json = await result.json();
            setStatus(REQUEST_STATUS.SUCCESS);
            return json;
            } catch (e) {
                setStatus(REQUEST_STATUS.ERROR);
                setError(e);
            }
        };

        fetchAssets()
        .then(result => {
            setAssets(result);
        },);
    },[])

    return (
        <div>
        <AssetPageHeader />
        <div
        style = {{margin: '10px 0 20px 0'}}>
            <Searchbar /></div>
        <div>    
            <AssetTable data ={assets}/>
        </div>
    </div>);

}

export default AllAssets;