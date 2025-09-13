import React, { useCallback, useState } from 'react';
import type { OrderDetails } from '../types';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { CameraIcon } from './icons/CameraIcon';
import { TrashIcon } from './icons/TrashIcon';
import { ResetIcon } from './icons/ResetIcon';

interface OrderFormProps {
    orderDetails: OrderDetails;
    setOrderDetails: React.Dispatch<React.SetStateAction<OrderDetails>>;
    onReset: () => void;
}

export const OrderForm: React.FC<OrderFormProps> = ({ orderDetails, setOrderDetails, onReset }) => {
    const [imageError, setImageError] = useState('');
    
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setOrderDetails(prev => ({ ...prev, [name]: value }));
    }, [setOrderDetails]);

    const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const currentImageCount = orderDetails.images.length;
            if (currentImageCount + files.length > 3) {
                setImageError('You can upload a maximum of 3 images.');
                setTimeout(() => setImageError(''), 3000); // Clear error after 3 seconds
                e.target.value = ''; // Reset file input
                return;
            }

            files.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setOrderDetails(prev => ({ ...prev, images: [...prev.images, reader.result as string] }));
                };
                reader.readAsDataURL(file);
            });
            e.target.value = ''; // Reset file input to allow re-uploading the same file
        }
    }, [setOrderDetails, orderDetails.images]);
    
    const handleRemoveImage = useCallback((indexToRemove: number) => {
        setOrderDetails(prev => ({
            ...prev,
            images: prev.images.filter((_, index) => index !== indexToRemove),
        }));
    }, [setOrderDetails]);

    return (
        <Card>
            <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-500 border-b-2 border-amber-400/20 pb-1 mb-4">Order Details</h2>
            <form className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input label="Party (Customer)" name="party" value={orderDetails.party} onChange={handleChange} placeholder="Customer Name" />
                    <Input label="Order To (Workshop)" name="orderTo" value={orderDetails.orderTo} onChange={handleChange} placeholder="Workshop Name" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-2">
                      <Input label="Design Code / Name" name="design" value={orderDetails.design} onChange={handleChange} placeholder="Design Code or Name" />
                    </div>
                    <Input label="Size" name="size" value={orderDetails.size} onChange={handleChange} placeholder="e.g., 7 US, 14 INT" />
                </div>
                
                <Input label="Factory Design No. (Internal)" name="factoryDesignNo" value={orderDetails.factoryDesignNo} onChange={handleChange} placeholder="This number is only for the factory" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Input label="Gold Wt (gm)" name="goldWt" value={orderDetails.goldWt} onChange={handleChange} placeholder="e.g., 4-6" type="text" />
                     <div>
                        <label htmlFor="goldKt" className="block text-xs font-medium text-gray-400 uppercase mb-1">Gold Karat</label>
                        <select
                            id="goldKt"
                            name="goldKt"
                            value={orderDetails.goldKt}
                            onChange={handleChange}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-1.5 px-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                        >
                            <option value="9">9 KT</option>
                            <option value="14">14 KT</option>
                            <option value="18">18 KT</option>
                            <option value="20">20 KT</option>
                            <option value="22">22 KT</option>
                        </select>
                    </div>
                     <div>
                        <label htmlFor="goldColour" className="block text-xs font-medium text-gray-400 uppercase mb-1">Gold Colour</label>
                        <select
                            id="goldColour"
                            name="goldColour"
                            value={orderDetails.goldColour}
                            onChange={handleChange}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-1.5 px-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                        >
                            <option value="Yellow">Yellow</option>
                            <option value="Rose">Rose</option>
                            <option value="White">White</option>
                            <option value="Yellow-White">Yellow-White</option>
                            <option value="Rose-White">Rose-White</option>
                            <option value="Yellow-Rose">Yellow-Rose</option>
                        </select>
                    </div>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    <Input label="Diamond Wt (ct)" name="diaWt" value={orderDetails.diaWt} onChange={handleChange} placeholder="0.00" type="number" />
                    <Input label="Diamond Quality" name="diaQuality" value={orderDetails.diaQuality} onChange={handleChange} placeholder="e.g., VVS, G-H" />
                    <Input label="Gold Price" name="goldPrice" value={orderDetails.goldPrice} onChange={handleChange} placeholder="Optional" type="number" startAdornment={'₹'} />
                    <Input label="Diamond Price" name="diaPrice" value={orderDetails.diaPrice} onChange={handleChange} placeholder="Optional" type="number" startAdornment={'₹'} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input label="Order Date" name="orderDate" value={orderDetails.orderDate} onChange={handleChange} type="date" />
                    <Input label="Delivery Date" name="deliveryDate" value={orderDetails.deliveryDate} onChange={handleChange} type="date" />
                </div>
                <div>
                    <label htmlFor="comments" className="block text-xs font-medium text-gray-400 uppercase mb-1">Comments</label>
                    <textarea 
                        id="comments"
                        name="comments" 
                        value={orderDetails.comments} 
                        onChange={handleChange} 
                        rows={2}
                        placeholder="Any special instructions..."
                        className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-1.5 px-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                    />
                </div>
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label className="block text-xs font-medium text-gray-400 uppercase">Photos (up to 3)</label>
                        {imageError && <p className="text-sm text-red-400 animate-pulse">{imageError}</p>}
                    </div>
                     <div className="flex items-center gap-2">
                        <div className="grid grid-cols-3 gap-2 flex-grow">
                            {orderDetails.images.map((image, index) => (
                                <div key={index} className="relative group aspect-square">
                                    <img src={image} alt={`Preview ${index + 1}`} className="w-full h-full object-contain rounded-md bg-gray-900/50 p-0.5" />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        className="absolute top-0.5 right-0.5 bg-red-600/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                                        aria-label={`Remove image ${index + 1}`}
                                    >
                                        <TrashIcon />
                                    </button>
                                </div>
                            ))}
                        </div>
                        {orderDetails.images.length < 3 && (
                            <label htmlFor="file-upload" className="flex-shrink-0 cursor-pointer flex flex-col items-center justify-center p-2 h-24 w-24 border-2 border-gray-600 border-dashed rounded-md text-center hover:bg-gray-700/50 transition">
                                <CameraIcon />
                                <span className="mt-1 text-xs text-gray-400">{3 - orderDetails.images.length} left</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" multiple />
                            </label>
                        )}
                    </div>
                </div>

                <div className="border-t border-gray-700 pt-4 mt-4">
                    <button
                        type="button"
                        onClick={onReset}
                        className="w-full flex items-center justify-center gap-2 bg-red-600 text-white font-bold py-2.5 px-4 rounded-lg shadow-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105"
                    >
                        <ResetIcon />
                        Reset Form
                    </button>
                </div>
            </form>
        </Card>
    );
};