import { useLocation } from "react-router-dom";
function Secondpage() {
    const location = useLocation();
    return (
        <div style={{backgroundColor: 'lightblue', height: '100vh'}}>
            <div>{location.state.id}</div>
        </div>
    )
}

export default Secondpage;
