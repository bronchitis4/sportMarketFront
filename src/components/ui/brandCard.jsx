import React from 'react';

const BrandCard = ({ name = "nike", logo_url = "https://www.freeiconspng.com/uploads/nike-transparent-logos-background-12.png", onClick = () => {} }) => {
    return (
        <button onClick={onClick} className="cursor-pointer w-40 h-36 bg-white border rounded-2xl p-4 flex flex-col justify-center items-center shadow-sm hover:shadow-lg transform hover:-translate-y-1 transition-all">
            <div className="w-full h-20 flex items-center justify-center mb-2">
                <img
                    src={logo_url}
                    alt={name}
                    className="max-h-16 object-contain"
                />
            </div>
            <h3 className="text-black text-sm font-semibold mt-1">{name}</h3>
        </button>
    );
}

export default BrandCard;
