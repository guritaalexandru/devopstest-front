import { useEffect, useState } from "react";

function Component() {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('https://devopstest2.thedemo.is/products');
            const newData = await response.json();
            setData(newData);
        };

        fetchData();
    }, []);


    if (data) {
        console.log(data);
        return (
            <div id="Component">
                <h1>{`You have ${data.length} products stored`}</h1>
                <div id="ComponentCards">
                    {
                        data.map(item => (
                            <div key={item.id} className={'product-card'}>
                                <h3>{item.name}</h3>
                                <div>
                                    <span>{'Price: '}</span>
                                    <span>{item.price}</span>
                                </div>
                                <div>
                                    <span>{'Quantity: '}</span>
                                    <span>{item.quantity}</span>
                                </div>
                                <img src={item.picture.url} alt="Product image" />
                            </div>
                        ))}
                </div>
            </div>
        );
    } else {
        return null;
    }
}

export default Component;