import React, { useState, useRef, useEffect } from 'react';
import type { OrderDetails, UserDetails } from './types';
import { OrderForm } from './components/OrderForm';
import { OrderPreview } from './components/OrderPreview';
import { ShareIcon } from './components/icons/ShareIcon';
import { ResetIcon } from './components/icons/ResetIcon';
import { ActivationScreen } from './components/ActivationScreen';

// Declare htmlToImage for TypeScript since it's loaded from a CDN
declare const htmlToImage: any;

const getInitialOrderState = (): OrderDetails => ({
    party: '',
    orderTo: '',
    design: '',
    factoryDesignNo: '',
    goldWt: '',
    goldKt: '14',
    goldColour: 'Yellow',
    diaWt: '',
    diaQuality: '',
    diaPrice: '',
    goldPrice: '',
    size: '',
    orderDate: new Date().toISOString().split('T')[0],
    deliveryDate: '',
    comments: '',
    images: [],
});

const USER_DETAILS_KEY = 'jewelry-app-user-details';

const App: React.FC = () => {
    const [isActivated, setIsActivated] = useState(false);
    const [companyName, setCompanyName] = useState('');
    const [orderDetails, setOrderDetails] = useState<OrderDetails>(getInitialOrderState());
    
    useEffect(() => {
        // Check if the app is already activated on this device
        const storedDetails = localStorage.getItem(USER_DETAILS_KEY);
        if (storedDetails) {
            try {
                const user: UserDetails = JSON.parse(storedDetails);
                if(user.company && user.name && user.mobile) {
                    setIsActivated(true);
                    setCompanyName(user.company);
                }
            } catch (error) {
                console.error("Failed to parse user details from localStorage", error);
                localStorage.removeItem(USER_DETAILS_KEY);
            }
        }
    }, []);

    const partyExportRef = useRef<HTMLDivElement>(null);
    const orderToExportRef = useRef<HTMLDivElement>(null);

    const generateImage = async (ref: React.RefObject<HTMLDivElement>) => {
        if (ref.current === null) {
            throw new Error("Preview element not found");
        }
        return await htmlToImage.toJpeg(ref.current, { 
            quality: 0.95, 
            backgroundColor: '#1f2937',
            // Add cacheBust to help prevent image loading issues on certain platforms like iOS.
            cacheBust: true
        });
    };

    const dataURLtoFile = (dataurl: string, filename: string): File | null => {
        try {
            const arr = dataurl.split(',');
            if (arr.length < 2) return null;
            const mimeMatch = arr[0].match(/:(.*?);/);
            if (!mimeMatch) return null;
            const mime = mimeMatch[1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while(n--){
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], filename, {type:mime});
        } catch (e) {
            console.error("Error converting data URL to file", e);
            return null;
        }
    }

    const handleSaveOrShare = async (type: 'party' | 'orderTo') => {
        const ref = type === 'party' ? partyExportRef : orderToExportRef;
        const fileName = `${type === 'party' ? orderDetails.party || 'party' : orderDetails.orderTo || 'workshop'}_order_${orderDetails.orderDate}.jpg`;
        
        try {
            const dataUrl = await generateImage(ref);
            const file = dataURLtoFile(dataUrl, fileName);

            // Use Web Share API if available (for mobile/APK)
            if (file && navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: 'Jewelry Order',
                    text: `Order details for ${type === 'party' ? orderDetails.party : orderDetails.orderTo}`,
                });
            } else { // Fallback to direct download for desktop browsers
                const link = document.createElement('a');
                link.download = fileName;
                link.href = dataUrl;
                link.click();
            }
        } catch (err) {
            console.error('Oops, something went wrong!', err);
            alert('Failed to save or share image. Please try again.');
        }
    };
    
    const handleReset = () => {
        setOrderDetails(getInitialOrderState());
    };

    const handleActivationSuccess = (details: UserDetails) => {
        localStorage.setItem(USER_DETAILS_KEY, JSON.stringify(details));
        setIsActivated(true);
        setCompanyName(details.company);
    };

    if (!isActivated) {
        return <ActivationScreen onActivationSuccess={handleActivationSuccess} />;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 font-sans p-4 sm:p-6">
            <div className="max-w-screen-2xl mx-auto">
                <header className="text-center mb-6">
                    <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-500">
                        Jewelry Order Creator
                    </h1>
                    <p className="text-gray-400 mt-1 text-sm">
                        Fill in the details to generate a new order card.
                    </p>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <div className="lg:col-span-3">
                        <OrderForm 
                            orderDetails={orderDetails} 
                            setOrderDetails={setOrderDetails} 
                            onReset={handleReset} 
                        />
                    </div>
                    
                    <div className="lg:col-span-2 space-y-4">
                        <h2 className="text-xl font-semibold text-amber-400 border-b-2 border-amber-400/20 pb-1">Live Preview</h2>
                        <div className="flex justify-center lg:justify-start">
                            <OrderPreview orderDetails={orderDetails} viewMode="full" companyName={companyName} />
                        </div>
                        
                        <div className="flex justify-between items-center pt-2">
                             <h2 className="text-xl font-semibold text-amber-400">Actions</h2>
                            <button
                                onClick={handleReset}
                                className="flex items-center justify-center gap-2 bg-red-800/80 text-red-200 font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-red-700 transition-all duration-300 transform hover:scale-105"
                            >
                                <ResetIcon />
                                Reset
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => handleSaveOrShare('party')} disabled={!orderDetails.party} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold py-2.5 px-3 rounded-lg shadow-lg hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100">
                                <ShareIcon /> Save/Share (Party)
                            </button>
                            <button onClick={() => handleSaveOrShare('orderTo')} disabled={!orderDetails.orderTo} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold py-2.5 px-3 rounded-lg shadow-lg hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100">
                                <ShareIcon /> Save/Share (Workshop)
                            </button>
                        </div>
                    </div>
                </main>
            </div>

            {/* Hidden components for accurate exporting */}
            <div className="absolute -left-[9999px] top-0">
                <div ref={partyExportRef} className="p-1">
                    <OrderPreview orderDetails={orderDetails} viewMode="party" companyName={companyName} />
                </div>
                <div ref={orderToExportRef} className="p-1">
                    <OrderPreview orderDetails={orderDetails} viewMode="orderTo" companyName={companyName} />
                </div>
            </div>
        </div>
    );
};

export default App;
