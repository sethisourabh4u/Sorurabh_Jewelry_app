import React from 'react';
import type { OrderDetails } from '../types';

interface OrderPreviewProps {
    orderDetails: OrderDetails;
    viewMode: 'full' | 'party' | 'orderTo';
}

const DetailItem: React.FC<{ label: string; value?: string | null; isEmphasized?: boolean }> = ({ label, value, isEmphasized = false }) => (
    <div>
        <p className={`font-semibold uppercase tracking-wider ${isEmphasized ? 'text-sm text-amber-200/80' : 'text-xs text-amber-200/60'}`}>{label}</p>
        <p className={`font-medium ${isEmphasized ? 'text-base text-gray-50 font-semibold' : 'text-sm text-gray-100'}`}>{value || '–'}</p>
    </div>
);

const formatDate = (dateString: string): string => {
    if (!dateString) return '–';
    const parts = dateString.split('-');
    if (parts.length !== 3) return dateString; // Fallback for invalid format
    const date = new Date(Date.UTC(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2])));
    if (isNaN(date.getTime())) return dateString; // Invalid date

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = months[date.getUTCMonth()];
    const year = date.getUTCFullYear().toString().slice(-2);
    
    return `${day}-${month}-${year}`;
};

export const OrderPreview: React.FC<OrderPreviewProps> = ({ orderDetails, viewMode }) => {
    const { 
        party, orderTo, design, factoryDesignNo, goldWt, goldKt, goldColour, diaWt, diaQuality, diaPrice, goldPrice,
        size, orderDate, deliveryDate, comments, images
    } = orderDetails;

    const formatPrice = (price: string) => {
        if (!price) return '–';
        return `₹${price}`;
    };

    const isWorkshopView = viewMode === 'orderTo';
    const hideWorkshopDetails = isWorkshopView && !!factoryDesignNo;

    return (
        <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden w-full max-w-sm">
            <div className="p-4 bg-gradient-to-br from-gray-800 to-gray-900">
                <h3 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-500 tracking-wider">
                    Jewelry Order
                </h3>
            </div>

            <div className="p-4 space-y-4">
                {images && images.length > 0 && (
                     <div className={`grid gap-2 grid-cols-${Math.min(images.length, 3)}`}>
                        {images.map((img, index) => (
                            <div key={index} className="w-full aspect-square rounded-lg overflow-hidden bg-gray-700">
                                <img src={img} alt={`Design Preview ${index + 1}`} className="w-full h-full object-contain" />
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex justify-between items-start border-t border-gray-700 pt-3">
                    <div className="space-y-2">
                        {viewMode !== 'orderTo' && (
                            <>
                                <DetailItem label="Party" value={party} isEmphasized />
                                <DetailItem label="Design No." value={design} />
                            </>
                        )}
                        {viewMode !== 'party' && <DetailItem label="Order To" value={orderTo} isEmphasized />}
                        {viewMode !== 'party' && factoryDesignNo && (
                            <DetailItem label="Factory No." value={factoryDesignNo} />
                        )}
                    </div>
                    <div className="space-y-2 text-right">
                        <DetailItem label="Order Date" value={formatDate(orderDate)} />
                        <DetailItem label="Delivery Date" value={formatDate(deliveryDate)} />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-x-4 gap-y-3 border-t border-gray-700 pt-3">
                    {hideWorkshopDetails ? <div /> : <DetailItem label="Gold Wt" value={goldWt ? `${goldWt} gm` : '–'} />}
                    <DetailItem label="Gold Karat" value={`${goldKt} KT`} />
                    <DetailItem label="Gold Colour" value={goldColour} />
                    {hideWorkshopDetails ? <div /> : <DetailItem label="Diamond Wt" value={diaWt ? `${diaWt} ct` : '–'} />}
                    {hideWorkshopDetails ? <div /> : <DetailItem label="Dia Quality" value={diaQuality} />}
                    <DetailItem label="Size" value={size} />
                </div>
                
                {(goldPrice || diaPrice) && viewMode !== 'orderTo' && (
                     <div className="grid grid-cols-2 gap-x-4 gap-y-3 border-t border-gray-700 pt-3">
                        {goldPrice && <DetailItem label="Gold Price" value={formatPrice(goldPrice)} />}
                        {diaPrice && <DetailItem label="Diamond Price" value={formatPrice(diaPrice)} />}
                    </div>
                )}
                
                {comments && (
                     <div className="border-t border-gray-700 pt-3">
                        <p className="text-xs text-amber-200/60 font-semibold uppercase tracking-wider">Comments</p>
                        <p className="text-sm text-gray-100 font-medium whitespace-pre-wrap break-words">{comments}</p>
                    </div>
                )}
            </div>
        </div>
    );
};