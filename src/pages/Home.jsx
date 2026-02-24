import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Home = () => {

  const {store, dispatch} =useGlobalReducer()

	return (
		<div className="contact-list">
			<ul className="container-list" style={{listStyleType: "none"}}>
				{store && store.contacts?.map((item)=> {
					return (
				<li className="contenido-li">
					<p className="Name">{item.userName}</p>
					<p>{item.phone}</p>
					<p>{item.email}</p>
					<p>{item.address}</p>
				</li>
					);
				})}
				
			</ul>
		</div>
	);
}; 